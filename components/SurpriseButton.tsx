'use client';

import { useRouter } from 'next/navigation';
// Ensure unused import is removed
// import type { Song } from '@/lib/playlistData';

interface SurpriseButtonProps {
  songIds: number[]; // Pass only the IDs needed
}

export default function SurpriseButton({ songIds }: SurpriseButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    if (songIds.length === 0) return; // Avoid errors with empty list

    const randomIndex = Math.floor(Math.random() * songIds.length);
    const randomSongId = songIds[randomIndex];
    router.push(`/song?id=${randomSongId}`);
  };

  return (
    <button
      onClick={handleClick}
      className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-opacity-50 disabled:opacity-50 shadow-md"
      disabled={songIds.length === 0}
    >
      🎉 Surprise Me! 🎉
    </button>
  );
} 