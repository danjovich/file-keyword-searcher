"use client";

import DocumentsViewer from "@/components/documents/DocumentsViewer";
import FileUpload from "@/components/FileUpload";
import { Input } from "@/components/ui/input";
import { PutBlobResult } from "@vercel/blob";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { DocumentsProvider } from "./hooks/useDocuments";

const queryClient = new QueryClient();

export default function Home() {
  const [blobs, setBlobs] = useState<PutBlobResult[]>([]);

  return (
    <QueryClientProvider client={queryClient}>
      <DocumentsProvider>
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
          <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
            <FileUpload setBlobs={setBlobs} />

            {blobs.map((blob) => (
              <div
                key={blob.url}
                className="flex gap-4 items-center bg-black/[.05] dark:bg-white/[.06] p-4 rounded-md"
              >
                Blob url: <a href={blob.url}>{blob.url}</a>
              </div>
            ))}

            {blobs.length > 0 && (
              <>
                <Input placeholder="Enter text to search in the documents..." />
                <DocumentsViewer
                  documents={blobs.map((blob) => ({
                    uri: blob.url,
                    type: blob.contentType,
                  }))}
                />
              </>
            )}
          </main>
        </div>
      </DocumentsProvider>
    </QueryClientProvider>
  );
}
