export interface Document {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  wordCount: number;
}

export class DocumentManager {
  private static readonly STORAGE_KEY = 'textEditor_documents';
  private static readonly CURRENT_DOC_KEY = 'textEditor_currentDocument';

  static getAllDocuments(): Document[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  static saveDocument(doc: Partial<Document>): Document {
    const documents = this.getAllDocuments();
    const now = new Date().toISOString();
    
    if (doc.id) {
      // Update existing document
      const index = documents.findIndex(d => d.id === doc.id);
      if (index !== -1) {
        documents[index] = { ...documents[index], ...doc, updatedAt: now };
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(documents));
        return documents[index];
      }
    }
    
    // Create new document
    const newDoc: Document = {
      id: Date.now().toString(),
      title: doc.title || 'Untitled Document',
      content: doc.content || '',
      createdAt: now,
      updatedAt: now,
      wordCount: doc.content ? doc.content.replace(/<[^>]*>/g, '').trim().split(/\s+/).length : 0
    };
    
    documents.unshift(newDoc);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(documents));
    return newDoc;
  }

  static deleteDocument(id: string): void {
    const documents = this.getAllDocuments().filter(d => d.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(documents));
  }

  static getCurrentDocument(): Document | null {
    const currentId = localStorage.getItem(this.CURRENT_DOC_KEY);
    if (!currentId) return null;
    return this.getAllDocuments().find(d => d.id === currentId) || null;
  }

  static setCurrentDocument(id: string): void {
    localStorage.setItem(this.CURRENT_DOC_KEY, id);
  }
}
