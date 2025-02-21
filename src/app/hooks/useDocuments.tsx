"use client";

import React, { useState } from "react";

interface DocumentsContextType {
  documents: {
    uri: string;
    type: string;
  }[];
  setDocuments: React.Dispatch<
    React.SetStateAction<DocumentsContextType["documents"]>
  >;
}

const DocumentsContext = React.createContext<DocumentsContextType | undefined>(
  undefined
);

export function DocumentsProvider({ children }: { children: React.ReactNode }) {
  const [documents, setDocuments] = useState<DocumentsContextType["documents"]>(
    []
  );
  return (
    <DocumentsContext.Provider value={{ documents, setDocuments }}>
      {children}
    </DocumentsContext.Provider>
  );
}

export function useDocuments(): DocumentsContextType {
  const context = React.useContext(DocumentsContext);
  if (context === undefined) {
    throw new Error("useDocuments must be used within a DocumentsProvider");
  }
  return context;
}
