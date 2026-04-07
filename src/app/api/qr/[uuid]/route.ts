import QRCode from "qrcode";
import { NextResponse } from "next/server";
import { requireApiKey } from "@/lib/security";

function isValidHex(color: string | null): color is string {
  return !!color && /^([0-9a-fA-F]{6})$/.test(color);
}

export async function GET(
  _req: Request,
  context: { params: Promise<{ uuid: string }> }
) {

  // API KEY CHECK (prod only)
  const authError = requireApiKey(_req);
  if (authError) return authError;

  const { uuid } = await context.params;
  const { searchParams } = new URL(_req.url);
  const darkParam = searchParams.get("color");     // QR color
  const lightParam = searchParams.get("bg");       // background

  const dark = isValidHex(darkParam) ? `#${darkParam}` : "#231123";
  const light = isValidHex(lightParam) ? `#${lightParam}` : "#CCFF66";

  const format     = searchParams.get('format')

  try {
    if (format === 'png') {
      const png = await QRCode.toBuffer(uuid, {
        type: 'png',
        errorCorrectionLevel: 'H',
        margin: 1,
        width: 1200,
        color: { dark, light },
      })

      return new NextResponse(new Uint8Array(png), {
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'public, max-age=3600',
        },
      })
    } else {
      const svg = await QRCode.toString(uuid, {
        type: "svg",
        errorCorrectionLevel: "H",
        margin: 1,
        // width: 300,
        color: {
          dark,
          light
          // dark: "#231123",  // QR code color
          // dark: "#CCFF66",  // QR code color
          // light: "#c30f45", // Transparent background
          // light: "#2EC4B6", // Transparent background
          // light: "#CCFF66", // Transparent background
        },
      });
      
      return new NextResponse(svg, {
        headers: {
          "Content-Type": "image/svg+xml; charset=utf-8",
          "Cache-Control": "public, max-age=3600",
        },
      });
    }

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate QR code' },
      { status: 500 }
    );
  }
}
