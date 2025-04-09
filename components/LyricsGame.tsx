'use client';

import React, { useState, useMemo } from 'react';

interface LyricsGameProps {
  lyrics: string;
}

interface BlankInfo {
  key: string;
  correctAnswer: string;
}

const BLANK_FREQUENCY = 5; // Every 5th word will be blank

function isExcluded(word: string): boolean {
  const excludedWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
  return excludedWords.includes(word.toLowerCase());
}

export default function LyricsGame({ lyrics }: LyricsGameProps) {
  const [userInputs, setUserInputs] = useState<{ [key: string]: string }>({});
  const [results, setResults] = useState<{ [key: string]: boolean | null }>({});

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
    return { processedLyrics: lyricData, blanks: currentBlanks };
  }, [lyrics]);

  const handleInputChange = (key: string, value: string) => {
    setUserInputs(prev => ({ ...prev, [key]: value }));
  };

  const checkAnswer = (key: string, value: string) => {
    const blank = blanks.find(b => b.key === key);
    if (!blank) return;

    const isCorrect = value.toLowerCase() === blank.correctAnswer.toLowerCase();
    setResults(prev => ({ ...prev, [key]: isCorrect }));
    
    if (!isCorrect) {
      // Auto-correct the wrong answer
      setUserInputs(prev => ({ ...prev, [key]: blank.correctAnswer }));
    }
  };

  return (
    <div className="p-4 bg-gray-900/40 backdrop-blur-sm rounded whitespace-pre-line opacity-90 shadow-lg">
      {processedLyrics.map(({ lineIndex, words }) => (
        <div key={lineIndex} className="mb-2">
          {words.map(({ text, isWord, isBlank, key }) => {
            if (!isWord) {
              return <span key={key}>{text}</span>;
            }
            if (!isBlank) {
              return <span key={key}>{text}</span>;
            }
            return (
              <input
                key={key}
                type="text"
                value={userInputs[key] || ''}
                onChange={(e) => handleInputChange(key, e.target.value)}
                onBlur={(e) => checkAnswer(key, e.target.value)}
                className={`mx-1 px-1 py-0.5 rounded min-w-[50px] text-center ${
                  results[key] === true
                    ? 'bg-green-500/20 border-green-500'
                    : results[key] === false
                    ? 'bg-red-500/20 border-red-500'
                    : 'bg-gray-700/50 border-gray-600'
                } border`}
                style={{ width: `${Math.max(50, (userInputs[key]?.length || 0) * 8)}px` }}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
} 