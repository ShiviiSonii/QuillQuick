"use client";
import { useState } from "react";
import { motion } from "framer-motion";

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
        <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 p-6 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-full max-w-lg border border-gray-800 bg-gray-900 shadow-2xl rounded-xl p-6">
              <h2 className="text-center text-gray-100 text-2xl font-semibold mb-4">
                AI-Powered Book Summary
              </h2>
              <div className="space-y-6">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={title}
                    placeholder="Enter book title"
                    onChange={(e) => setTitle(e.target.value)}
                    className="flex-1 bg-gray-800 border border-gray-700 text-gray-100 
                  placeholder-gray-400 focus:ring-gray-700 rounded-lg p-3 outline-none"
                  />
                  <button
                    onClick={handleSuggestion}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white
                  hover:from-purple-700 hover:to-indigo-700 shadow-lg border-0 px-6 
                  transition-transform transform hover:scale-110 rounded-lg p-3"
                  >
                    ✨ Suggest
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-200">
                    Summary Type
                  </label>
                  <select
                    onChange={(e) => setSummaryType(e.target.value)}
                    value={summaryType}
                    className="w-full bg-gray-800 border border-gray-700 text-gray-100 focus:ring-gray-700 rounded-lg p-3"
                  >
                    <option value="" disabled selected>
                      Choose summary type
                    </option>
                    <option value="purpose">Purpose</option>
                    <option value="concept">Concept</option>
                    <option value="plot">Plot</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-200">
                    Word Length
                  </label>
                  <select
                    onChange={(e) => setWordLen(e.target.value)}
                    value={wordLen}
                    className="w-full bg-gray-800 border border-gray-700 text-gray-100 focus:ring-gray-700 rounded-lg p-3"
                  >
                    <option value="" disabled selected>
                      Select word length
                    </option>
                    <option value="short">Short (50-100 words)</option>
                    <option value="medium">Medium (200-300 words)</option>
                    <option value="long">Long (500+ words)</option>
                  </select>
                </div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <button
                    onClick={handleSummary}
                    className="w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white
                  hover:from-rose-600 hover:to-pink-600 shadow-lg border-0 py-4 text-lg font-medium 
                  transition-all duration-300 rounded-lg"
                  >
                    ✨ Generate Summary
                  </button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
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
