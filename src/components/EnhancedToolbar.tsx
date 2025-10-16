import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  AlignJustify,
  Save,
  FileText,
  Download,
  Upload,
  Undo,
  Redo,
  List,
  ListOrdered,
  Link,
  Image,
  Palette,
  Moon,
  Sun,
  Eye,
  Contrast,
  Strikethrough,
  Subscript,
  Superscript
} from 'lucide-react';
import { formatText } from '@/lib/textUtils';
import { ThemeManager, Theme } from '@/lib/themeManager';
import { useState, useRef } from 'react';

interface EnhancedToolbarProps {
  onSave: () => void;
  onNew: () => void;
  onExport: () => void;
  onLoad: () => void;
  onUndo: () => void;
  onRedo: () => void;
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
}

const colors = [
  '#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF',
  '#800000', '#008000', '#000080', '#808000', '#800080', '#008080', '#C0C0C0'
];

const fonts = [
  'Arial', 'Georgia', 'Times New Roman', 'Courier New', 'Verdana', 'Helvetica',
  'Comic Sans MS', 'Impact', 'Trebuchet MS', 'Palatino'
];

export default function EnhancedToolbar({ 
  onSave, 
  onNew, 
  onExport, 
  onLoad, 
  onUndo, 
  onRedo,
  currentTheme,
  onThemeChange 
}: EnhancedToolbarProps) {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFontSize = (size: string) => {
    document.execCommand('fontSize', false, size);
  };

  const handleFontFamily = (font: string) => {
    document.execCommand('fontName', false, font);
  };

  const handleTextColor = (color: string) => {
    document.execCommand('foreColor', false, color);
    setShowColorPicker(false);
  };

  const handleBackgroundColor = (color: string) => {
    document.execCommand('backColor', false, color);
  };

  const insertLink = () => {
    const selection = window.getSelection();
    if (selection && selection.toString()) {
      const url = prompt('Enter URL:');
      if (url) {
        document.execCommand('createLink', false, url);
      }
    } else {
      alert('Please select some text first to create a link.');
    }
  };

  const insertImage = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      document.execCommand('insertImage', false, url);
    }
  };

  const handleFileLoad = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        onLoad(content);
      };
      reader.readAsText(file);
    }
  };

  const themeIcons = {
    light: Sun,
    dark: Moon,
    sepia: Eye,
    'high-contrast': Contrast
  };

  const themeLabels = {
    light: 'Light',
    dark: 'Dark',
    sepia: 'Sepia',
    'high-contrast': 'High Contrast'
  };

  const ThemeIcon = themeIcons[currentTheme];

  return (
    <div className="flex items-center space-x-2 p-3 bg-card border-b border-border flex-wrap gap-2">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".txt,.html,.md"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      {/* File Operations */}
      <div className="flex items-center space-x-1">
        <Button variant="outline" size="sm" onClick={onNew}>
          <FileText className="w-4 h-4 mr-1" />
          New
        </Button>
        <Button variant="outline" size="sm" onClick={handleFileLoad}>
          <Upload className="w-4 h-4 mr-1" />
          Load
        </Button>
        <Button variant="outline" size="sm" onClick={onSave}>
          <Save className="w-4 h-4 mr-1" />
          Save
        </Button>
        <Button variant="outline" size="sm" onClick={onExport}>
          <Download className="w-4 h-4 mr-1" />
          Export
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Undo/Redo */}
      <div className="flex items-center space-x-1">
        <Button variant="outline" size="sm" onClick={onUndo} className="p-2">
          <Undo className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={onRedo} className="p-2">
          <Redo className="w-4 h-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Font Controls */}
      <div className="flex items-center space-x-1">
        <Select onValueChange={handleFontFamily}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Font" />
          </SelectTrigger>
          <SelectContent>
            {fonts.map(font => (
              <SelectItem key={font} value={font}>
                <span style={{ fontFamily: font }}>{font}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select onValueChange={handleFontSize}>
          <SelectTrigger className="w-20">
            <SelectValue placeholder="Size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">8pt</SelectItem>
            <SelectItem value="2">10pt</SelectItem>
            <SelectItem value="3">12pt</SelectItem>
            <SelectItem value="4">14pt</SelectItem>
            <SelectItem value="5">18pt</SelectItem>
            <SelectItem value="6">24pt</SelectItem>
            <SelectItem value="7">36pt</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Text Formatting */}
      <div className="flex items-center space-x-1">
        <Button variant="outline" size="sm" onClick={() => document.execCommand('bold')} className="p-2">
          <Bold className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={() => document.execCommand('italic')} className="p-2">
          <Italic className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={() => document.execCommand('underline')} className="p-2">
          <Underline className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={() => document.execCommand('strikeThrough')} className="p-2">
          <Strikethrough className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={() => document.execCommand('subscript')} className="p-2">
          <Subscript className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={() => document.execCommand('superscript')} className="p-2">
          <Superscript className="w-4 h-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Colors */}
      <div className="flex items-center space-x-1">
        <Popover open={showColorPicker} onOpenChange={setShowColorPicker}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="p-2">
              <Palette className="w-4 h-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64">
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium mb-2">Text Color</p>
                <div className="grid grid-cols-7 gap-1">
                  {colors.map(color => (
                    <button
                      key={color}
                      className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                      onClick={() => handleTextColor(color)}
                    />
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Background Color</p>
                <div className="grid grid-cols-7 gap-1">
                  {colors.map(color => (
                    <button
                      key={`bg-${color}`}
                      className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                      onClick={() => handleBackgroundColor(color)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Text Alignment */}
      <div className="flex items-center space-x-1">
        <Button variant="outline" size="sm" onClick={() => document.execCommand('justifyLeft')} className="p-2">
          <AlignLeft className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={() => document.execCommand('justifyCenter')} className="p-2">
          <AlignCenter className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={() => document.execCommand('justifyRight')} className="p-2">
          <AlignRight className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={() => document.execCommand('justifyFull')} className="p-2">
          <AlignJustify className="w-4 h-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Lists */}
      <div className="flex items-center space-x-1">
        <Button variant="outline" size="sm" onClick={() => document.execCommand('insertUnorderedList')} className="p-2">
          <List className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={() => document.execCommand('insertOrderedList')} className="p-2">
          <ListOrdered className="w-4 h-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Insert */}
      <div className="flex items-center space-x-1">
        <Button variant="outline" size="sm" onClick={insertLink} className="p-2">
          <Link className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={insertImage} className="p-2">
          <Image className="w-4 h-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Theme Selector */}
      <Select value={currentTheme} onValueChange={onThemeChange}>
        <SelectTrigger className="w-32">
          <ThemeIcon className="w-4 h-4 mr-1" />
          <SelectValue placeholder={themeLabels[currentTheme]} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="light">
            <div className="flex items-center">
              Light
            </div>
          </SelectItem>
          <SelectItem value="dark">
            <div className="flex items-center">
              Dark
            </div>
          </SelectItem>
          <SelectItem value="sepia">
            <div className="flex items-center">
              Sepia
            </div>
          </SelectItem>
          <SelectItem value="high-contrast">
            <div className="flex items-center">
              High Contrast
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
