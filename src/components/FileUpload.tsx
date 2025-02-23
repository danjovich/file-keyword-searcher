"use client";

import {
  ChangeEvent,
  FormEvent,
  useRef,
  useState,
  type ReactElement,
} from "react";
import { upload } from "@vercel/blob/client";
import { useDocuments } from "@/hooks/useDocuments";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { LoadingSpinner } from "./ui/loading-spinner";
import { FileExtension, FileMimeType } from "@/config/fileTypes";

export default function FileUpload(): ReactElement {
  const { setDocuments } = useDocuments();
  const [buttonEnabled, setButtonEnabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const onChangeFile = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ?? [];

    for (const file of files) {
      if (!Object.values(FileMimeType).includes(file.type as FileMimeType)) {
        alert("Only .pdf, .docx, .doc and .xlsx files are allowed");
        event.target.value = "";
        setButtonEnabled(false);
        return;
      }
    }

    if (files.length > 0) {
      setButtonEnabled(true);
    }
  };

  const inputFileRef = useRef<HTMLInputElement>(null);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!inputFileRef.current?.files) {
      throw new Error("No file selected");
    }

    const files = inputFileRef.current.files ?? [];

    setLoading(true);
    for (const file of files) {
      const blob = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/upload",
      });

      setDocuments((prevDocuments) => [
        ...prevDocuments,
        {
          uri: blob.url,
          type: blob.contentType,
          content: "",
          name: blob.pathname,
        },
      ]);
    }

    setLoading(false);
    inputFileRef.current.value = "";
    setButtonEnabled(false);
  };

  return (
    <div className="flex w-full gap-4 items-center justify-center">
      <form onSubmit={onSubmit} className="flex gap-4 items-center">
        <Input
          type="file"
          onChange={onChangeFile}
          accept={Object.values(FileExtension).join(",")}
          multiple
          ref={inputFileRef}
        />
        {loading ? (
          <LoadingSpinner />
        ) : (
          <Button type="submit" disabled={!buttonEnabled}>
            Upload
          </Button>
        )}
      </form>
    </div>
  );
}
