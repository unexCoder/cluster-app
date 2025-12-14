import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Para manejar peticiones GET
export async function GET(request: NextRequest) {

  // SEND EMAIL
  const resend = new Resend(process.env.RESEND_API_KEY);
  resend.emails.send({
    from: 'onboarding@resend.dev',
    to: 'bosca.music@gmail.com',
    subject: 'Hello Cluster!',
    html: '<p>Bienvenido a la plataforma de <strong>Festival Cluster</strong>!</p>'
  });

  // SEND SMS
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const client = require('twilio')(accountSid, authToken);
  client.messages
    .create({
      body: 'Hello Cluster!',
      from: '+13305764338',
      to: '+543416709854'
    })
    .then((message: any) => console.log(message.sid));

  return NextResponse.json({
    mensaje: "¡Hola desde la API!",
    timestamp: new Date().toISOString()
  });
}

// Para manejar peticiones POST
export async function POST(request: NextRequest) {
  const body = await request.json();

  return NextResponse.json({
    recibido: body,
    mensaje: "Datos procesados correctamente"
  });
}