import { NextResponse } from 'next/server';

const cleanEnv = (value) => {
  if (!value) return value;
  return String(value)
    .trim()
    .replace(/,+$/g, '')
    .trim()
    .replace(/^['"`]+|['"`]+$/g, '')
    .trim();
};

const VEDIC_API_KEY = cleanEnv(process.env.VEDIC_ASTRO_API_KEY);
const VEDIC_API_URL = 'https://api.vedicastroapi.com/v3-json/prediction';

const zodiacNumbers = {
  aries: 1,
  taurus: 2,
  gemini: 3,
  cancer: 4,
  leo: 5,
  virgo: 6,
  libra: 7,
  scorpio: 8,
  sagittarius: 9,
  capricorn: 10,
  aquarius: 11,
  pisces: 12,
};

const fallbackPredictions = {
  aries: 'Today brings new opportunities for growth and leadership. Your energy is high, making it perfect for tackling challenging tasks.',
  taurus: 'Focus on stability and practical matters today. Financial decisions made now can benefit you in the long run.',
  gemini: 'Communication flows easily today. Express your ideas freely and connect with others for creative collaboration.',
  cancer: 'Emotional connections deepen today. Family matters take priority and bring you joy and satisfaction.',
  leo: 'Your natural charisma shines bright today. Step into the spotlight and share your gifts with the world.',
  virgo: 'Details matter today. Your analytical skills are sharp, making this a good day for problem solving.',
  libra: 'Balance is key today. Focus on harmony in relationships and beauty in your surroundings.',
  scorpio: 'Deep insights come to you today. Trust your intuition and embrace meaningful transformation.',
  sagittarius: 'Adventure calls today. Explore new ideas, places, or perspectives that expand your horizons.',
  capricorn: 'Hard work pays off today. Your discipline and determination can lead to recognition.',
  aquarius: 'Innovative ideas flow freely today. Think practically while keeping your original perspective.',
  pisces: 'Your creativity and compassion are heightened today. Helping others brings fulfillment.',
};

const defaultColors = {
  aries: 'Red',
  taurus: 'Green',
  gemini: 'Yellow',
  cancer: 'White',
  leo: 'Orange',
  virgo: 'Brown',
  libra: 'Blue',
  scorpio: 'Dark Red',
  sagittarius: 'Purple',
  capricorn: 'Black',
  aquarius: 'Silver',
  pisces: 'Pink',
};

const formatApiDate = (dateValue) => {
  const date = dateValue ? new Date(`${dateValue}T00:00:00`) : new Date();

  if (Number.isNaN(date.getTime())) {
    return formatApiDate();
  }

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

const readableLuckyNumber = (value) => {
  if (Array.isArray(value)) return value.join(', ');
  return value || String(Math.floor(Math.random() * 9) + 1);
};

const joinPredictions = (botResponse) => {
  if (!botResponse || typeof botResponse !== 'object') return '';

  const preferredSections = ['total_score', 'status', 'finances', 'relationship', 'career', 'health'];

  return preferredSections
    .map((key) => botResponse[key]?.split_response || botResponse[key]?.prediction)
    .filter(Boolean)
    .join(' ');
};

const parseVedicResponse = (data, sign, type) => {
  const response = data?.response || data?.data || data?.result || data;
  const prediction = response?.prediction || response?.bot_response?.total_score?.split_response || joinPredictions(response?.bot_response);

  return {
    prediction: prediction || fallbackPredictions[sign],
    luckyColor: response?.lucky_color || response?.luckyColor || defaultColors[sign],
    luckyColorCode: response?.lucky_color_code || '',
    luckyNumber: readableLuckyNumber(response?.lucky_number || response?.luckyNumber),
    luckyTime: response?.lucky_time || '',
    mood: response?.mood || `${type === 'moon' ? 'Reflective' : 'Focused'} & Positive`,
    compatibility: response?.compatibility || '',
    zodiac: response?.zodiac || sign,
    source: 'vedicastro',
    sourceType: type,
  };
};

const fallbackResponse = (sign, type, status = 200) => NextResponse.json({
  success: true,
  source: 'fallback',
  type,
  horoscope: {
    prediction: fallbackPredictions[sign] || 'Today brings positive energy your way. Stay focused on your goals.',
    luckyColor: defaultColors[sign] || 'Red',
    luckyNumber: String(Math.floor(Math.random() * 9) + 1),
    luckyTime: 'Morning hours',
    mood: 'Optimistic',
    compatibility: '',
    source: 'fallback',
    sourceType: type,
  },
}, { status });

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const sign = (searchParams.get('sign') || '').toLowerCase();
  const type = searchParams.get('type') === 'sun' ? 'sun' : 'moon';
  const date = searchParams.get('date');
  const zodiac = zodiacNumbers[sign];

  if (!zodiac) {
    return NextResponse.json({ success: false, error: 'Invalid zodiac sign' }, { status: 400 });
  }

  if (!VEDIC_API_KEY) {
    console.warn('VEDIC_ASTRO_API_KEY is not configured; using fallback horoscope.');
    return fallbackResponse(sign, type);
  }

  try {
    const params = new URLSearchParams({
      api_key: VEDIC_API_KEY,
      date: formatApiDate(date),
      zodiac: String(zodiac),
      split: 'true',
      type: 'big',
      lang: 'en',
    });
    const endpoint = `${VEDIC_API_URL}/daily-${type}?${params.toString()}`;
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });
    const data = await response.json().catch(() => null);

    if (!response.ok || !data || (data.status && Number(data.status) >= 400)) {
      console.error('VedicAstro API error:', response.status, data);
      return fallbackResponse(sign, type);
    }

    return NextResponse.json({
      success: true,
      source: 'vedicastro',
      type,
      horoscope: parseVedicResponse(data, sign, type),
      remainingApiCalls: data.remaining_api_calls,
    });
  } catch (error) {
    console.error('VedicAstro API request failed:', error);
    return fallbackResponse(sign, type);
  }
}

export async function POST(request) {
  return GET(request);
}
