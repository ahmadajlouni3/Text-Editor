import { useState, useRef, useEffect } from 'react';
import { getTextStats, saveToLocalStorage, loadFromLocalStorage, exportAsTextFile, TextStats } from '@/lib/textUtils';
import Toolbar from './Toolbar';
import StatusBar from './StatusBar';
import { toast } from 'sonner';

export default function TextEditor() {
  const [content, setContent] = useState('');
  const [stats, setStats] = useState<TextStats>({ characters: 0, charactersNoSpaces: 0, words: 0, paragraphs: 0 });
  const [lastSaved, setLastSaved] = useState<string>('');
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load saved content on component mount
    const savedContent = loadFromLocalStorage();
    if (savedContent) {
      setContent(savedContent);
      if (editorRef.current) {
        editorRef.current.innerHTML = savedContent;
      }
      updateStats(savedContent);
    }

    const savedTime = localStorage.getItem('textEditor_lastSaved');
    if (savedTime) {
      setLastSaved(savedTime);
    }
  }, []);

  const updateStats = (text: string) => {
    const plainText = text.replace(/<[^>]*>/g, ''); // Remove HTML tags for stats
    setStats(getTextStats(plainText));
  };

  const handleContentChange = () => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML;
      setContent(newContent);
      updateStats(newContent);
    }
  };

  const handleSave = () => {
    saveToLocalStorage(content);
    const now = new Date().toISOString();
    setLastSaved(now);
    toast.success('Document saved successfully!');
  };

  const handleNew = () => {
    if (content && content.trim() !== '') {
      if (confirm('Are you sure you want to create a new document? Unsaved changes will be lost.')) {
        setContent('');
        if (editorRef.current) {
          editorRef.current.innerHTML = '';
        }
        updateStats('');
        toast.success('New document created!');
      }
    } else {
      setContent('');
      if (editorRef.current) {
        editorRef.current.innerHTML = '';
      }
      updateStats('');
      toast.success('New document created!');
    }
  };

  const handleLoad = () => {
    const savedContent = loadFromLocalStorage();
    if (savedContent) {
      setContent(savedContent);
      if (editorRef.current) {
        editorRef.current.innerHTML = savedContent;
      }
      updateStats(savedContent);
      toast.success('Document loaded successfully!');
    } else {
      toast.info('No saved document found.');
    }
  };

  const handleExport = () => {
    const plainText = content.replace(/<[^>]*>/g, ''); // Remove HTML tags for export
    exportAsTextFile(plainText);
    toast.success('Document exported successfully!');
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      <Toolbar
        onSave={handleSave}
        onNew={handleNew}
        onExport={handleExport}
        onLoad={handleLoad}
      />
      
      <div className="flex-1 overflow-hidden">
        <div
          ref={editorRef}
          contentEditable
          className="w-full h-full p-6 outline-none resize-none text-gray-900 leading-relaxed"
          style={{ 
            minHeight: '100%',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontSize: '16px',
            lineHeight: '1.6'
          }}
          onInput={handleContentChange}
          onBlur={handleContentChange}
          placeholder="Start typing your document..."
          suppressContentEditableWarning={true}
        />
      </div>

      <StatusBar stats={stats} lastSaved={lastSaved} />
    </div>
  );
}
