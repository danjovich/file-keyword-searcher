import { type ReactElement } from "react";
import { Input } from "../ui/input";
import { useDocuments } from "@/hooks/useDocuments";
import { useDebouncedCallback } from "use-debounce";

export default function SearchInput(): ReactElement {
  const { setSearchQuery, thereAreUploadedDocuments } = useDocuments();

  const debounce = useDebouncedCallback((value: string) => {
    setSearchQuery(value);
  }, 300);

  return thereAreUploadedDocuments ? (
    <Input
      placeholder="Search the documents..."
      onChange={(e) => debounce(e.target.value)}
    />
  ) : (
    <></>
  );
}
