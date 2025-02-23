import { type ReactElement } from "react";
import { Input } from "../ui/input";
import { useDocuments } from "@/hooks/useDocuments";

export default function SearchInput(): ReactElement {
  const { setSearchQuery, documents } = useDocuments();

  return documents.length > 0 ? (
    <Input
      placeholder="Search the documents..."
      onChange={(e) => setSearchQuery(e.target.value)}
    />
  ) : (
    <></>
  );
}
