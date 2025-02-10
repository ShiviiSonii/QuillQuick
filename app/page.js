"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import placeholderImg from "@/public/placeholder.jpg";
import {
  BsCopy,
  BsFillPlayFill,
  BsFillSearchHeartFill,
  BsFillStopFill,
} from "react-icons/bs";
import Image from "next/image";

export default function Home() {
  const [title, setTitle] = useState("");
  const [wordLen, setWordLen] = useState("short");
  const [summaryType, setSummaryType] = useState("concept");
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [highlightedWordIndex, setHighlightedWordIndex] = useState(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [allQuestionsAndAnswers, setAllQuestionsAndAnswers] = useState([]);
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [genreName, setGenreName] = useState("");
  const [publicationYear, setPublicationYear] = useState("");
  const [quote, setQuote] = useState("");

  const words = summary ? summary.split(" ") : [];

  const handleSummary = async () => {
    if (!title.trim()) {
      alert("Please enter a book name.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `/api/summarize/${title}/${wordLen}/${summaryType}`,
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
      handleCoverImageUrl();
      handleAuthorName();
      handleGenreName();
      handlePublicationYear();
      handleQuote();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestion = async () => {
    try {
      const response = await fetch("/api/suggest");

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
      const response = await fetch(`/api/suggestNextSummary/${title}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      });

      if (!response.ok) {
        throw new Error("Failed to find similar book name");
      }

      const data = await response.json();
      setTitle(data);
      setSummary("");
      setAllQuestionsAndAnswers([]);
      setCoverImageUrl("");
      setAuthorName("");
      setGenreName("");
      setPublicationYear("");
      setQuote("");
    } catch (error) {
      console.error(error);
    }
    handleStopSpeech();
  };

  const handleAuthorName = async () => {
    try {
      const response = await fetch(`/api/bookDetails/authorName/${title}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      });

      if (!response.ok) {
        throw new Error("Failed to find author name");
      }

      const data = await response.json();
      setAuthorName(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleGenreName = async () => {
    try {
      const response = await fetch(`/api/bookDetails/genreName/${title}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      });

      if (!response.ok) {
        throw new Error("Failed to find genre name");
      }

      const data = await response.json();
      setGenreName(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handlePublicationYear = async () => {
    try {
      const response = await fetch(
        `/api/bookDetails/publicationYear/${title}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to find publication year");
      }

      const data = await response.json();
      setPublicationYear(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleQuote = async () => {
    try {
      const response = await fetch(`/api/bookDetails/quote/${title}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      });

      if (!response.ok) {
        throw new Error("Failed to find famous quote");
      }

      const data = await response.json();
      setQuote(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearchAgain = () => {
    handleStopSpeech();
    setSummary("");
    setTitle("");
    setAllQuestionsAndAnswers([]);
    setCoverImageUrl("");
    setAuthorName("");
    setGenreName("");
    setPublicationYear("");
    setQuote("");
  };

  const handleStartSpeech = () => {
    if (!summary) return;

    const utterance = new SpeechSynthesisUtterance(summary);

    utterance.onboundary = (event) => {
      // Event triggered when speech synthesis reaches a word boundary
      const wordIndex = getWordIndexFromCharIndex(event.charIndex);
      setHighlightedWordIndex(wordIndex); // Update the highlighted word index
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setHighlightedWordIndex(null); // Reset highlight when speech ends
    };

    speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const handleStopSpeech = () => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
    setHighlightedWordIndex(null); // Reset highlight if speech is stopped
  };

  // Utility function to map character index to word index
  const getWordIndexFromCharIndex = (charIndex) => {
    let currentCharCount = 0;
    for (let i = 0; i < words.length; i++) {
      currentCharCount += words[i].length + 1; // +1 for the space
      if (charIndex < currentCharCount) {
        return i;
      }
    }
    return words.length - 1; // Default to last word if no match found
  };

  const handleFindAnswer = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/findAnswer/${title}/${summary}/${question}`
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleCoverImageUrl = async () => {
    try {
      const response = await fetch(`/api/coverImage/${title}`);

      if (!response.ok) {
        throw new Error("Failed to find cover image");
      }

      const data = await response.json();
      setCoverImageUrl(data.coverImage);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 p-1  md:p-6 lg:p-6 flex items-center justify-center">
      {!summary && (
        <div className="">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-auto lg:w-full max-w-lg border border-gray-800 bg-gray-900 shadow-2xl rounded-xl p-2 py-4 md:p-6 lg:p-6">
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
                  transition-transform transform hover:scale-110 rounded-lg p-3 "
                  >
                    Suggest✨
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
                    <option value="disabled" disabled selected>
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
                    <option value="disabled" disabled selected>
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
                    {isLoading ? "Loading..." : "✨ Generate Summary"}
                  </button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {summary && (
        <>
          <div className="bg-gray-900 text-white p-4 md:p-8 lg:p-8 rounded-lg shadow-lg lg:max-w-5xl mx-auto flex flex-col gap-8 overflow-hidden">
            {/* Left Side: Summary and Buttons */}
            <div className="flex flex-col space-y-6">
              <h2 className="text-3xl font-semibold text-gray-300">Summary</h2>{" "}
              {/* Heading for Summary */}
              {/* Summary and Book Image */}
              <div className="flex gap-6 flex-col lg:flex-row md:flex-col flex-wrap">
                <div className="flex-shrink-0 w-full sm:w-[350px] md:w-[400px] lg:w-[400px] h-auto sm:h-[500px] md:h-[550px] lg:h-[550px] max-w-full">
                  <Image
                    src={coverImageUrl || placeholderImg}
                    height={550}
                    width={400}
                    alt="Book"
                    className="object-cover rounded-lg shadow-md w-full h-full"
                  />
                </div>

                <div className="flex-1">
                  <h3 className="text-4xl font-extrabold text-start mb-4 text-gray-900 dark:text-white">
                    {title}
                  </h3>
                  <p className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    {/* Highlight words based on the index */}
                    {words.map((word, index) => (
                      <span
                        key={index}
                        className={`${
                          index === highlightedWordIndex
                            ? "bg-yellow-300 text-[#1a1a1a]" // Highlight current word
                            : ""
                        }`}
                      >
                        {word}{" "}
                      </span>
                    ))}
                  </p>
                  <p className="text-md font-medium text-gray-600 dark:text-gray-400 italic">
                    By {authorName}
                  </p>
                  <p className="text-md font-medium text-blue-600 dark:text-blue-400">
                    Genre: {genreName}
                  </p>
                  <p className="text-md font-medium text-green-600 dark:text-green-400">
                    Published: {publicationYear}
                  </p>
                  <p className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-4 border-l-4 border-blue-500 pl-3">
                    {quote}
                  </p>

                  <div className="flex gap-4 justify-start mt-5 flex-col md:flex-row lg:flex-row">
                    <button
                      onClick={handleSimilar}
                      className="bg-gradient-to-r from-indigo-600 to-indigo-500 text-white px-6 py-3 rounded-lg shadow-md transform transition-all duration-300 hover:scale-105 hover:from-indigo-700 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <div className="flex items-center justify-center gap-1">
                        <span>Find Similar</span>
                        <BsCopy className="text-xl" />
                      </div>
                    </button>
                    <button
                      onClick={handleSearchAgain}
                      className="bg-gradient-to-r from-teal-600 to-teal-500 text-white px-6 py-3 rounded-lg shadow-md transform transition-all duration-300 hover:scale-105 hover:from-teal-700 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <div className="flex items-center justify-center gap-1">
                        <span>Search Again</span>
                        <BsFillSearchHeartFill className="text-xl" />
                      </div>
                    </button>
                    {isSpeaking ? (
                      <button
                        onClick={handleStopSpeech}
                        className="bg-gradient-to-r from-red-600 to-red-500 text-white px-6 py-3 rounded-lg shadow-md transform transition-all duration-300 hover:scale-105 hover:from-red-700 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        <div className="flex items-center justify-center gap-1">
                          <span>Stop Listening </span>
                          <BsFillStopFill className="text-xl" />
                        </div>
                      </button>
                    ) : (
                      <button
                        onClick={handleStartSpeech}
                        className="bg-gradient-to-r from-orange-600 to-orange-500 text-white px-6 py-3 rounded-lg shadow-md transform transition-all duration-300 hover:scale-105 hover:from-orange-700 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <div className="flex items-center justify-center gap-1">
                          <span>Start Listening </span>
                          <BsFillPlayFill className="text-xl" />
                        </div>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-6 overflow-y-auto max-h-[60vh] scrollbar-custom">
              {allQuestionsAndAnswers.length > 0 ? (
                allQuestionsAndAnswers.map((ans, index) => (
                  <div key={index} className="flex flex-col gap-4">
                    <div className="self-end bg-indigo-600 text-white p-4 rounded-lg shadow-lg max-w-xs">
                      <h3 className="font-semibold text-md">{ans.question}</h3>
                    </div>
                    <div className="self-start bg-gray-700 text-white p-4 rounded-lg shadow-lg max-w-xs">
                      <p className="text-md">{ans.answer}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-full space-y-4 py-20">
                  <h3 className="text-3xl font-semibold text-gray-400">
                    No Questions Yet
                  </h3>
                  <p className="text-lg text-gray-500 text-center">
                    Ask a question, and the answer will appear here!
                  </p>
                </div>
              )}
            </div>
            <div className="flex flex-col md:flex-row justify-between gap-4 mt-6 items-center w-full">
              <input
                type="text"
                value={question}
                placeholder="Do you have any question?"
                onChange={(e) => setQuestion(e.target.value)}
                className="w-full md:w-4/5 p-3 bg-gray-800 text-white border border-gray-500 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-0"
              />
              <button
                onClick={handleFindAnswer}
                className="w-full md:w-1/5 h-[48px] bg-gradient-to-r from-yellow-500 to-yellow-400 text-white p-3 rounded-lg shadow-md transform transition-all duration-300 hover:scale-105 hover:from-yellow-600 hover:to-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                {!isLoading ? (
                  <div className="flex items-center justify-center gap-1">
                    <span>Find Answer</span>
                    <BsFillSearchHeartFill className="text-xl" />
                  </div>
                ) : (
                  "Finding.."
                )}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
