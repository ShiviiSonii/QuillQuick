"use client";
import { useState } from "react";

export default function Home() {
  const [title, setTitle] = useState("");
  const [wordLen, setWordLen] = useState("short");
  const [summaryType, setSummaryType] = useState("concept");
  const [summary, setSummary] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [allQuestionsAndAnswers, setAllQuestionsAndAnswers] = useState([]);

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

  const handleSimilar = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/suggestNextSummary/${title}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to find similar book name");
      }

      const data = await response.json();
      setTitle(data);
      setSummary("");
    } catch (error) {
      console.error(error);
    }
    stopSpeech();
  };

  const handleSearchAgain = () => {
    stopSpeech();
    setSummary("");
    setTitle("");
  };

  const handleStartSpeech = () => {
    if (!summary) return;

    const utterance = new SpeechSynthesisUtterance(summary);
    utterance.onend = () => setIsSpeaking(false);

    speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const handleStopSpeech = () => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const handleFindAnswer = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/findAnswer/${title}/${summary}/${question}`
      );

      if (!response.ok) {
        throw new Error("Failed to find answer of your question");
      }

      const data = await response.json();
      setAnswer(data);

      setAllQuestionsAndAnswers([
        ...allQuestionsAndAnswers,
        { question, answer: data },
      ]);
      setQuestion("");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {!summary && (
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
        </>
      )}

      {summary && (
        <>
          <p>{summary}</p>
          <button onClick={handleSimilar}>Find similar</button>
          <button onClick={handleSearchAgain}>Search Again</button>
          {isSpeaking ? (
            <button onClick={handleStopSpeech}>Stop Listening</button>
          ) : (
            <button onClick={handleStartSpeech}>Start Listening</button>
          )}
          <input
            type="text"
            value={question}
            placeholder="Do you have any question?"
            onChange={(e) => setQuestion(e.target.value)}
          />
          <button onClick={handleFindAnswer}>Find Answer Quickly</button>
          {allQuestionsAndAnswers.length > 0 &&
            allQuestionsAndAnswers.map((ans, index) => (
              <div key={index}>
                <h3>{ans.question}</h3>
                <p>{ans.answer}</p>
              </div>
            ))}
        </>
      )}
    </>
  );
}
