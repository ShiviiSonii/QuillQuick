import { NextResponse } from "next/server";

const books = [
  { title: "The Silent Echo" },
  { title: "Beyond the Horizon" },
  { title: "Echoes of Eternity" },
  { title: "Whispers in the Dark" },
  { title: "The Lost Manuscript" },
  { title: "Parallel Lives" },
  { title: "The Last Alchemist" },
  { title: "Beneath the Ice" },
  { title: "Shadows of the Forgotten" },
  { title: "Neon Nights" },
];

export function GET() {
  try {
    const book = books[Math.floor(Math.random() * books.length)];
    return NextResponse.json(book);
  } catch (error) {
    console.error("Error while suggesting bookname:", error);
    return NextResponse.json(
      { error: "Something went wrong!" },
      { status: 500 }
    );
  }
}
