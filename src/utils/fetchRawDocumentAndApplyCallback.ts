/**
 * Fetches a raw document from a URI and applies a callback function to the retrieved ArrayBuffer.
 *
 * @param uri - The URI of the document to fetch
 * @param callback - A function that processes the ArrayBuffer and returns a value of type T
 * @returns A Promise that resolves to the result of the callback function
 * @typeParam T - The type of value returned by the callback function
 *
 * @example
 * ```typescript
 * const result = await fetchRawDocumentAndApplyCallback('https://example.com/file',
 *   (buffer) => processBuffer(buffer)
 * );
 * ```
 */
export default async function fetchRawDocumentAndApplyCallback<T>(
  uri: string,
  callback: (arrayBuffer: ArrayBuffer) => Promise<T> | T
): Promise<T> {
  const fetchedDocument = await fetch(uri);
  const arrayBuffer = await fetchedDocument.arrayBuffer();
  return await callback(arrayBuffer);
}
