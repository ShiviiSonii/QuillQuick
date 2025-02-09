import { NextResponse } from "next/server";

export async function GET(_, { params }) {
  try {
    const { bookName, summary, question } = await params;

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
                  text: `Tell me the answer of this question: ${question} which was taken from the summary: ${summary} of the ${bookName}.Do not add any newline characters (\n) or use highlighted text. Write the entire summary as a single paragraph.`,
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
