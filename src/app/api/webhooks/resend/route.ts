import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Resend webhook payload structure
    const { type, data } = body;
    
    if (type === 'email.received') {
      // Handle received email
      console.log('Received email:', {
        from: data.from,
        to: data.to,
        subject: data.subject,
        html: data.html,
        text: data.text,
      });
      
      // Store in database, trigger notifications, etc.
      // Example: await db.emails.create({ data: { ...data } });
    }
    
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}