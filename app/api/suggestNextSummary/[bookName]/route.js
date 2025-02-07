import { NextResponse } from "next/server";

export async function POST(_, { params }) {
  try {
    const { bookName } = params;

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
                  text: `Suggest only one book name in which story is similar to this book: ${bookName}`,
                },
              ],
            },
          ],
        }),
      }
    );
    // console.log(response);
    const result = await response.json();
    NextResponse.json(result);
  } catch (error) {
    console.error("Error:", error);
    NextResponse.json({ error: "Something went wrong!" }, { status: 500 });
  }
}
