import { useEffect, useMemo, useState, type ReactElement } from "react";
import fetchRawDocumentAndApplyCallback from "../../utils/fetchRawDocumentAndApplyCallback";
import mammoth from "mammoth";
import XLSX from "xlsx";
import getTextFromPDF from "@/utils/getTextFromPDF";
import DocumentViewer from "./DocumentViewer";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { useDocuments } from "@/hooks/useDocuments";
import doc2docx from "@/utils/doc2docx";
import { extensionsByMimetype, FileMimeType } from "@/config/fileTypes";

const getDocumentFetcher = (
  mimetype: FileMimeType
): ((uri: string) => Promise<string>) => {
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
          const html = XLSX.utils.sheet_to_html(wb.Sheets[wb.SheetNames[0]]);
          return html;
        });
    case ".pdf":
      return (uri: string) => getTextFromPDF(uri);
    case ".doc":
      return async (uri: string): Promise<string> => {
        const docxUrl = await doc2docx(uri);
        return await getDocumentFetcher(FileMimeType.DOCX)(docxUrl);
      };
    default:
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      return async (_: string) => "";
  }
};

export default function DocumentsViewer(): ReactElement {
  const { documents } = useDocuments();

  // carousel api
  const [api, setApi] = useState<CarouselApi | undefined>();
  // current selected document index (1-indexed)
  const [current, setCurrent] = useState(1);

  const currentDocumentName = useMemo(
    () => documents[current - 1]?.name,
    [documents, current]
  );

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  if (documents.length === 0) {
    return (
      <p className="w-full text-center">Upload a document to get started!</p>
    );
  }

  return (
    <div className="flex items-center justify-center w-full">
      <Carousel
        className="w-full relative"
        opts={{ dragFree: true, watchDrag: false }}
        setApi={setApi}
      >
        <div className="flex justify-between items-center w-full">
          <div>
            <CarouselPrevious className="relative left-auto" />
            <CarouselNext className="relative left-auto" />
          </div>
          <div className="text-center -mt-5">
            <h2 className="text-xl font-bold">{currentDocumentName}</h2>
            <p className="text-sm text-gray-600">
              Document <b>{current}</b> out of <b>{documents.length}</b>
            </p>
          </div>
          {/* Only for centering the title and document index */}
          <div />
        </div>
        <CarouselContent>
          {documents.map((document) => (
            <CarouselItem key={document.uri + document.content} className="p-6">
              <div className="p-3 border-[1px] border-slate-700 rounded-md">
                <DocumentViewer
                  uri={document.uri}
                  getHtml={getDocumentFetcher(document.type as FileMimeType)}
                  index={documents.indexOf(document)}
                  type={document.type}
                  name={document.name}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
