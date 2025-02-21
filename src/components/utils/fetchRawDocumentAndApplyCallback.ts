export default async function fetchRawDocumentAndApplyCallback<T>(
  uri: string,
  callback: (arrayBuffer: ArrayBuffer) => Promise<T> | T
): Promise<T> {
  const fetchedDocument = await fetch(uri);
  const arrayBuffer = await fetchedDocument.arrayBuffer();
  console.log(arrayBuffer);

  return callback(arrayBuffer);
}
