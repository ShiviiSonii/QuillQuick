import { NextResponse } from "next/server";

export async function POST(_, { params }) {
  try {
    const { bookName } = await params;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Give only the genre name of the book ${bookName}. If the genre is unknown, respond exactly with "No Genre Available" and nothing else.`,
                },
              ],
            },
          ],
        }),
      }
    );
    const result = await response.json();
    return NextResponse.json(result.candidates[0].content.parts[0].text);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Something went wrong!" },
      { status: 500 }
    );
  }
}
