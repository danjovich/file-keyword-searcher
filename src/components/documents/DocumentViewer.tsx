import fileTypes from "@/config/fileTypes";
import DocViewer from "@cyntler/react-doc-viewer";
import { Suspense, type ReactElement } from "react";
import DocxViewer from "./DocxViewer";
import { ErrorBoundary } from "react-error-boundary";
import fetchRawDocumentAndApplyCallback from "../utils/fetchRawDocumentAndApplyCallback";
import mammoth from "mammoth";
import XlsxViewer from "./XlsxViewer";
import XLSX from "xlsx";

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
        document.type === fileTypes.mimeTypeByExtension[".docx"] ||
        document.type === fileTypes.mimeTypeByExtension[".doc"] ? (
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
        ) : document.type === fileTypes.mimeTypeByExtension[".xlsx"] ? (
          <ErrorBoundary
            key={document.uri}
            fallback={<p>⚠️ Something went wrong!</p>}
          >
            <Suspense fallback={<p>Loading document...</p>}>
              <XlsxViewer
                key={document.uri}
                documentPromise={fetchRawDocumentAndApplyCallback(
                  document.uri,
                  (arrayBuffer) => {
                    const wb = XLSX.read(arrayBuffer);
                    const html = XLSX.utils.sheet_to_html(
                      wb.Sheets[wb.SheetNames[0]]
                    );
                    return html;
                  }
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
