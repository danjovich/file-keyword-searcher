import { type ReactElement } from "react";
import fetchRawDocumentAndApplyCallback from "../../utils/fetchRawDocumentAndApplyCallback";
import mammoth from "mammoth";
import XLSX from "xlsx";
import getTextFromPDF from "@/utils/getTextFromPDF";
import DocumentViewer from "./DocumentViewer";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import fileTypes from "@/config/fileTypes";
import { useDocuments } from "@/hooks/useDocuments";

const getDocumentFetcher = (
  mimetype: keyof typeof fileTypes.extensionMyMimetype
) => {
  const extension = fileTypes.extensionMyMimetype[mimetype];

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
          const html = XLSX.utils.sheet_to_html(wb.Sheets[wb.SheetNames[0]]);
          return html;
        });
    case ".pdf":
      return (uri: string) => getTextFromPDF(uri);
    case ".doc":
    default:
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      return async (_: string) => "";
  }
};

export default function DocumentsViewer(): ReactElement {
  const { documents } = useDocuments();

  return (
    <>
      <Carousel className="w-full" opts={{ dragFree: true, watchDrag: false }}>
        <div>
          <CarouselPrevious className="relative left-auto" />
          <CarouselNext className="relative left-auto" />
        </div>
        <CarouselContent>
          {documents.map((document) => (
            <CarouselItem key={document.uri}>
              <div className="p-1">
                <DocumentViewer
                  uri={document.uri}
                  getHtml={getDocumentFetcher(
                    document.type as keyof typeof fileTypes.extensionMyMimetype
                  )}
                  index={documents.indexOf(document)}
                  type={document.type}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      {/* {documents.map((document) => (
        <DocumentViewer
          key={document.uri}
          documentPromise={documentFetchers[
            document.type as keyof typeof documentFetchers
          ](document.uri)}
        />
      ))} */}
    </>
  );
}
