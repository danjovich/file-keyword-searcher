import { useDocuments } from "@/hooks/useDocuments";
import { useEffect, useState, type ReactElement } from "react";
import { useQuery } from "react-query";

interface DocumentViewerProps {
  uri: string;
  getHtml: (uri: string) => Promise<string>;
  index: number;
  type: string;
  name: string;
}

export default function DocumentViewer({
  getHtml,
  index,
  uri,
  type,
  name,
}: DocumentViewerProps): ReactElement {
  const { setDocuments, documents } = useDocuments();

  const [html, setHtml] = useState<string | undefined>(undefined);

  const { isLoading } = useQuery(["document", index, uri], () => getHtml(uri), {
    onSuccess: (data) => {
      setHtml(data);
      setDocuments((prev) => {
        const newDocuments = [...prev];
        newDocuments[index] = { uri, content: data, type, name };
        return newDocuments;
      });
    },
    onError: (error) => {
      console.error(error);
    },
    enabled: !html,
    retry: false,
  });

  useEffect(() => {
    if (documents[index]?.content) {
      setHtml(documents[index].content);
    }
  }, [documents, index]);

  return isLoading ? (
    <p>Loading...</p>
  ) : !html ? (
    <p>Failed to load document</p>
  ) : (
    <div dangerouslySetInnerHTML={{ __html: html }} />
  );
}
