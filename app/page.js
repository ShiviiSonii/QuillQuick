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
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 p-6 flex items-center justify-center">
      {!summary && (
        <div className="">
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
        <div className="bg-gray-900 text-white p-8 rounded-lg shadow-lg max-w-3xl mx-auto space-y-6">
          <div className="mb-6">
            <p className="text-lg font-medium">{summary}</p>
          </div>
          <div className="flex gap-4 mb-6">
            <button
              onClick={handleSimilar}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
            >
              Find Similar
            </button>
            <button
              onClick={handleSearchAgain}
              className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-700 transition duration-300"
            >
              Search Again
            </button>
            {isSpeaking ? (
              <button
                onClick={handleStopSpeech}
                className="bg-red-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-red-700 transition duration-300"
              >
                Stop Listening
              </button>
            ) : (
              <button
                onClick={handleStartSpeech}
                className="bg-purple-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-purple-700 transition duration-300"
              >
                Start Listening
              </button>
            )}
          </div>

          <div className="flex flex-col gap-4 mb-6">
            <input
              type="text"
              value={question}
              placeholder="Do you have any question?"
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full p-4 bg-gray-800 text-white border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleFindAnswer}
              className="bg-yellow-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-yellow-600 transition duration-300"
            >
              Find Answer Quickly
            </button>
          </div>

          {/* Chat Box Section */}
          <div className="space-y-6">
            {allQuestionsAndAnswers.length > 0 &&
              allQuestionsAndAnswers.map((ans, index) => (
                <div key={index} className="flex flex-col gap-4">
                  {/* User's Question on Right */}
                  <div className="self-end bg-blue-600 text-white p-4 rounded-lg shadow-lg max-w-xs">
                    <h3 className="font-semibold text-md">{ans.question}</h3>
                  </div>
                  {/* Bot's Answer on Left */}
                  <div className="self-start bg-gray-700 text-white p-4 rounded-lg shadow-lg max-w-xs">
                    <p className="text-md">{ans.answer}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
