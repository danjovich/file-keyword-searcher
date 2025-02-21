"use client";

import React, { useEffect, useState } from "react";

interface DocumentsContextType {
  documents: {
    uri: string;
    content: string;
    type: string;
  }[];
  setDocuments: React.Dispatch<
    React.SetStateAction<DocumentsContextType["documents"]>
  >;
  setSearchQuery: (query: string) => void;
}

const DocumentsContext = React.createContext<DocumentsContextType | undefined>(
  undefined
);

export function DocumentsProvider({ children }: { children: React.ReactNode }) {
  const [documents, setDocuments] = useState<DocumentsContextType["documents"]>(
    []
  );
  const [shownDocuments, setShownDocuments] = useState<
    DocumentsContextType["documents"]
  >([]);

  useEffect(() => {
    setShownDocuments(documents);
  }, [documents, documents.length]);

  const setSearchQuery = (query: string) => {
    // reset documents
    setShownDocuments(documents);

    if (!query) {
      return;
    }

    // add marks to matches
    const documentsWithMarks = documents.map((document) => {
      console.log(
        document.content.replaceAll(
          query.toLowerCase(),
          `<mark>${query}</mark>`
        )
      );

      const sanitizedQuery = query.replaceAll(/[#-.]|[[-^]|[?|{}]/g, "\\$&");
      const regex = new RegExp(sanitizedQuery, "ig");
      return {
        ...document,
        content: document.content.replaceAll(regex, `<mark>$&</mark>`),
      };
    });

    setShownDocuments(documentsWithMarks);
  };

  return (
    <DocumentsContext.Provider
      value={{ documents: shownDocuments, setDocuments, setSearchQuery }}
    >
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
