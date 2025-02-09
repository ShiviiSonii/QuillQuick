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
                  text: `Give any one quote from this book: ${bookName}.If no quote is available, respond exactly with "No Quote Available" and nothing else.`,
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
