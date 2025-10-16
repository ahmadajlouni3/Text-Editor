import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { DocumentManager, Document } from '@/lib/documentManager';
import { FileText, Plus, Trash2, Menu } from 'lucide-react';
import { toast } from 'sonner';

interface DocumentSidebarProps {
  currentDocument: Document | null;
  onDocumentSelect: (doc: Document) => void;
  onNewDocument: () => void;
  refreshTrigger: number;
}

export default function DocumentSidebar({ 
  currentDocument, 
  onDocumentSelect, 
  onNewDocument, 
  refreshTrigger 
}: DocumentSidebarProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    loadDocuments();
  }, [refreshTrigger]);

  const loadDocuments = () => {
    const docs = DocumentManager.getAllDocuments();
    setDocuments(docs);
  };

  const handleDeleteDocument = (docId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this document?')) {
      DocumentManager.deleteDocument(docId);
      loadDocuments();
      
      // If we deleted the current document, create a new one
      if (currentDocument?.id === docId) {
        onNewDocument();
      }
      
      toast.success('Document deleted successfully!');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const DocumentList = () => (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Documents</h3>
        <Button size="sm" onClick={onNewDocument} className="h-8">
          <Plus className="w-4 h-4 mr-1" />
          New
        </Button>
      </div>
      
      <ScrollArea className="h-[400px]">
        <div className="space-y-2">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className={`p-3 rounded-lg border cursor-pointer transition-colors hover:border-accent-foreground ${
                currentDocument?.id === doc.id 
                  ? 'bg-primary text-primary-foreground border-primary' 
                  : 'bg-card text-card-foreground border-border hover:border-accent-foreground'
              }`}
              onClick={() => {
                onDocumentSelect(doc);
                setIsOpen(false);
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <FileText className="w-4 h-4 flex-shrink-0" />
                    <h4 className="font-medium truncate">{doc.title}</h4>
                  </div>
                  <div className="text-sm opacity-70">
                    {doc.wordCount} words
                  </div>
                  <div className="text-xs opacity-50 mt-1">
                    {formatDate(doc.lastModified)}
                  </div>
                  {doc.content && (
                    <div className="text-xs opacity-60 mt-2 line-clamp-2">
                      {doc.content.replace(/<[^>]*>/g, '').substring(0, 100)}...
                    </div>
                  )}
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => handleDeleteDocument(doc.id, e)}
                  className="ml-2 h-8 w-8 p-0 opacity-70 hover:opacity-100 hover:bg-destructive hover:text-destructive-foreground"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
          
          {documents.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No documents yet</p>
              <p className="text-sm">Create your first document to get started</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          <Menu className="w-4 h-4 mr-1" />
          Documents
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 bg-background">
        <SheetHeader>
          <SheetTitle className="text-foreground">Document Manager</SheetTitle>
        </SheetHeader>
        <Separator className="my-4" />
        <DocumentList />
      </SheetContent>
    </Sheet>
  );
}
