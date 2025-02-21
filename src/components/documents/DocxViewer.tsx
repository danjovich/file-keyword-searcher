"use client";

import { use, type ReactElement } from "react";

interface DocxViewerProps {
  documentPromise: Promise<{
    value: string;
    messages: {
      type: string;
      message: string;
    }[];
  }>;
}

export default function DocxViewer({
  documentPromise,
}: DocxViewerProps): ReactElement {
  const document = use(documentPromise);

  for (const message of document.messages) {
    console.log(`[${message.type}]: ${message.message}`);
  }

  return (
    // although it isn't ideal to render raw HTML like this,
    // we assume that the HTML is safe to render since the user 
    // themselves uploaded the document
    <div dangerouslySetInnerHTML={{ __html: document.value }} />
  );
}
