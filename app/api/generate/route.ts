import { NextResponse } from 'next/server';
import { submitImageTo3D } from '@/lib/hunyuan';
import { v4 as uuidv4 } from 'uuid';

// In a real app, you would use a proper DB and S3/COS storage.
// For this phase, we assume the images are already uploaded elsewhere 
// or sent as base64/signed URLs.
export async function POST(req: Request) {
    try {
        const { images, mode } = await req.json();

        if (!images || images.length === 0) {
            return NextResponse.json({ error: 'No images provided' }, { status: 400 });
        }

        let input: any;

        if (images.length === 1) {
            // Single view or simple array: handle accordingly
            const img = images[0];
            if (typeof img === 'string') {
                input = img;
            } else {
                // Already a structured object
                input = [img];
            }
        } else {
            // Multi-view: check if input is already structured objects
            if (typeof images[0] === 'object' && images[0].ViewType) {
                input = images;
            } else {
                // Legacy fallback for raw string arrays
                const viewOrder: any[] = ['front', 'back', 'left', 'right', 'top', 'bottom'];
                input = images.map((img: string, index: number) => ({
                    ViewType: viewOrder[index] || 'back',
                    ViewImageBase64: img.split(',')[1] || img
                }));
            }
        }

        const isPro = mode === 'pro';
        const jobId = await submitImageTo3D(input, isPro);

        // TRIGGER ASYNC WEBHOOK PROCESS
        // We call our internal webhook route in the background (no await)
        // to start the polling and notification flow.
        const origin = req.headers.get('origin') || 'http://localhost:3000';
        fetch(`${origin}/api/webhook`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                jobId,
                mode,
                // In a real app, you'd pass a real callbackUrl here
                callbackUrl: `${origin}/api/webhook-callback`
            }),
        }).catch(err => console.error('Failed to trigger background webhook:', err));

        return NextResponse.json({
            jobId,
            status: 'processing',
            id: uuidv4() // Internal tracking ID
        });
    } catch (error: any) {
        console.error('Generation API error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
