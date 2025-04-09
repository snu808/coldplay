import { playlist } from '@/lib/playlistData';
import { notFound } from 'next/navigation';
import SongClient from './SongClient';

// Required for static export
export async function generateStaticParams() {
  return playlist.map((song) => ({
    id: song.id.toString(),
  }));
}

export default function SongPage({ params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  const song = playlist.find((s) => s.id === id);

  if (!song) {
    notFound();
  }

  return <SongClient song={song} />;
} 