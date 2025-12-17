import { generateCryptoToken } from '@/app/utils/cryptoToken';
import { randomUUID } from 'crypto';
import { NextRequest } from 'next/server';

// GET /api/random/uuid
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type'); // e.g., /api/random?type=uuid

  switch (type) {
    case 'uuid':
      return Response.json({ uuid: randomUUID() });
    case 'float':
      return Response.json({ float: Math.random() });
    case 'token':
      const token = generateCryptoToken("TICKET-12345");
      return Response.json({ token: token, generatedAt: new Date(Date.now()).toString() });
    default:
      return Response.json({
        message: 'Random API',
        endpoints: ['/api/random?type=uuid', '/api/random?type=float', '/api/random?type=token']
      });
  }
}

// legacy code
// Using the uuid package (most common)
// This works everywhere and is the most popular choice:
// npm install uuid

// export async function GET() {
//   'use server'
//   const id = randomUUID();
//   return Response.json({
//     UUID: id,
//   })
// }

// export async function GET() {
//   return Response.json({
//     randomNumber: Math.random(),
//   })
// }