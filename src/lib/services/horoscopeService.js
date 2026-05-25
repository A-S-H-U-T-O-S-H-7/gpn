import { db } from '@/lib/firebase/config';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { logActivity, ActivityActions, ActivityEntityTypes } from './activityLogService';

const HOROSCOPE_COLLECTION = 'horoscopes';

// Zodiac signs data
export const zodiacSigns = [
  { id: 'aries', name: 'Aries', symbol: '♈', date: 'Mar 21 - Apr 19', element: 'Fire' },
  { id: 'taurus', name: 'Taurus', symbol: '♉', date: 'Apr 20 - May 20', element: 'Earth' },
  { id: 'gemini', name: 'Gemini', symbol: '♊', date: 'May 21 - Jun 20', element: 'Air' },
  { id: 'cancer', name: 'Cancer', symbol: '♋', date: 'Jun 21 - Jul 22', element: 'Water' },
  { id: 'leo', name: 'Leo', symbol: '♌', date: 'Jul 23 - Aug 22', element: 'Fire' },
  { id: 'virgo', name: 'Virgo', symbol: '♍', date: 'Aug 23 - Sep 22', element: 'Earth' },
  { id: 'libra', name: 'Libra', symbol: '♎', date: 'Sep 23 - Oct 22', element: 'Air' },
  { id: 'scorpio', name: 'Scorpio', symbol: '♏', date: 'Oct 23 - Nov 21', element: 'Water' },
  { id: 'sagittarius', name: 'Sagittarius', symbol: '♐', date: 'Nov 22 - Dec 21', element: 'Fire' },
  { id: 'capricorn', name: 'Capricorn', symbol: '♑', date: 'Dec 22 - Jan 19', element: 'Earth' },
  { id: 'aquarius', name: 'Aquarius', symbol: '♒', date: 'Jan 20 - Feb 18', element: 'Air' },
  { id: 'pisces', name: 'Pisces', symbol: '♓', date: 'Feb 19 - Mar 20', element: 'Water' },
];

