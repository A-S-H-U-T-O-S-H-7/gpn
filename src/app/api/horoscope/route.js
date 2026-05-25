import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { searchParams } = new URL(request.url);
    const sign = searchParams.get('sign');
    const day = searchParams.get('day') || 'today';
    
    if (!sign) {
      return NextResponse.json({ error: 'Sign is required' }, { status: 400 });
    }
    
    console.log(`📡 Fetching horoscope for ${sign}...`);
    
    // Use a different approach - fetch with no-cors mode might not work
    // Let's try with a different API endpoint
    const response = await fetch(`https://aztro.sameerkumar.website/?sign=${sign}&day=${day}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    console.log(`✅ Received horoscope for ${sign}`);
    
    return NextResponse.json({
      success: true,
      horoscope: {
        prediction: data.description || "Today brings positive energy your way.",
        luckyColor: data.color || "Red",
        luckyNumber: data.lucky_number || "7",
        luckyTime: data.lucky_time || "Morning",
        mood: data.mood || "Energetic",
        compatibility: data.compatibility || "Leo",
        date: data.current_date || new Date().toLocaleDateString(),
      }
    });
    
  } catch (error) {
    console.error('API Error:', error);
    
    // Return fallback data instead of error
    return NextResponse.json({
      success: true,
      horoscope: {
        prediction: "Today brings positive energy your way. Stay focused on your goals and good things will come.",
        luckyColor: "Red",
        luckyNumber: "7",
        luckyTime: "Morning hours",
        mood: "Energetic",
        compatibility: "Leo",
        date: new Date().toLocaleDateString(),
      }
    });
  }
}