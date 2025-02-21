import * as pdfjs from "pdfjs-dist";
import { TextItem } from "pdfjs-dist/types/src/display/api";
import "pdfjs-dist/build/pdf.worker.mjs";

/**
 * Extracts text content from a PDF document at the specified URL. Inspired by https://stackoverflow.com/a/40662025.
 *
 * @param pdfUrl - The URL or file path of the PDF document to process
 * @returns A Promise that resolves to a string containing all extracted text from the PDF
 */
export default async function getTextFromPDF(pdfUrl: string) {
  const pdf = pdfjs.getDocument(pdfUrl).promise;
  const pdf_1 = await pdf;
  // get all pages text
  const maxPages = pdf_1._pdfInfo.numPages;
  const countPromises = []; // collecting all page promises
  for (let j = 1; j <= maxPages; j++) {
    const page = pdf_1.getPage(j);

    countPromises.push(
      page.then(async function (page_1) {
        // add page promise
        const textContent = page_1.getTextContent({
          includeMarkedContent: false,
        });
        const text = await textContent;
        return text.items
          .map(function (s) {
            return (s as TextItem).str;
          })
          .join("");
      })
    );
  }
  const texts = await Promise.all(countPromises);
  return texts.join("");
}
