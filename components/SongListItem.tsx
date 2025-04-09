'use client';

import Link from 'next/link';
import type { Song } from '@/lib/playlistData';

interface SongListItemProps {
  song: Song;
}

export default function SongListItem({ song }: SongListItemProps) {
  return (
    <li className="p-3 bg-black/30 backdrop-blur-sm rounded shadow-lg flex flex-col justify-between min-h-[5rem] text-gray-100 hover:bg-black/50 transition-colors duration-200">
      {/* Song Title Area */}
      <div>
        <Link href={`/song?id=${song.id}`} className="font-semibold text-base hover:text-teal-300 transition-colors duration-150 line-clamp-2">
          {song.title}
        </Link>
      </div>
      {/* YouTube link Area - Pushed towards the bottom */}
      <div className="mt-1 text-right">
        <a
          href={song.youtubeId ? `https://www.youtube.com/watch?v=${song.youtubeId}` : '#'}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-block text-xs px-2 py-0.5 rounded ${song.youtubeId ? 'bg-red-600/80 hover:bg-red-500/80 text-white' : 'bg-gray-600/50 text-gray-400 cursor-not-allowed'}`}
          aria-disabled={!song.youtubeId}
          onClick={(e) => !song.youtubeId && e.preventDefault()} // Prevent click if no ID
        >
          YouTube
        </a>
      </div>
    </li>
  );
} 