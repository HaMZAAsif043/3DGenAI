import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get('url');

    if (!url) {
        return new Response('Missing URL', { status: 400 });
    }

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch from source: ${response.statusText} (${response.status})`);
        }

        // Create a new response with the body stream
        const headers = new Headers();

        // Pass through essential headers
        const contentType = response.headers.get('Content-Type');
        const contentLength = response.headers.get('Content-Length');

        if (contentType) headers.set('Content-Type', contentType);
        if (contentLength) headers.set('Content-Length', contentLength);

        headers.set('Access-Control-Allow-Origin', '*');
        headers.set('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour

        const filename = url.split('/').pop()?.split('?')[0] || 'model.glb';
        headers.set('Content-Disposition', `inline; filename="${filename}"`);

        return new Response(response.body, {
            status: 200,
            headers
        });
    } catch (error: any) {
        console.error('Proxy Error:', error);
        return NextResponse.json({ error: `Proxy error: ${error.message}` }, { status: 500 });
    }
}
