import { use, type ReactElement } from "react";

interface XlsxViewerProps {
  documentPromise: Promise<string>;
}

export default function XlsxViewer({
  documentPromise,
}: XlsxViewerProps): ReactElement {
  const document = use(documentPromise);

  return <div dangerouslySetInnerHTML={{ __html: document }} />;
}
