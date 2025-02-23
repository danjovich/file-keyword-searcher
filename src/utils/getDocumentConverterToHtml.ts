import { extensionsByMimetype, FileMimeType } from "@/config/fileTypes";
import fetchRawDocumentAndApplyCallback from "./fetchRawDocumentAndApplyCallback";
import mammoth from "mammoth";
import XLSX from "xlsx";
import getTextFromPDF from "./getTextFromPDF";
import doc2docx from "./doc2docx";

/**
 * Returns a function that converts a document to HTML based on its MIME type.
 * 
 * @param mimetype - The MIME type of the document to be converted
 * @returns A function that takes a URI string and returns a Promise resolving to the HTML content
 * 
 * The returned function handles different document types:
 * - .docx: Converts Word documents to HTML using mammoth
 * - .xlsx: Converts Excel spreadsheets to HTML using XLSX
 * - .pdf: Extracts text content from PDFs
 * - .doc: Converts legacy Word documents to .docx first, then to HTML
 * - Other types: Returns an empty string
 * 
 * @example
 * ```typescript
 * const converter = getDocumentConverterToHtml(FileMimeType.DOCX);
 * const html = await converter('https://example.com/document.docx');
 * ```
 */
export default function getDocumentConverterToHtml(
  mimetype: FileMimeType
): (uri: string) => Promise<string> {
  const extension = extensionsByMimetype[mimetype];

  switch (extension) {
    case ".docx":
      return (uri: string) =>
        fetchRawDocumentAndApplyCallback(uri, (arrayBuffer) =>
          mammoth.convertToHtml({ arrayBuffer }).then((result) => result.value)
        );
    case ".xlsx":
      return (uri: string) =>
        fetchRawDocumentAndApplyCallback(uri, (arrayBuffer) => {
          const wb = XLSX.read(arrayBuffer);
          const html = XLSX.utils.sheet_to_html(wb.Sheets[wb.SheetNames[0]], {
            header: "<div>",
            footer: "</div>",
          });
          return html;
        });
    case ".pdf":
      return (uri: string) => getTextFromPDF(uri);
    case ".doc":
      return async (uri: string): Promise<string> => {
        const docxUrl = await doc2docx(uri);
        return await getDocumentConverterToHtml(FileMimeType.DOCX)(docxUrl);
      };
    default:
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      return async (_: string) => "";
  }
}
