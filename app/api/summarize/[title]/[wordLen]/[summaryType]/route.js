import { NextResponse } from "next/server";

export async function POST(_, { params }) {
  const { title, wordLen, summaryType } = await params;
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Give the summary of the book ${title} in ${wordLen} words based on ${summaryType}. Do not add any newline characters (\n) or use highlighted text. Write the entire summary as a single paragraph.`,
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
    console.log("Error while summarizing the book:", error);
    return NextResponse.json(
      { error: "Something went wrong!" },
      { status: 500 }
    );
  }
}
