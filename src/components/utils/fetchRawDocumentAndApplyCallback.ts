export default function fetchRawDocumentAndApplyCallback<T>(
  uri: string,
  callback: (arrayBuffer: ArrayBuffer) => Promise<T> | T
): Promise<T> {
  return fetch(uri)
    .then(fetchedDocument => fetchedDocument.arrayBuffer())
    .then(arrayBuffer => {
      console.log(arrayBuffer);
      return callback(arrayBuffer);
    });
}
