import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const data = await req.json();
        console.log(`[Webhook-Callback] Received notification:`, data);

        // This is where you would update a database or push a notification to a socket.

        return NextResponse.json({ received: true });
    } catch (error: any) {
        console.error('Webhook Callback Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
