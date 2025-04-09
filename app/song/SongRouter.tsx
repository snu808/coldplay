'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Song } from '@/lib/playlistData';
import Link from 'next/link';
import LyricsGame from '@/components/LyricsGame';

interface SongRouterProps {
  songs: Song[];
}

export default function SongRouter({ songs }: SongRouterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentSong, setCurrentSong] = useState<Song | null>(null);

  useEffect(() => {
    const id = searchParams.get('id');
    if (!id || isNaN(Number(id))) {
      router.replace('/404');
      return;
    }

    const song = songs.find((s) => s.id === Number(id));
    if (!song) {
      router.replace('/404');
      return;
    }

    setCurrentSong(song);
  }, [searchParams, songs, router]);

  if (!currentSong) {
    return null; // Will be redirected by useEffect
  }

  return (
    <div className="min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <header className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <Link href="/" className="text-blue-500 hover:underline">
            &larr; Back to Playlist
          </Link>
          <div className="flex gap-4">
            {currentSong.id > 1 && (
              <Link href={`/song?id=${currentSong.id - 1}`} className="text-blue-500 hover:underline">
                &larr; Previous
              </Link>
            )}
            {currentSong.id < songs.length && (
              <Link href={`/song?id=${currentSong.id + 1}`} className="text-blue-500 hover:underline">
                Next &rarr;
              </Link>
            )}
          </div>
        </div>
        <h1 className="text-4xl font-bold mt-4 mb-8">{currentSong.title}</h1>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {/* YouTube Video */}
          <iframe
            width="560"
            height="315"
            src={`https://www.youtube.com/embed/${currentSong.youtubeId}`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </header>

      <main>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">Full Lyrics</h2>
          <details className="p-4 bg-gray-900/40 backdrop-blur-sm rounded whitespace-pre-line opacity-90 shadow-lg">
            <summary className="cursor-pointer font-medium text-teal-300 hover:text-teal-200">Show/Hide Full Lyrics</summary>
            <div className="mt-3 text-gray-200">
              {currentSong.lyrics || "Lyrics not available."}
            </div>
          </details>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Memorization Game: Fill in the Blanks</h2>
          {currentSong.lyrics ? (
            <LyricsGame lyrics={currentSong.lyrics} />
          ) : (
            <div className="p-4 border border-dashed border-gray-400 rounded min-h-[200px] flex items-center justify-center text-gray-500">
              Lyrics needed to start the game.
            </div>
          )}
        </section>
      </main>
    </div>
  );
} 