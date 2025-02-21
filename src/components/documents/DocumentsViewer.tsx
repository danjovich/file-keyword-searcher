import { type ReactElement } from "react";
import fetchRawDocumentAndApplyCallback from "../../app/utils/fetchRawDocumentAndApplyCallback";
import mammoth from "mammoth";
import XLSX from "xlsx";
import getTextFromPDF from "@/app/utils/getTextFromPDF";
import DocumentViewer from "./DocumentViewer";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import fileTypes from "@/config/fileTypes";

interface DocumentViewerProps {
  documents: {
    uri: string;
    type: string;
  }[];
}

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

export default function DocumentsViewer({
  documents,
}: DocumentViewerProps): ReactElement {
  // const [htmls, setHtmls] = useState<string[]>([]);
  // useEffect(() => {
  //   documents.forEach(({ uri, type }) => {
  //     console.log(type);
  //   });
  // }, [documents]);

  return (
    <>
      <Carousel className="w-full max-w-xs">
        <CarouselPrevious />
        <CarouselNext />
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
