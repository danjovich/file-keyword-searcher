import DocViewer, { DocViewerRef } from "@cyntler/react-doc-viewer";
import { useRef, type ReactElement } from "react";

interface DocumentViewerProps {
  documents: {
    uri: string;
    type: string;
  }[];
}

export default function DocumentViewer({
  documents,
}: DocumentViewerProps): ReactElement {
    
  return <DocViewer documents={documents} />;
}
