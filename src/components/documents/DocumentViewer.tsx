import { type ReactElement } from "react";
import { useQuery } from "react-query";

interface DocumentViewerProps {
  uri: string;
  getHtml: (uri: string) => Promise<string>;
  index: number;
}

export default function DocumentViewer({
  getHtml,
  index,
  uri,
}: DocumentViewerProps): ReactElement {
  const { data: html, isLoading } = useQuery(["document", index, uri], () =>
    getHtml(uri), {
      onError: (error) => {
        console.error(error);
      }
    }
  );

  return isLoading ? (
    <p>Loading...</p>
  ) : !html ? (
    <p>Failed to load document</p>
  ) : (
    <div dangerouslySetInnerHTML={{ __html: html }} />
  );
}
