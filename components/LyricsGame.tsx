'use client';

import React, { useState, useMemo, ChangeEvent } from 'react';

interface LyricsGameProps {
  lyrics: string;
}

const BLANK_FREQUENCY = 7; // Show a blank roughly every N words

// List of patterns/substrings to exclude from being turned into blanks
const EXCLUDED_PATTERNS = [
  "ooh-ooh-ooh",
  "oh-oh-oh",
  "la-la-la",
  "para-para-paradise", // Specific to Paradise, can be made more generic
];

interface BlankInfo {
  key: string;
  correctAnswer: string;
}

// Function to check if a word should be excluded
const isExcluded = (word: string): boolean => {
  const lowerWord = word.toLowerCase();
  return EXCLUDED_PATTERNS.some(pattern => lowerWord.includes(pattern));
};

export default function LyricsGame({ lyrics }: LyricsGameProps) {
  const [userInputs, setUserInputs] = useState<{ [key: string]: string }>({});
  const [results, setResults] = useState<{ [key: string]: boolean | null }>({});
  const [showResults, setShowResults] = useState(false);

  // Memoize the processed lyrics and the list of blanks
  const { processedLyrics, blanks } = useMemo(() => {
    const currentBlanks: BlankInfo[] = [];
    let wordCounter = 0;
    const lyricData = lyrics.split('\n').map((line, lineIndex) => ({
      lineIndex,
      words: line.split(/([\s.,!?;:"()]+)/)
                .filter(part => part)
                .map((part, index) => {
                  const isWord = !/^[\s.,!?;:"()]+$/.test(part) && part.length > 0;
                  let isBlank = false;
                  const key = `${lineIndex}-${index}`;

                  if (isWord) {
                    wordCounter++;
                    if (wordCounter % BLANK_FREQUENCY === 0 && !isExcluded(part)) {
                      isBlank = true;
                      currentBlanks.push({ key: key, correctAnswer: part });
                    }
                  }
                  return { text: part, isWord, isBlank, key };
                }),
    }));
    // Initialize state for inputs and results based on blanks
    const initialInputs = currentBlanks.reduce((acc, blank) => ({ ...acc, [blank.key]: '' }), {});
    const initialResults = currentBlanks.reduce((acc, blank) => ({ ...acc, [blank.key]: null }), {});
    setUserInputs(initialInputs);
    setResults(initialResults);
    setShowResults(false); // Reset results visibility on lyrics change
    return { processedLyrics: lyricData, blanks: currentBlanks };
  }, [lyrics]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>, key: string) => {
    setUserInputs(prev => ({ ...prev, [key]: event.target.value }));
    if (showResults) {
      // Clear results if user changes input after checking
      setResults(prev => ({ ...prev, [key]: null }));
      setShowResults(false);
    }
  };

  const checkAnswers = () => {
    const newResults: { [key: string]: boolean | null } = {};
    blanks.forEach(blank => {
      const userInput = userInputs[blank.key]?.trim() || '';
      // Case-insensitive comparison, ignoring simple punctuation if needed
      const isCorrect = userInput.toLowerCase() === blank.correctAnswer.toLowerCase();
      newResults[blank.key] = isCorrect;
    });
    setResults(newResults);
    setShowResults(true);
  };

  return (
    <div className="p-6 bg-gray-900/50 backdrop-blur-sm rounded shadow-lg text-gray-100">
      {processedLyrics.map(({ lineIndex, words }) => (
        <div key={lineIndex} className="mb-2 leading-relaxed">
          {words.map(({ text, isWord, isBlank, key }) => {
            if (isBlank) {
              const result = results[key];
              let borderColor = 'border-gray-500';
              if (showResults) {
                borderColor = result === true ? 'border-green-500' : 'border-red-500';
              }
              return (
                <input
                  key={key}
                  type="text"
                  aria-label={`Blank word input ${key}`}
                  placeholder="..."
                  value={userInputs[key] || ''}
                  onChange={(e) => handleInputChange(e, key)}
                  className={`inline-block w-24 px-1 py-0.5 mx-1 border-2 ${borderColor} rounded bg-gray-800/60 text-gray-100 focus:outline-none focus:ring-1 focus:ring-teal-400 align-baseline`}
                  disabled={showResults && result === true}
                />
              );
            } else if (isWord) {
              return <span key={key}>{text}</span>;
            } else {
              return <span key={key}>{text}</span>;
            }
          })}
        </div>
      ))}
      <div className="mt-6 text-center">
        <button
          onClick={checkAnswers}
          className="px-6 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-opacity-50 disabled:opacity-50 shadow-md"
          disabled={showResults}
        >
          Check Answers
        </button>
      </div>
    </div>
  );
} 