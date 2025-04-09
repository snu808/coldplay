import { playlist } from "@/lib/playlistData"; // Import the data
import SongListItem from "@/components/SongListItem"; // Import the list item component
import SurpriseButton from "@/components/SurpriseButton"; // Import the button component

export default function Home() {
  // Extract song IDs for the button
  const songIds = playlist.map((song) => song.id);

  return (
    <div className="grid grid-rows-[auto_auto_1fr_auto] min-h-screen p-8 sm:p-12 font-[family-name:var(--font-geist-sans)]">
      {/* Header or Title Area */}
      <header className="text-center mb-6">
        <h1 className="text-4xl font-bold">Coldplay Concert Playlist</h1>
        {/* Link to the main YouTube playlist */}
        <a
          href="https://youtube.com/playlist?list=PLN2WLmlMdm2r9bK_8lDexWlVGRyDqMykT&si=PoO2kqW1y2b-YroE"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline mt-2 inline-block"
        >
          View Full Playlist on YouTube
        </a>
      </header>

      {/* Surprise Button Area */}
      <div className="text-center mb-8 row-start-2">
        <SurpriseButton songIds={songIds} />
      </div>

      {/* Main Playlist Area - Adjust row-start */}
      <main className="row-start-3 w-full">
        {/* Apply responsive grid layout using auto-fit and minmax */}
        {/* Each item tries to be 250px wide, columns auto-fit */}
        <ul className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4">
          {playlist.map((song) => (
            // Use the SongListItem component, passing the song data
            <SongListItem key={song.id} song={song} />
          ))}
        </ul>
      </main>

      {/* Footer Area - Adjust row-start */}
      <footer className="row-start-4 mt-10 text-center text-sm text-gray-500">
        <p>Created by pengnim</p>
      </footer>
    </div>
  );
}
