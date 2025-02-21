"use client";

import { ChangeEvent, FormEvent, useRef, type ReactElement } from "react";
import fileTypes from "@/config/fileTypes";
import { PutBlobResult } from "@vercel/blob";
import { upload } from "@vercel/blob/client";

interface FileUploadProps {
  setBlobs: React.Dispatch<React.SetStateAction<PutBlobResult[]>>;
}

export default function FileUpload({
  setBlobs,
}: FileUploadProps): ReactElement {
  const onChangeFile = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ?? [];

    for (const file of files) {
      if (!fileTypes.mimeTypes.includes(file.type)) {
        alert("Only .pdf, .docx, .doc and .xlsx files are allowed");
        event.target.value = "";
        return;
      }
    }
  };

  const inputFileRef = useRef<HTMLInputElement>(null);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!inputFileRef.current?.files) {
      throw new Error("No file selected");
    }

    const files = inputFileRef.current.files ?? [];

    for (const file of files) {
      const newBlob = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/upload",
      });

      setBlobs((prevBlobs) => [...prevBlobs, newBlob]);
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex gap-4 items-center">
      <input
        type="file"
        onChange={onChangeFile}
        accept={fileTypes.extensions.join(",")}
        multiple
        ref={inputFileRef}
      />
      <button type="submit">Upload</button>
    </form>
  );
}
