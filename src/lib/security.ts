import { NextResponse } from "next/server";

export function requireApiKey(request: Request) {
  if (process.env.API_KEY_PROTECTION !== "true") {
    return null;
  }

  const apiKey = request.headers.get("x-api-key");

  if (!apiKey || apiKey !== process.env.API_INTERNAL_KEY) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  return null;
}
