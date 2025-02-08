"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [title, setTitle] = useState("");
  const [wordLen, setWordLen] = useState("short");
  const [summaryType, setSummaryType] = useState("concept");

  const [summary, setSummary] = useState(null);

  const handleSummary = async () => {
    if (!title.trim()) {
      alert("Please enter a book name.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/summarize/${title}/${wordLen}/${summaryType}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title, wordLen, summaryType }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch summary");
      }

      const data = await response.json();
      setSummary(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSuggestion = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/suggest");

      if (!response.ok) {
        throw new Error("Failed to suggest book name");
      }

      const data = await response.json();
      setTitle(data.title);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <input
        type="text"
        value={title}
        placeholder="Enter the book name"
        onChange={(e) => setTitle(e.target.value)}
      />
      <select onChange={(e) => setWordLen(e.target.value)} value={wordLen}>
        <option value="short">Short</option>
        <option value="medium">Medium</option>
        <option value="long">Long</option>
      </select>
      <select
        onChange={(e) => setSummaryType(e.target.value)}
        value={summaryType}
      >
        <option value="purpose">Purpose</option>
        <option value="concept">Concept</option>
        <option value="plot">Plot</option>
      </select>
      <button onClick={handleSummary}>Get Summary</button>
      <button onClick={handleSuggestion}>Suggest bookname</button>
      {summary && <p>{summary}</p>}
    </>
  );
}
