'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { playlist } from '@/lib/playlistData';
import Link from 'next/link';
import LyricsGame from '@/components/LyricsGame';

export default function SongPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  // Handle invalid or missing ID
  useEffect(() => {
    if (!id || isNaN(Number(id))) {
      router.replace('/404');
    }
  }, [id, router]);

  const song = playlist.find((s) => s.id === Number(id));

  // Handle song not found
  useEffect(() => {
    if (id && !song) {
      router.replace('/404');
    }
  }, [id, song, router]);

  if (!song) {
    return null; // Will be redirected by useEffect
  }

  return (
    <div className="min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <header className="mb-10">
        <Link href="/" className="text-blue-500 hover:underline">
          &larr; Back to Playlist
        </Link>
        <h1 className="text-4xl font-bold mt-4">{song.title}</h1>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {/* YouTube Video */}
          <iframe
            width="560"
            height="315"
            src={`https://www.youtube.com/embed/${song.youtubeId}`}
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
              {song.lyrics || "Lyrics not available."}
            </div>
          </details>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Memorization Game: Fill in the Blanks</h2>
          {song.lyrics ? (
            <LyricsGame lyrics={song.lyrics} />
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