import fileTypes from "@/config/fileTypes";
import DocViewer from "@cyntler/react-doc-viewer";
import { Suspense, type ReactElement } from "react";
import DocxViewer from "./DocxViewer";
import { ErrorBoundary } from "react-error-boundary";
import fetchRawDocumentAndApplyCallback from "../utils/fetchRawDocumentAndApplyCallback";
import mammoth from "mammoth";

interface DocumentViewerProps {
  documents: {
    uri: string;
    type: string;
  }[];
}

export default function DocumentViewer({
  documents,
}: DocumentViewerProps): ReactElement {
  return (
    <>
      {documents.map((document) =>
        // if the document is a .docx file, we  fetch it 
        // and convert it to HTML using mammoth
        document.type === fileTypes.mimeTypeByExtension[".docx"] ? (
          <ErrorBoundary
            key={document.uri}
            fallback={<p>⚠️ Something went wrong!</p>}
          >
            <Suspense fallback={<p>Loading document...</p>}>
              <DocxViewer
                documentPromise={fetchRawDocumentAndApplyCallback(
                  document.uri,
                  (arrayBuffer) => mammoth.convertToHtml({ arrayBuffer })
                )}
              />
            </Suspense>
          </ErrorBoundary>
        ) : (
          <DocViewer key={document.uri} documents={[document]} />
        )
      )}
    </>
  );
}
