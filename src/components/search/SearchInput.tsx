import { type ReactElement } from "react";
import { Input } from "../ui/input";
import { useDocuments } from "@/hooks/useDocuments";

export default function SearchInput(): ReactElement {
  const { setSearchQuery, thereAreUploadedDocuments } = useDocuments();

  return thereAreUploadedDocuments ? (
    <Input
      placeholder="Search the documents..."
      onChange={(e) => setSearchQuery(e.target.value)}
    />
  ) : (
    <></>
  );
}
