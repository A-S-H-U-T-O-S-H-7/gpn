import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Helper to clean HTML content
function cleanHtmlContent(html) {
  if (!html) return '';
  let text = html.replace(/<[^>]*>/g, ' ');
  text = text.replace(/&nbsp;/g, ' ');
  text = text.replace(/&[a-z]+;/gi, ' ');
  text = text.replace(/\s+/g, ' ').trim();
  return text;
}

// Better description formatter
function formatDescription(text) {
  if (!text) return '';
  
  // Remove existing HTML tags first
  let cleanText = text.replace(/<[^>]*>/g, '');
  
  // Split by periods followed by space and capital letter (sentence endings)
  // Also split by question marks and exclamation marks
  let sentences = cleanText.split(/(?<=[.!?])\s+(?=[A-Z\u0900-\u097F])/);
  
  // Group sentences into paragraphs (3-4 sentences per paragraph)
  let paragraphs = [];
  for (let i = 0; i < sentences.length; i += 3) {
    let paragraph = sentences.slice(i, i + 3).join(' ');
    if (paragraph.trim().length > 20) {
      paragraphs.push(`<p>${paragraph.trim()}</p>`);
    }
  }
  
  // If no paragraphs created, return as single paragraph
  if (paragraphs.length === 0 && cleanText.trim().length > 0) {
    return `<p>${cleanText.trim()}</p>`;
  }
  
  return paragraphs.join('');
}

export async function POST(request) {
  try {
    const { content, contentType, action } = await request.json();
    
    // Handle description formatting
    if (action === 'format') {
      const formattedDescription = formatDescription(content);
      return NextResponse.json({
        success: true,
        formattedDescription
      });
    }
    
    const cleanContent = cleanHtmlContent(content);
    
    if (!cleanContent || cleanContent.length < 20) {
      return NextResponse.json({
        success: false,
        error: "Please add at least 20 characters of content first"
      });
    }
    
    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    // Generate all SEO content in one request
    const prompt = `You are an SEO expert for Hindi/Indian news content. Analyze the following article and generate SEO metadata.

Article: ${cleanContent.substring(0, 2000)}

Generate a JSON response with these exact fields (no extra text, no markdown):

{
  "metatitle": "50-60 character SEO title in Hindi",
  "metadesc": "150-160 character SEO description in Hindi",
  "metakeywords": "8-10 comma-separated keywords in Hindi",
  "tags": "5-6 comma-separated lowercase tags in Hindi (no spaces, use hyphens if needed)"
}

Important Rules:
- metatitle: 50-60 chars exactly, must be in Hindi, include main keyword, make it clickable
- metadesc: 150-160 chars exactly, must be in Hindi, include call-to-action like "जानिए पूरी खबर"
- metakeywords: Exactly 8-10 Hindi keywords separated by commas, no spaces after commas
- tags: Exactly 5-6 lowercase Hindi tags separated by commas, use hyphens for multi-word tags (e.g., "खान-सर", "पटना-न्यूज़")

Example for a news about Khan Sir:
{
  "metatitle": "खान सर केस: फायरिंग से कोर्ट तक का पूरा सच",
  "metadesc": "पटना के कदमकुआं में खान सर के कोचिंग संस्थान के बाहर फायरिंग मामले की पूरी कहानी। जानिए क्या है पूरा मामला।",
  "metakeywords": "खान सर, पटना फायरिंग, खान सर केस, बिहार न्यूज, कोचिंग संस्थान, कानूनी खबर, अदालत, सुरक्षा गार्ड",
  "tags": "खान-सर, पटना-फायरिंग, बिहार-न्यूज़, कोचिंग-संस्थान, कानूनी-मामला"
}

Return ONLY valid JSON, no markdown, no extra text.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let responseText = response.text();
    
    // Clean the response (remove markdown if present)
    responseText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    
    // Parse JSON
    let parsed;
    try {
      parsed = JSON.parse(responseText);
    } catch {
      // Fallback parsing with regex
      const titleMatch = responseText.match(/"metatitle"\s*:\s*"([^"]+)"/);
      const descMatch = responseText.match(/"metadesc"\s*:\s*"([^"]+)"/);
      const keywordsMatch = responseText.match(/"metakeywords"\s*:\s*"([^"]+)"/);
      const tagsMatch = responseText.match(/"tags"\s*:\s*"([^"]+)"/);
      
      parsed = {
        metatitle: titleMatch ? titleMatch[1] : cleanContent.substring(0, 55),
        metadesc: descMatch ? descMatch[1] : cleanContent.substring(0, 155),
        metakeywords: keywordsMatch ? keywordsMatch[1] : "न्यूज़, ताजा खबर, अपडेट, ट्रेंडिंग, वायरल, ब्रेकिंग, हेडलाइंस",
        tags: tagsMatch ? tagsMatch[1] : "न्यूज़, ट्रेंडिंग, वायरल, अपडेट"
      };
    }
    
    // Ensure tags are properly formatted
    let tags = parsed.tags || "";
    // Clean up tags - remove spaces after commas
    tags = tags.replace(/,\s+/g, ',');
    // Ensure tags are lowercase
    tags = tags.toLowerCase();
    
    return NextResponse.json({
      success: true,
      metatitle: parsed.metatitle?.substring(0, 60) || cleanContent.substring(0, 55),
      metadesc: parsed.metadesc?.substring(0, 160) || cleanContent.substring(0, 155),
      metakeywords: parsed.metakeywords || "न्यूज़, ताजा खबर, अपडेट, ट्रेंडिंग, वायरल, ब्रेकिंग, हेडलाइंस",
      tags: tags || "न्यूज़, ट्रेंडिंग, वायरल, अपडेट"
    });
    
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({
      success: false,
      error: error.message
    });
  }
}