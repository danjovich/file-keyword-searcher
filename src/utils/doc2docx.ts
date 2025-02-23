export default async function doc2docx(uri: string): Promise<string> {
  const res = await fetch("/api/doc2docx", {
    method: "POST",
    body: JSON.stringify({ uri }),
  });

  if (!res.ok) {
    throw new Error("Failed to convert document");
  }

  const { url } = await res.json();

  return url;
}
