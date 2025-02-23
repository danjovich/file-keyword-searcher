import { useDocuments } from "@/hooks/useDocuments";
import { type ReactElement } from "react";

export default function Header(): ReactElement {
  const { thereAreUploadedDocuments } = useDocuments();

  if (thereAreUploadedDocuments) {
    return <></>;
  }

  return (
    <div className="flex flex-col gap-2 w-full text-center items-center sm:text-left mb-4">
      <h1 className="text-4xl font-bold text-gray-900">
        File Display & Search
      </h1>
      <p className="text-lg text-gray-600">
        Upload your documents and search through their contents with ease
      </p>
    </div>
  );
}
