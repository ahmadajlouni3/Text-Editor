import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  Save,
  FileText,
  Download,
  Upload
} from 'lucide-react';
import { formatText } from '@/lib/textUtils';

interface ToolbarProps {
  onSave: () => void;
  onNew: () => void;
  onExport: () => void;
  onLoad: () => void;
}

export default function Toolbar({ onSave, onNew, onExport, onLoad }: ToolbarProps) {
  const handleFontSize = (size: string) => {
    formatText('fontSize', size);
  };

  return (
    <div className="flex items-center space-x-2 p-3 bg-white border-b">
      {/* File Operations */}
      <Button variant="outline" size="sm" onClick={onNew}>
        <FileText className="w-4 h-4 mr-1" />
        New
      </Button>
      <Button variant="outline" size="sm" onClick={onLoad}>
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

      <Separator orientation="vertical" className="h-6" />

      {/* Font Size */}
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

      <Separator orientation="vertical" className="h-6" />

      {/* Text Formatting */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => formatText('bold')}
        className="p-2"
      >
        <Bold className="w-4 h-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => formatText('italic')}
        className="p-2"
      >
        <Italic className="w-4 h-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => formatText('underline')}
        className="p-2"
      >
        <Underline className="w-4 h-4" />
      </Button>

      <Separator orientation="vertical" className="h-6" />

      {/* Text Alignment */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => formatText('justifyLeft')}
        className="p-2"
      >
        <AlignLeft className="w-4 h-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => formatText('justifyCenter')}
        className="p-2"
      >
        <AlignCenter className="w-4 h-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => formatText('justifyRight')}
        className="p-2"
      >
        <AlignRight className="w-4 h-4" />
      </Button>
    </div>
  );
}
