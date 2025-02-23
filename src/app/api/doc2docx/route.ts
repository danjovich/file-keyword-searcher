import { NextResponse } from "next/server";
import ConvertApi from "convertapi";

export async function POST(request: Request): Promise<NextResponse> {
  const { uri } = (await request.json()) as { uri: string };

  if (!uri) {
    console.error(
      `Missing required uri parameter on request: ${JSON.stringify(request)}`
    );
    return NextResponse.json({ error: "uri is required" }, { status: 400 });
  }

  const apiKey = process.env.CONVERT_API_SECRET_KEY;

  if (!apiKey) {
    console.error(
      `Missing necessary environment variables on request: ${JSON.stringify(
        request
      )}`
    );
    return NextResponse.json(
      { error: "Missing necessary environment variables" },
      { status: 500 }
    );
  }

  try {
    const convertApi = new ConvertApi(apiKey);

    const result = await convertApi.convert("docx", {
      File: uri,
    });

    const url = result.file.url;

    return NextResponse.json({ url });
  } catch (error) {
    console.error(`Failed to convert document: ${error}`);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
