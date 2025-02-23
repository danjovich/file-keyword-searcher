import { type ReactElement } from "react";

interface DocumentViewerProps {
  html: string;
}

export default function DocumentViewer({
  html,
}: DocumentViewerProps): ReactElement {
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
