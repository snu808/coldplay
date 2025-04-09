'use client';

import Link from 'next/link';
import type { Song } from '@/lib/playlistData';

interface SongListItemProps {
  song: Song;
}

export default function SongListItem({ song }: SongListItemProps) {
  return (
    <li className="p-3 bg-gray-100 dark:bg-gray-800 rounded shadow flex justify-between items-center">
      {/* Link the song title to the detail page */}
      <Link href={`/song/${song.id}`} className="font-medium hover:underline">
        {song.title}
      </Link>
      {/* YouTube link */}
      <a
        href={song.youtubeId ? `https://www.youtube.com/watch?v=${song.youtubeId}` : '#'}
        target="_blank"
        rel="noopener noreferrer"
        className={`text-sm ${song.youtubeId ? 'text-red-600 hover:underline' : 'text-gray-400 cursor-not-allowed'}`}
        aria-disabled={!song.youtubeId}
        onClick={(e) => !song.youtubeId && e.preventDefault()} // Prevent click if no ID
      >
        (YouTube)
      </a>
    </li>
  );
} 