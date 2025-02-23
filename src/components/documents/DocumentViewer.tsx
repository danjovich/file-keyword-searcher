import { type ReactElement } from "react";

interface DocumentViewerProps {
  html: string;
}

export default function DocumentViewer({
  html,
}: DocumentViewerProps): ReactElement {
  // although it isn't ideal to render raw HTML like this,
  // we assume that the HTML is safe to render since the user
  // themselves uploaded the document
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
