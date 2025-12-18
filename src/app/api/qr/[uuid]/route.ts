import QRCode from "qrcode";
import { NextResponse } from "next/server";
import { Metadata } from "next";

export async function GET(
  _req: Request,
  context: { params: Promise<{ uuid: string }> }
) {
  const { uuid } = await context.params;

  try {
      const svg = await QRCode.toString(uuid, {
        type: "svg",
        errorCorrectionLevel: "H",
        margin: 1,
        // width: 300,
        color: {
          dark: "#231123",  // QR code color
          light: "#c30f45", // Transparent background
        },    
      });
    
      return new NextResponse(svg, {
        headers: {
          "Content-Type": "image/svg+xml; charset=utf-8",
          "Cache-Control": "public, max-age=3600",
        },
      });
  } catch (error) {
        return NextResponse.json(
        { error: 'Failed to generate QR code' },
        { status: 500 }
    );
  }
}
