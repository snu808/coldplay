import { playlist } from '@/lib/playlistData';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import LyricsGame from '@/components/LyricsGame'; // Import the game component
import { Metadata } from "next";

// Required for static export with dynamic routes
export async function generateStaticParams(): Promise<{ id: string }[]> {
  return playlist.map((song) => ({
    id: song.id.toString(), // ID must be a string
  }));
}

// Instead of custom type, use next's functions without explicit typing
export default function SongPage({ params }: { params: { id: string } }) {
  // Parse the ID to a number
  const id = parseInt(params.id);
  const song = playlist.find((song) => song.id === id);

  // Handle case where song ID is invalid or not found
  if (isNaN(id) || !song) {
    notFound(); // Show a 404 page
  }

  return (
    <div className="min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <header className="mb-10">
        <Link href="/" className="text-blue-500 hover:underline">
          &larr; Back to Playlist
        </Link>
        <h1 className="text-4xl font-bold mt-4">{song.title}</h1>
        <a
          href={song.youtubeId ? `https://www.youtube.com/watch?v=${song.youtubeId}` : '#'}
          target="_blank"
          rel="noopener noreferrer"
          className={`text-lg ${song.youtubeId ? 'text-red-600 hover:underline' : 'text-gray-400'}`}
          aria-disabled={!song.youtubeId}
        >
          Watch on YouTube
        </a>
      </header>

      <main>
        {/* Keep the full lyrics display for reference if needed */}
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