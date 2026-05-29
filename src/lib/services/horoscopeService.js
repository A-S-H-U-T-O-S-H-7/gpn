import { db } from '@/lib/firebase/config';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  query,
  where,
  serverTimestamp
} from 'firebase/firestore';
import { logActivity, ActivityActions, ActivityEntityTypes } from './activityLogService';

const HOROSCOPE_COLLECTION = 'horoscopes';

export const zodiacSigns = [
  { id: 'aries', name: 'Aries', symbol: '\u2648', date: 'Mar 21 - Apr 19', element: 'Fire' },
  { id: 'taurus', name: 'Taurus', symbol: '\u2649', date: 'Apr 20 - May 20', element: 'Earth' },
  { id: 'gemini', name: 'Gemini', symbol: '\u264A', date: 'May 21 - Jun 20', element: 'Air' },
  { id: 'cancer', name: 'Cancer', symbol: '\u264B', date: 'Jun 21 - Jul 22', element: 'Water' },
  { id: 'leo', name: 'Leo', symbol: '\u264C', date: 'Jul 23 - Aug 22', element: 'Fire' },
  { id: 'virgo', name: 'Virgo', symbol: '\u264D', date: 'Aug 23 - Sep 22', element: 'Earth' },
  { id: 'libra', name: 'Libra', symbol: '\u264E', date: 'Sep 23 - Oct 22', element: 'Air' },
  { id: 'scorpio', name: 'Scorpio', symbol: '\u264F', date: 'Oct 23 - Nov 21', element: 'Water' },
  { id: 'sagittarius', name: 'Sagittarius', symbol: '\u2650', date: 'Nov 22 - Dec 21', element: 'Fire' },
  { id: 'capricorn', name: 'Capricorn', symbol: '\u2651', date: 'Dec 22 - Jan 19', element: 'Earth' },
  { id: 'aquarius', name: 'Aquarius', symbol: '\u2652', date: 'Jan 20 - Feb 18', element: 'Air' },
  { id: 'pisces', name: 'Pisces', symbol: '\u2653', date: 'Feb 19 - Mar 20', element: 'Water' },
];

const todayKey = () => new Date().toISOString().split('T')[0];

const normalizeHoroscope = (data = {}) => ({
  prediction: data.prediction || '',
  luckyColor: data.luckyColor || '',
  luckyNumber: Array.isArray(data.luckyNumber) ? data.luckyNumber.join(', ') : (data.luckyNumber || ''),
  luckyTime: data.luckyTime || '',
  mood: data.mood || '',
  compatibility: data.compatibility || '',
  source: data.source || 'manual',
  sourceType: data.sourceType || '',
});

