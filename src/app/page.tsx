"use client";

import DocumentsViewer from "@/components/documents/DocumentsViewer";
import FileUpload from "@/components/FileUpload";
import { DocumentsProvider } from "../hooks/useDocuments";
import SearchInput from "@/components/search/SearchInput";
import Header from "@/components/Header";

export default function Home() {
  return (
    <div className="flex items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 w-full row-start-2 items-center sm:items-start">
        <DocumentsProvider>
          <Header />
          <FileUpload />
          <SearchInput />
          <DocumentsViewer />
        </DocumentsProvider>
      </main>
    </div>
  );
}
