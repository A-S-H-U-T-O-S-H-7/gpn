import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const genAI = new GoogleGenerativeAI(
      process.env.GEMINI_API_KEY
    );

    const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

    const result = await model.generateContent("Hello");

    return NextResponse.json({
      success: true,
      text: result.response.text(),
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error.message,
      status: error.status,
      stack: String(error),
    });
  }
}