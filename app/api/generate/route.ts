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

        // Process the first image for single mode (simplification for MVP)
        const primaryImage = images[0];

        // In production, you'd upload the local image to a cloud bucket (COS/S3) 
        // and pass the URL to Hunyuan3D.
        const jobId = await submitImageTo3D(primaryImage, mode === 'pro');

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
