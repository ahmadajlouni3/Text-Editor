import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Maximize, Minimize, Clock, FileText, Type, Hash } from 'lucide-react';
import { TextStats } from '@/lib/textUtils';
import { Document } from '@/lib/documentManager';

interface EnhancedStatusBarProps {
  stats: TextStats;
  lastSaved: string;
  currentDocument: Document | null;
  readingTime: number;
  onToggleFullscreen: () => void;
  isFullscreen: boolean;
}

export default function EnhancedStatusBar({
  stats,
  lastSaved,
  currentDocument,
  readingTime,
  onToggleFullscreen,
  isFullscreen
}: EnhancedStatusBarProps) {
  const formatLastSaved = (dateString: string) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return date.toLocaleDateString();
  };

  const handleFullscreenToggle = () => {
    if (!document.fullscreenElement) {
      // Enter fullscreen
      document.documentElement.requestFullscreen().then(() => {
        onToggleFullscreen();
      }).catch((err) => {
        console.error('Error attempting to enable fullscreen:', err);
        // Fallback to CSS-only fullscreen
        onToggleFullscreen();
      });
    } else {
      // Exit fullscreen
      document.exitFullscreen().then(() => {
        onToggleFullscreen();
      }).catch((err) => {
        console.error('Error attempting to exit fullscreen:', err);
        // Fallback to CSS-only fullscreen
        onToggleFullscreen();
      });
    }
  };

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-card border-t border-border text-sm text-muted-foreground">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-1">
          <Type className="w-3 h-3" />
          <span>{stats.characters} chars</span>
        </div>
        
        <Separator orientation="vertical" className="h-4" />
        
        <div className="flex items-center space-x-1">
          <Hash className="w-3 h-3" />
          <span>{stats.words} words</span>
        </div>
        
        <Separator orientation="vertical" className="h-4" />
        
        <div className="flex items-center space-x-1">
          <FileText className="w-3 h-3" />
          <span>{stats.paragraphs} paragraphs</span>
        </div>
        
        <Separator orientation="vertical" className="h-4" />
        
        <div className="flex items-center space-x-1">
          <Clock className="w-3 h-3" />
          <span>{Math.ceil(readingTime)} min read</span>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {currentDocument && (
          <>
            <div className="flex items-center space-x-1">
              <span>Last saved: {formatLastSaved(lastSaved)}</span>
            </div>
            <Separator orientation="vertical" className="h-4" />
          </>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleFullscreenToggle}
          className="h-6 px-2 text-muted-foreground hover:text-foreground"
        >
          {isFullscreen ? (
            <>
              <Minimize className="w-3 h-3 mr-1" />
              Exit Fullscreen
            </>
          ) : (
            <>
              <Maximize className="w-3 h-3 mr-1" />
              Fullscreen
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
