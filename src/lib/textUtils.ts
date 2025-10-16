export interface TextStats {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  paragraphs: number;
}

export const getTextStats = (text: string): TextStats => {
  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, '').length;
  const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
  const paragraphs = text.trim() === '' ? 0 : text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;

  return {
    characters,
    charactersNoSpaces,
    words,
    paragraphs
  };
};

export const saveToLocalStorage = (content: string, filename: string = 'document') => {
  localStorage.setItem(`textEditor_${filename}`, content);
  localStorage.setItem('textEditor_lastSaved', new Date().toISOString());
};

export const loadFromLocalStorage = (filename: string = 'document'): string => {
  return localStorage.getItem(`textEditor_${filename}`) || '';
};

export const exportAsTextFile = (content: string, filename: string = 'document.txt') => {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const formatText = (command: string, value?: string) => {
  document.execCommand(command, false, value);
};
