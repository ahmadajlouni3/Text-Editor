import { TextStats } from '@/lib/textUtils';

interface StatusBarProps {
  stats: TextStats;
  lastSaved?: string;
}

export default function StatusBar({ stats, lastSaved }: StatusBarProps) {
  return (
    <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-t text-sm text-gray-600">
      <div className="flex items-center space-x-4">
        <span>Words: {stats.words}</span>
        <span>Characters: {stats.characters}</span>
        <span>Characters (no spaces): {stats.charactersNoSpaces}</span>
        <span>Paragraphs: {stats.paragraphs}</span>
      </div>
      {lastSaved && (
        <div className="text-xs text-gray-500">
          Last saved: {new Date(lastSaved).toLocaleTimeString()}
        </div>
      )}
    </div>
  );
}