// Fetch horoscope from our API proxy (solves CORS)
// Fetch horoscope from our API proxy (solves CORS)
export const fetchHoroscopeFromAPI = async (sign) => {
  try {
    const response = await fetch(`/api/horoscope?sign=${sign}&day=today`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const data = await response.json();
    
    // Always return success since our API now returns fallback data
    return {
      success: true,
      horoscope: {
        prediction: data.horoscope?.prediction,
        luckyColor: data.horoscope?.luckyColor,
        luckyNumber: data.horoscope?.luckyNumber,
        luckyTime: data.horoscope?.luckyTime,
        mood: data.horoscope?.mood,
        compatibility: data.horoscope?.compatibility,
        date: data.horoscope?.date,
      }
    };
  } catch (error) {
    console.error(`Error fetching horoscope for ${sign}:`, error);
    // Return fallback data on error
    return {
      success: true,
      horoscope: {
        prediction: "Today brings positive energy your way. Stay focused on your goals.",
        luckyColor: "Red",
        luckyNumber: "7",
        luckyTime: "Morning hours",
        mood: "Energetic",
        compatibility: "Leo",
        date: new Date().toLocaleDateString(),
      }
    };
  }
};

// Fetch all horoscopes from API
export const fetchAllHoroscopesFromAPI = async () => {
  const results = {};
  
  for (const sign of zodiacSigns) {
    const result = await fetchHoroscopeFromAPI(sign.id);
    if (result.success) {
      results[sign.id] = result.horoscope;
    }
    // Add delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  return { success: true, data: results };
};

// Save horoscope to Firestore
export const saveHoroscope = async (sign, horoscopeData, adminData, date = null) => {
  try {
    const today = date || new Date().toISOString().split('T')[0];
    const docId = `${sign}_${today}`;
    const horoscopeRef = doc(db, HOROSCOPE_COLLECTION, docId);
    
    await setDoc(horoscopeRef, {
      sign,
      date: today,
      prediction: horoscopeData.prediction,
      luckyColor: horoscopeData.luckyColor,
      luckyNumber: horoscopeData.luckyNumber,
      luckyTime: horoscopeData.luckyTime || '',
      mood: horoscopeData.mood || '',
      compatibility: horoscopeData.compatibility || '',
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

// Get horoscope from Firestore
export const getHoroscope = async (sign, date = null) => {
  try {
    const today = date || new Date().toISOString().split('T')[0];
    const docId = `${sign}_${today}`;
    const horoscopeRef = doc(db, HOROSCOPE_COLLECTION, docId);
    const horoscopeSnap = await getDoc(horoscopeRef);
    
    if (horoscopeSnap.exists()) {
      return { success: true, horoscope: horoscopeSnap.data() };
    }
    
    return { success: false, horoscope: null };
  } catch (error) {
    console.error('Error getting horoscope:', error);
    return { success: false, horoscope: null };
  }
};

// Get all horoscopes for a date
export const getAllHoroscopes = async (date = null) => {
  try {
    const today = date || new Date().toISOString().split('T')[0];
    const horoscopesRef = collection(db, HOROSCOPE_COLLECTION);
    const q = query(horoscopesRef, where('date', '==', today));
    const snapshot = await getDocs(q);
    
    const horoscopes = {};
    snapshot.forEach(doc => {
      const data = doc.data();
      horoscopes[data.sign] = data;
    });
    
    return { success: true, horoscopes };
  } catch (error) {
    console.error('Error getting all horoscopes:', error);
    return { success: false, horoscopes: {} };
  }
};

// Update all horoscopes from API (Admin action)
export const updateAllHoroscopesFromAPI = async (adminData) => {
  try {
    const apiResults = await fetchAllHoroscopesFromAPI();
    
    if (!apiResults.success) {
      return { success: false, error: 'Failed to fetch from API' };
    }
    
    const today = new Date().toISOString().split('T')[0];
    
    for (const sign of zodiacSigns) {
      const apiData = apiResults.data[sign.id];
      if (apiData) {
        await saveHoroscope(sign.id, {
          prediction: apiData.prediction,
          luckyColor: apiData.luckyColor,
          luckyNumber: apiData.luckyNumber,
          luckyTime: apiData.luckyTime,
          mood: apiData.mood,
          compatibility: apiData.compatibility,
          isManualOverride: false,
        }, adminData, today);
      }
    }
    
    await logActivity({
      action: ActivityActions.UPDATE,
      entityType: ActivityEntityTypes.HOROSCOPE,
      entityId: 'all',
      entityTitle: 'Daily Horoscopes',
      details: 'Updated all horoscopes from Aztro API',
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

// Update single horoscope manually
export const updateHoroscopeManually = async (sign, horoscopeData, adminData) => {
  try {
    await saveHoroscope(sign, {
      ...horoscopeData,
      isManualOverride: true,
    }, adminData);
    
    await logActivity({
      action: ActivityActions.UPDATE,
      entityType: ActivityEntityTypes.HOROSCOPE,
      entityId: sign,
      entityTitle: `${sign} Horoscope`,
      details: `Manually updated ${sign} horoscope`,
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

// Get horoscope for homepage (public)
export const getHoroscopeForHomepage = async (sign) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const docId = `${sign}_${today}`;
    const horoscopeRef = doc(db, HOROSCOPE_COLLECTION, docId);
    const horoscopeSnap = await getDoc(horoscopeRef);
    
    if (horoscopeSnap.exists()) {
      const data = horoscopeSnap.data();
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
    
    // Return a default message if not found
    const zodiac = zodiacSigns.find(z => z.id === sign);
    return {
      success: true,
      horoscope: {
        prediction: `Today brings positive energy your way. Stay focused on your goals.`,
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