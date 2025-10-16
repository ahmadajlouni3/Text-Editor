import { useState, useRef, useEffect } from 'react';
import { getTextStats, saveToLocalStorage, loadFromLocalStorage, exportAsTextFile, TextStats } from '@/lib/textUtils';
import { DocumentManager, Document } from '@/lib/documentManager';
import { ThemeManager, Theme } from '@/lib/themeManager';
import EnhancedToolbar from './EnhancedToolbar';
import EnhancedStatusBar from './EnhancedStatusBar';
import DocumentSidebar from './DocumentSidebar';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Edit3, Check, X } from 'lucide-react';

export default function ComprehensiveTextEditor() {
  const [content, setContent] = useState('');
  const [stats, setStats] = useState<TextStats>({ characters: 0, charactersNoSpaces: 0, words: 0, paragraphs: 0 });
  const [lastSaved, setLastSaved] = useState<string>('');
  const [currentDocument, setCurrentDocument] = useState<Document | null>(null);
  const [theme, setTheme] = useState<Theme>('light');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState('');
  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize theme
    const savedTheme = ThemeManager.getTheme();
    setTheme(savedTheme);
    ThemeManager.applyTheme(savedTheme);

    // Load current document or create new one
    const currentDoc = DocumentManager.getCurrentDocument();
    if (currentDoc) {
      setCurrentDocument(currentDoc);
      setContent(currentDoc.content);
      if (editorRef.current) {
        editorRef.current.innerHTML = currentDoc.content;
      }
      updateStats(currentDoc.content);
    } else {
      handleNewDocument();
    }

    const savedTime = localStorage.getItem('textEditor_lastSaved');
    if (savedTime) {
      setLastSaved(savedTime);
    }

    // Auto-save every 30 seconds
    const autoSaveInterval = setInterval(() => {
      if (currentDocument && content) {
        handleAutoSave();
      }
    }, 30000);

    return () => clearInterval(autoSaveInterval);
  }, []);

  const updateStats = (text: string) => {
    const plainText = text.replace(/<[^>]*>/g, '');
    setStats(getTextStats(plainText));
  };

  const calculateReadingTime = (text: string): number => {
    const plainText = text.replace(/<[^>]*>/g, '');
    const wordsPerMinute = 200;
    const words = plainText.trim().split(/\s+/).length;
    return words / wordsPerMinute;
  };

  const saveToUndoStack = (content: string) => {
    setUndoStack(prev => [...prev.slice(-19), content]); // Keep last 20 states
    setRedoStack([]); // Clear redo stack when new action is performed
  };

  const handleContentChange = () => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML;
      if (newContent !== content) {
        saveToUndoStack(content);
        setContent(newContent);
        updateStats(newContent);
      }
    }
  };

  const handleAutoSave = () => {
    if (currentDocument) {
      const updatedDoc = DocumentManager.saveDocument({
        ...currentDocument,
        content,
        wordCount: stats.words
      });
      setCurrentDocument(updatedDoc);
      const now = new Date().toISOString();
      setLastSaved(now);
      setRefreshTrigger(prev => prev + 1); // Trigger sidebar refresh
    }
  };

  const handleSave = () => {
    if (currentDocument) {
      const updatedDoc = DocumentManager.saveDocument({
        ...currentDocument,
        content,
        wordCount: stats.words
      });
      setCurrentDocument(updatedDoc);
      const now = new Date().toISOString();
      setLastSaved(now);
      setRefreshTrigger(prev => prev + 1); // Trigger sidebar refresh
      toast.success('Document saved successfully!');
    }
  };

  const handleNewDocument = () => {
    if (content && content.trim() !== '') {
      if (confirm('Are you sure you want to create a new document? Unsaved changes will be lost.')) {
        createNewDocument();
      }
    } else {
      createNewDocument();
    }
  };

  const createNewDocument = () => {
    const newDoc = DocumentManager.saveDocument({
      title: 'Untitled Document',
      content: '',
      wordCount: 0
    });
    DocumentManager.setCurrentDocument(newDoc.id);
    setCurrentDocument(newDoc);
    setContent('');
    if (editorRef.current) {
      editorRef.current.innerHTML = '';
    }
    updateStats('');
    setUndoStack([]);
    setRedoStack([]);
    setRefreshTrigger(prev => prev + 1); // Trigger sidebar refresh
    toast.success('New document created!');
  };

  const handleLoad = (fileContent?: string) => {
    if (fileContent) {
      // Load from file
      saveToUndoStack(content);
      setContent(fileContent);
      if (editorRef.current) {
        editorRef.current.innerHTML = fileContent;
      }
      updateStats(fileContent);
      toast.success('File loaded successfully!');
    } else {
      // Load from localStorage (legacy)
      const savedContent = loadFromLocalStorage();
      if (savedContent) {
        saveToUndoStack(content);
        setContent(savedContent);
        if (editorRef.current) {
          editorRef.current.innerHTML = savedContent;
        }
        updateStats(savedContent);
        toast.success('Document loaded successfully!');
      } else {
        toast.info('No saved document found.');
      }
    }
  };

  const handleExport = () => {
    const plainText = content.replace(/<[^>]*>/g, '');
    const filename = currentDocument ? `${currentDocument.title}.txt` : 'document.txt';
    exportAsTextFile(plainText, filename);
    toast.success('Document exported successfully!');
  };

  const handleUndo = () => {
    if (undoStack.length > 0) {
      const previousContent = undoStack[undoStack.length - 1];
      setRedoStack(prev => [content, ...prev]);
      setUndoStack(prev => prev.slice(0, -1));
      setContent(previousContent);
      if (editorRef.current) {
        editorRef.current.innerHTML = previousContent;
      }
      updateStats(previousContent);
    }
  };

  const handleRedo = () => {
    if (redoStack.length > 0) {
      const nextContent = redoStack[0];
      setUndoStack(prev => [...prev, content]);
      setRedoStack(prev => prev.slice(1));
      setContent(nextContent);
      if (editorRef.current) {
        editorRef.current.innerHTML = nextContent;
      }
      updateStats(nextContent);
    }
  };

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    ThemeManager.setTheme(newTheme);
    toast.success(`Switched to ${newTheme} theme`);
  };

  const handleDocumentSelect = (doc: Document) => {
    if (currentDocument && content !== currentDocument.content) {
      handleAutoSave();
    }
    setCurrentDocument(doc);
    DocumentManager.setCurrentDocument(doc.id);
    setContent(doc.content);
    if (editorRef.current) {
      editorRef.current.innerHTML = doc.content;
    }
    updateStats(doc.content);
    setUndoStack([]);
    setRedoStack([]);
  };

  const handleTitleEdit = () => {
    if (currentDocument) {
      setTempTitle(currentDocument.title);
      setIsEditingTitle(true);
    }
  };

  const handleTitleSave = () => {
    if (currentDocument && tempTitle.trim()) {
      const updatedDoc = DocumentManager.saveDocument({
        ...currentDocument,
        title: tempTitle.trim()
      });
      setCurrentDocument(updatedDoc);
      setIsEditingTitle(false);
      setRefreshTrigger(prev => prev + 1); // Trigger sidebar refresh
      toast.success('Title updated!');
    }
  };

  const handleTitleCancel = () => {
    setIsEditingTitle(false);
    setTempTitle('');
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className={`flex flex-col h-screen ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Document Title Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-card border-b border-border">
        <div className="flex items-center space-x-2">
          <DocumentSidebar
            currentDocument={currentDocument}
            onDocumentSelect={handleDocumentSelect}
            onNewDocument={handleNewDocument}
            refreshTrigger={refreshTrigger}
          />
          
          {currentDocument && (
            <div className="flex items-center space-x-2">
              {isEditingTitle ? (
                <div className="flex items-center space-x-1">
                  <Input
                    value={tempTitle}
                    onChange={(e) => setTempTitle(e.target.value)}
                    className="h-8 text-sm"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleTitleSave();
                      if (e.key === 'Escape') handleTitleCancel();
                    }}
                    autoFocus
                  />
                  <Button size="sm" variant="ghost" onClick={handleTitleSave} className="h-8 px-2">
                    <Check className="w-3 h-3" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={handleTitleCancel} className="h-8 px-2">
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-1">
                  <h1 className="text-lg font-semibold text-foreground">{currentDocument.title}</h1>
                  <Button size="sm" variant="ghost" onClick={handleTitleEdit} className="h-8 px-2">
                    <Edit3 className="w-3 h-3" />
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <EnhancedToolbar
        onSave={handleSave}
        onNew={handleNewDocument}
        onExport={handleExport}
        onLoad={handleLoad}
        onUndo={handleUndo}
        onRedo={handleRedo}
        currentTheme={theme}
        onThemeChange={handleThemeChange}
      />
      
      <div className="flex-1 overflow-auto bg-background">
        <div
          ref={editorRef}
          contentEditable
          className="w-full min-h-full p-8 outline-none resize-none text-foreground leading-relaxed focus:ring-2 focus:ring-ring focus:ring-opacity-20"
          style={{ 
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontSize: '16px',
            lineHeight: '1.6'
          }}
          onInput={handleContentChange}
          onBlur={handleContentChange}
          suppressContentEditableWarning={true}
        />
      </div>

      <EnhancedStatusBar 
        stats={stats} 
        lastSaved={lastSaved}
        currentDocument={currentDocument}
        readingTime={calculateReadingTime(content)}
        onToggleFullscreen={toggleFullscreen}
        isFullscreen={isFullscreen}
      />
    </div>
  );
}
