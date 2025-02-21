"use client";

import DocumentViewer from "@/components/documents/DocumentViewer";
import FileUpload from "@/components/FileUpload";
import { PutBlobResult } from "@vercel/blob";
import { useState } from "react";

export default function Home() {
  const [blobs, setBlobs] = useState<PutBlobResult[]>([]);

  return (
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
          <DocumentViewer
            documents={blobs.map((blob) => ({
              uri: blob.url,
              type: blob.contentType,
            }))}
          />
        )}
      </main>
    </div>
  );
}