export const fetchHoroscopeFromAPI = async (sign, type = 'moon', date = null) => {
  try {
    const params = new URLSearchParams({
      sign,
      type,
      date: date || todayKey(),
    });

    const response = await fetch(`/api/horoscope?${params.toString()}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });
    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Failed to fetch horoscope');
    }

    return {
      success: true,
      horoscope: normalizeHoroscope(data.horoscope),
    };
  } catch (error) {
    console.error(`Error fetching horoscope for ${sign}:`, error);
    return { success: false, error: error.message };
  }
};

export const fetchAllHoroscopesFromAPI = async (type = 'moon', date = null) => {
  const results = {};
  const errors = [];

  for (const sign of zodiacSigns) {
    const result = await fetchHoroscopeFromAPI(sign.id, type, date);
    if (result.success) {
      results[sign.id] = result.horoscope;
    } else {
      errors.push(`${sign.name}: ${result.error}`);
    }
  }

  return {
    success: Object.keys(results).length > 0,
    data: results,
    error: errors.join('; '),
  };
};

export const saveHoroscope = async (sign, horoscopeData, adminData, date = null) => {
  try {
    const horoscopeDate = date || todayKey();
    const docId = `${sign}_${horoscopeDate}`;
    const horoscope = normalizeHoroscope(horoscopeData);

    await setDoc(doc(db, HOROSCOPE_COLLECTION, docId), {
      sign,
      date: horoscopeDate,
      ...horoscope,
      isManualOverride: horoscopeData.isManualOverride || false,
      updatedAt: serverTimestamp(),
      updatedBy: adminData?.id || null,
    }, { merge: true });

    return { success: true };
  } catch (error) {
    console.error('Error saving horoscope:', error);
    return { success: false, error: error.message };
  }
};

export const getHoroscope = async (sign, date = null) => {
  try {
    const horoscopeDate = date || todayKey();
    const horoscopeSnap = await getDoc(doc(db, HOROSCOPE_COLLECTION, `${sign}_${horoscopeDate}`));

    if (horoscopeSnap.exists()) {
      return { success: true, horoscope: horoscopeSnap.data() };
    }

    return { success: false, horoscope: null };
  } catch (error) {
    console.error('Error getting horoscope:', error);
    return { success: false, horoscope: null };
  }
};

export const getAllHoroscopes = async (date = null) => {
  try {
    const horoscopeDate = date || todayKey();
    const q = query(collection(db, HOROSCOPE_COLLECTION), where('date', '==', horoscopeDate));
    const snapshot = await getDocs(q);
    const horoscopes = {};

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      horoscopes[data.sign] = data;
    });

    return { success: true, horoscopes };
  } catch (error) {
    console.error('Error getting all horoscopes:', error);
    return { success: false, horoscopes: {} };
  }
};

export const updateAllHoroscopesFromAPI = async (adminData, type = 'moon', date = null) => {
  try {
    const horoscopeDate = date || todayKey();
    const apiResults = await fetchAllHoroscopesFromAPI(type, horoscopeDate);

    if (!apiResults.success) {
      return { success: false, error: apiResults.error || 'Failed to fetch from VedicAstro API' };
    }

    for (const sign of zodiacSigns) {
      const apiData = apiResults.data[sign.id];
      if (apiData) {
        await saveHoroscope(sign.id, {
          ...apiData,
          isManualOverride: false,
          source: 'vedicastro',
          sourceType: type,
        }, adminData, horoscopeDate);
      }
    }

    await logActivity({
      action: ActivityActions.UPDATE,
      entityType: ActivityEntityTypes.HOROSCOPE,
      entityId: 'all',
      entityTitle: 'Daily Horoscopes',
      details: `Updated all horoscopes from VedicAstro API (${type}) for ${horoscopeDate}`,
      adminId: adminData.id,
      adminName: adminData.name,
      adminRole: adminData.role,
    });

    return { success: true };
  } catch (error) {
    console.error('Error updating all horoscopes:', error);
    return { success: false, error: error.message };
  }
};

export const updateHoroscopeManually = async (sign, horoscopeData, adminData, date = null) => {
  try {
    const horoscopeDate = date || todayKey();
    await saveHoroscope(sign, {
      ...horoscopeData,
      isManualOverride: true,
      source: 'manual',
    }, adminData, horoscopeDate);

    await logActivity({
      action: ActivityActions.UPDATE,
      entityType: ActivityEntityTypes.HOROSCOPE,
      entityId: sign,
      entityTitle: `${sign} Horoscope`,
      details: `Manually updated ${sign} horoscope for ${horoscopeDate}`,
      adminId: adminData.id,
      adminName: adminData.name,
      adminRole: adminData.role,
    });

    return { success: true };
  } catch (error) {
    console.error('Error updating horoscope manually:', error);
    return { success: false, error: error.message };
  }
};

export const getHoroscopeForHomepage = async (sign) => {
  try {
    const result = await getHoroscope(sign);

    if (result.success && result.horoscope) {
      const data = result.horoscope;
      return {
        success: true,
        horoscope: {
          prediction: data.prediction,
          luckyColor: data.luckyColor,
          luckyNumber: data.luckyNumber,
          luckyTime: data.luckyTime,
          mood: data.mood,
        }
      };
    }

    const zodiac = zodiacSigns.find((z) => z.id === sign);
    return {
      success: true,
      horoscope: {
        prediction: 'Today brings positive energy your way. Stay focused on your goals.',
        luckyColor: zodiac?.element === 'Fire' ? 'Red' : zodiac?.element === 'Earth' ? 'Green' : 'Blue',
        luckyNumber: Math.floor(Math.random() * 9) + 1,
        luckyTime: 'Morning hours',
        mood: 'Optimistic',
      }
    };
  } catch (error) {
    console.error('Error getting horoscope for homepage:', error);
    return { success: false, error: error.message, horoscope: null };
  }
};
