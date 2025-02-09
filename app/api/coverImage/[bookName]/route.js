import { NextResponse } from "next/server";

export async function GET(_, { params }) {
  const { bookName } = await params;

  if (!bookName) {
    return NextResponse.json(
      { error: "No book name provided" },
      { status: 400 }
    );
  }

  try {
    const openLibraryUrl = `https://openlibrary.org/search.json?title=${bookName}`;
    const response = await fetch(openLibraryUrl);
    const data = await response.json();

    const bookCoverImage =
      data.docs && data.docs[0].cover_i
        ? `https://covers.openlibrary.org/b/id/${data.docs[0].cover_i}-L.jpg`
        : "";

    return NextResponse.json({ coverImage: bookCoverImage });
  } catch (error) {
    console.error("Error fetching book cover:", error);
    return NextResponse.json(
      { error: "Error fetching cover image" },
      { status: 500 }
    );
  }
}
