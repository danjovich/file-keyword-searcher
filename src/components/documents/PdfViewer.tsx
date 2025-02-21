import { use, type ReactElement } from "react";

interface PdfViewerProps {
  documentPromise: Promise<string>;
}

export default function PdfViewer({
  documentPromise,
}: PdfViewerProps): ReactElement {
  const document = use(documentPromise);

  return <div dangerouslySetInnerHTML={{ __html: document }} />;
}
