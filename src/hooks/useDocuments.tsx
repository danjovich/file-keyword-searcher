"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

interface Document {
  uri: string;
  content: string;
  type: string;
  name: string;
}

interface DocumentsContextType {
  /**
   * Documents to be displayed (if search query is not empty, it will contain highlights).
   */
  documents: Document[];
  /**
   * Adds a document to the list of documents.
   *
   * @param document - The document to add.
   * @returns
   */
  addDocument: (document: Document) => void;
  /**
   * Sets the search query for the documents, marking the matches and filtering out the non-matching documents.
   *
   * @param query
   * @returns
   */
  setSearchQuery: (query: string) => void;
  /**
   * Whether there are uploaded documents.
   */
  thereAreUploadedDocuments: boolean;
}

const DocumentsContext = createContext<DocumentsContextType | undefined>(
  undefined
);

export function DocumentsProvider({ children }: { children: React.ReactNode }) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [shownDocuments, setShownDocuments] = useState<Document[]>([]);

  useEffect(() => {
    setShownDocuments(documents);
  }, [documents, documents.length]);

  const addDocument = (document: Document) => {
    setDocuments((prev) => [...prev, document]);
  };

  const setSearchQuery = (query: string) => {
    // reset documents
    setShownDocuments(documents);

    if (!query) {
      return;
    }
    const documentsWithMarks = documents
      .map((document) => {
        // escape regex special characters
        const sanitizedQuery = query.replaceAll(
          /[#-.]|[[-^]|[?|{}()]/g,
          "\\$&"
        );
        // regex to ignore HTML tags
        const ignoringTagsQuery = `(?<=<[^>]*>[^<>]*?)(${sanitizedQuery})(?=[^<>]*?<[^>]*>)`;
        console.log(ignoringTagsQuery);
        // create regex
        const regex = new RegExp(ignoringTagsQuery, "ig");

        // add marks to matches
        const content = document.content.replaceAll(regex, `<mark>$1</mark>`);

        return {
          ...document,
          content,
          matches: content.length !== document.content.length,
        };
      })
      // filter out documents without matches
      .filter((document) => document.matches);

    setShownDocuments(documentsWithMarks);
  };

  const thereAreUploadedDocuments = useMemo(
    () => documents.length > 0,
    [documents]
  );

  return (
    <DocumentsContext.Provider
      value={{
        documents: shownDocuments,
        addDocument,
        setSearchQuery,
        thereAreUploadedDocuments,
      }}
    >
      {children}
    </DocumentsContext.Provider>
  );
}

export function useDocuments(): DocumentsContextType {
  const context = useContext(DocumentsContext);
  if (context === undefined) {
    throw new Error("useDocuments must be used within a DocumentsProvider");
  }
  return context;
}
