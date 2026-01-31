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

        let input: string | any[];

        if (images.length === 1) {
            // Single view: pass base64 directly
            input = images[0];
        } else {
            // Multi-view: format according to Hunyuan3D requirements
            // Defaulting views: [front (implied), back, left, right, top, bottom]
            const viewOrder: any[] = ['back', 'left', 'right', 'top', 'bottom'];
            input = images.slice(1).map((img: string, index: number) => ({
                ViewType: viewOrder[index] || 'back',
                ViewImageBase64: img.split(',')[1] || img
            }));

            // Note: The first image is usually the main/front image in Pro API 
            // but for MultiViewImages parameter, it expects specific views.
            // If the user provides 2 images, it's Front + Back.
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
