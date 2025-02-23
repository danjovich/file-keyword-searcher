import { useEffect, useMemo, useState, type ReactElement } from "react";
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

export default function DocumentsViewer(): ReactElement {
  const { documents, thereAreUploadedDocuments } = useDocuments();

  // carousel api
  const [api, setApi] = useState<CarouselApi | undefined>();
  // current selected document index (1-indexed)
  const [current, setCurrent] = useState(1);

  const currentDocumentName = useMemo(
    () => documents[current - 1]?.name,
    [documents, current]
  );

  // update current on carousel api change
  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  // reinitialize current index on documents length change
  useEffect(() => {
    if (api) {
      api.reInit();

      if (documents.length === 0) {
        setCurrent(0);
      } else {
        setCurrent(api.selectedScrollSnap() + 1);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documents.length]);

  if (!thereAreUploadedDocuments) {
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
        <div className="flex flex-col lg:flex-row justify-between items-center w-full">
          <div className="-ml-10 lg:ml-0">
            <CarouselPrevious className="relative left-auto" />
            <CarouselNext className="relative left-auto" />
          </div>
          <div className="text-center lg:-mt-5">
            <h2 className="text-xl font-bold">{currentDocumentName}</h2>
            <p className="text-sm text-gray-600">
              Document <b>{current}</b> out of <b>{documents.length}</b>
            </p>
          </div>
          {/* Only for centering the previous div */}
          <div />
        </div>
        <CarouselContent className="w-full">
          {documents.map((document) => (
            <CarouselItem key={document.uri} className="p-6 w-full">
              <div className="p-3 border-[1px] border-slate-700 rounded-md w-full">
                <DocumentViewer html={document.content} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
