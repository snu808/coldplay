import { playlist } from '@/lib/playlistData';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import LyricsGame from '@/components/LyricsGame';

// Static page that handles routing internally
export default function SongPage({ searchParams }: { searchParams: { id?: string } }) {
  // Get ID from searchParams instead of dynamic route params
  const id = searchParams.id ? parseInt(searchParams.id) : null;
  
  if (!id || isNaN(id)) {
    notFound();
  }

  const song = playlist.find((s) => s.id === id);
  
  if (!song) {
    notFound();
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