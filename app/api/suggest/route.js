import { NextResponse } from "next/server";

const books = [
  { title: "The Alchemist" },
  { title: "To Kill a Mockingbird" },
  { title: "1984" },
  { title: "Pride and Prejudice" },
  { title: "The Great Gatsby" },
  { title: "Moby-Dick" },
  { title: "War and Peace" },
  { title: "The Catcher in the Rye" },
  { title: "Brave New World" },
  { title: "Crime and Punishment" },
  { title: "The Lord of the Rings" },
  { title: "Harry Potter and the Sorcerer’s Stone" },
  { title: "The Hobbit" },
  { title: "Fahrenheit 451" },
  { title: "The Diary of a Young Girl" },
  { title: "The Book Thief" },
  { title: "Wuthering Heights" },
  { title: "Jane Eyre" },
  { title: "The Picture of Dorian Gray" },
  { title: "Dracula" },
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
