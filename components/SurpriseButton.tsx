'use client';

import { useRouter } from 'next/navigation';
import type { Song } from '@/lib/playlistData'; // Import Song type if needed or just use number[]

interface SurpriseButtonProps {
  songIds: number[]; // Pass only the IDs needed
}

export default function SurpriseButton({ songIds }: SurpriseButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    if (songIds.length === 0) return; // Avoid errors with empty list

    const randomIndex = Math.floor(Math.random() * songIds.length);
    const randomSongId = songIds[randomIndex];
    router.push(`/song/${randomSongId}`);
  };

  return (
    <button
      onClick={handleClick}
      className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 disabled:opacity-50"
      disabled={songIds.length === 0}
    >
      🎉 Surprise Me! 🎉
    </button>
  );
} 