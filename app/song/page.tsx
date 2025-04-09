import { playlist } from '@/lib/playlistData';
import SongRouter from './SongRouter';

export default function SongPage() {
  return <SongRouter songs={playlist} />;
} 