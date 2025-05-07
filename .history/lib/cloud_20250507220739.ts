// Simulated Cloud storage functionality

interface Document {
    id: string
    name: string
    content: string
    ownerId: string
  }
  
  const documents: Document[] = []
  
  export function uploadDocument(name: string, content: string, ownerId: string): Document {
    const document: Document = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      content,
      ownerId,
    }
    documents.push(document)
    return document
  }
  
  export function getDocument(id: string): Document | undefined {
    return documents.find((d) => d.id === id)
  }
  
  export function getUserDocuments(ownerId: string): Document[] {
    return documents.filter((d) => d.ownerId === ownerId)
  }
  