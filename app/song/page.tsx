import { Suspense } from 'react';
import { playlist } from '@/lib/playlistData';
import SongRouter from './SongRouter';

export default function SongPage() {
  return (
    <Suspense fallback={<div>Loading song...</div>}>
      <SongRouter songs={playlist} />
    </Suspense>
  );
} 