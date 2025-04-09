/** @jsxImportSource react */
'use client';

import * as React from 'react';
import { useState, useMemo, useRef, useEffect } from 'react';

interface LyricsGameProps {
  lyrics: string;
}

interface BlankInfo {
  index: number;
  word: string;
}

interface WordInfo {
  text: string;
  isBlank: boolean;
  blankIndex?: number;
}

interface LineInfo {
  words: WordInfo[];
}

const BLANK_FREQUENCY = 5; // Every 5th word will be blank

function isExcluded(word: string): boolean {
  return word.length <= 3 || 
         word.includes("'") || 
         word.includes('"') || 
         word.includes('(') || 
         word.includes(')') ||
         word.includes('[') ||
         word.includes(']') ||
         word.includes('{') ||
         word.includes('}') ||
         word.includes('<') ||
         word.includes('>') ||
         word.includes('&') ||
         word.includes('*') ||
         word.includes('+') ||
         word.includes('=') ||
         word.includes('@') ||
         word.includes('#') ||
         word.includes('$') ||
         word.includes('%') ||
         word.includes('^') ||
         word.includes('\\') ||
         word.includes('|') ||
         word.includes('~') ||
         word.includes('`') ||
         word.includes('!') ||
         word.includes('?') ||
         word.includes('.') ||
         word.includes(',') ||
         word.includes(';') ||
         word.includes(':') ||
         word.includes('/') ||
         word.includes('-') ||
         word.includes('_') ||
         word.includes(' ') ||
         word.includes('\t') ||
         word.includes('\n') ||
         word.includes('\r');
}

const LyricsGame: React.FC<LyricsGameProps> = ({ lyrics }: LyricsGameProps) => {
  const [userInputs, setUserInputs] = useState<Record<number, string>>({});
  const [results, setResults] = useState<Record<number, boolean>>({});
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // Process lyrics and create blanks
  const { processedLyrics, blanks } = useMemo(() => {
    const lines = lyrics.split('\n');
    const lyricData: LineInfo[] = [];
    const blanksArray: BlankInfo[] = [];
    let blankIndex = 0;

    lines.forEach((line: string) => {
      const words = line.split(' ');
      const processedWords: WordInfo[] = [];

      words.forEach((word: string, index: number) => {
        if (!isExcluded(word) && index % BLANK_FREQUENCY === 0) {
          processedWords.push({
            text: word,
            isBlank: true,
            blankIndex: blankIndex
          });
          blanksArray.push({
            index: blankIndex,
            word: word
          });
          blankIndex++;
        } else {
          processedWords.push({
            text: word,
            isBlank: false
          });
        }
      });

      lyricData.push({
        words: processedWords
      });
    });

    return {
      processedLyrics: lyricData,
      blanks: blanksArray
    };
  }, [lyrics]);

  // Initialize state when blanks change
  useEffect(() => {
    const initialInputs: Record<number, string> = {};
    const initialResults: Record<number, boolean> = {};
    blanks.forEach((blank: BlankInfo) => {
      initialInputs[blank.index] = '';
      initialResults[blank.index] = false;
    });
    setUserInputs(initialInputs);
    setResults(initialResults);
  }, [blanks]);

  const handleInputChange = (index: number, value: string): void => {
    setUserInputs((prev: Record<number, string>) => ({
      ...prev,
      [index]: value
    }));
  };

  const checkAnswer = (index: number, value: string): void => {
    const correctAnswer = blanks.find((b: BlankInfo) => b.index === index)?.word.toLowerCase() || '';
    const isCorrect = value.toLowerCase() === correctAnswer;
    setResults((prev: Record<number, boolean>) => ({
      ...prev,
      [index]: isCorrect
    }));
    if (!isCorrect) {
      const correctAnswer = blanks.find((b: BlankInfo) => b.index === index)?.word || '';
      setUserInputs((prev: Record<number, string>) => ({
        ...prev,
        [index]: correctAnswer
      }));
    }
  };

  // Calculate and set input widths based on actual answer text
  useEffect(() => {
    if (typeof window !== 'undefined') { // Ensure code runs only on the client
      blanks.forEach((blank) => {
        const inputElement = inputRefs.current[blank.index.toString()];
        if (inputElement) {
          // Create a hidden span to measure text width
          const tempSpan = document.createElement('span');
          tempSpan.style.visibility = 'hidden';
          tempSpan.style.position = 'absolute';
          tempSpan.style.whiteSpace = 'pre'; // Preserve spaces for accurate measurement
          
          // Apply the same font styles as the input
          const inputStyle = window.getComputedStyle(inputElement);
          tempSpan.style.fontFamily = inputStyle.fontFamily;
          tempSpan.style.fontSize = inputStyle.fontSize;
          tempSpan.style.fontWeight = inputStyle.fontWeight;
          tempSpan.style.letterSpacing = inputStyle.letterSpacing;
          tempSpan.style.paddingLeft = inputStyle.paddingLeft; // Include padding in calculation
          tempSpan.style.paddingRight = inputStyle.paddingRight;

          tempSpan.textContent = blank.word; // Set text to the actual answer
          
          document.body.appendChild(tempSpan);
          const textWidth = tempSpan.offsetWidth; // Measure the width
          document.body.removeChild(tempSpan);

          // Set input width = measured text width + buffer (e.g., 10px)
          // Ensure a minimum width (e.g., 40px)
          inputElement.style.width = `${Math.max(40, textWidth + 10)}px`;
        }
      });
    }
  }, [blanks, inputRefs]); // Rerun when blanks change

  return (
    <div className="p-4 bg-gray-900/40 backdrop-blur-sm rounded whitespace-pre-line opacity-90 shadow-lg">
      {processedLyrics.map((line: LineInfo, lineIndex: number) => (
        <div key={lineIndex} className="lyric-line my-2">
          {line.words.map((word: WordInfo, wordIndex: number) => {
            if (word.isBlank && word.blankIndex !== undefined) {
              const correctAnswerLength = blanks.find((b: BlankInfo) => b.index === word.blankIndex)?.word.length || 1;
              return (
                <input
                  key={`${lineIndex}-${wordIndex}`}
                  ref={(el: HTMLInputElement | null) => { 
                    if (el && word.blankIndex !== undefined) {
                      inputRefs.current[word.blankIndex.toString()] = el; 
                    }
                  }}
                  type="text"
                  value={userInputs[word.blankIndex] || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                    handleInputChange(word.blankIndex!, e.target.value)
                  }
                  onBlur={(e: React.FocusEvent<HTMLInputElement>) => 
                    checkAnswer(word.blankIndex!, e.target.value)
                  }
                  className={`mx-1 px-1 border border-gray-500 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center ${
                    results[word.blankIndex] === true ? 'border-green-500' : results[word.blankIndex] === false && userInputs[word.blankIndex] !== '' ? 'border-red-500' : 'border-gray-500'
                  }`}
                />
              );
            }
            return <span key={`${lineIndex}-${wordIndex}`}>{word.text} </span>;
          })}
        </div>
      ))}
    </div>
  );
};

export default LyricsGame; 