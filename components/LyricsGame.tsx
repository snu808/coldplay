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
                .map((part, partIndex) => {
                  const isWord = !/^[\s.,!?;:"()]+$/.test(part) && part.length > 0;
                  let isBlank = false;
                  const key = `${lineIndex}-${partIndex}`;

                  if (isWord) {
                    wordCounter++;
                    if (wordCounter % BLANK_FREQUENCY === 0 && !isExcluded(part)) {
                      isBlank = true;
                      currentBlanks.push({ key: key, correctAnswer: part });
                    }
                  }
                  return { partIndex, text: part, isWord, isBlank, key };
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
    <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded">
      {processedLyrics.map(({ lineIndex, words }) => (
        <div key={lineIndex} className="mb-2 leading-relaxed">
          {words.map(({ partIndex, text, isWord, isBlank, key }) => {
            if (isBlank) {
              const result = results[key];
              let borderColor = 'border-gray-400';
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
                  className={`inline-block w-24 px-1 py-0.5 mx-1 border-2 ${borderColor} rounded bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 align-baseline`}
                  disabled={showResults && result === true} // Disable correct answers after check
                />
              );
            } else if (isWord) {
              return <span key={key}>{text}</span>;
            } else {
              return <span key={key}>{text}</span>; // Render whitespace/punctuation
            }
          })}
        </div>
      ))}
      <div className="mt-6 text-center">
        <button
          onClick={checkAnswers}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
          disabled={showResults} // Disable after checking until changes are made
        >
          Check Answers
        </button>
      </div>
    </div>
  );
} 