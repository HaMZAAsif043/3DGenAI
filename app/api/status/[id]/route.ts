import { NextResponse } from 'next/server';
import { queryJobStatus } from '@/lib/hunyuan';

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: jobId } = await params;
        if (!jobId) {
            return NextResponse.json({ error: 'Job ID missing' }, { status: 400 });
        }

        // Handle Demo Jobs
        if (jobId.startsWith('demo-')) {
            const demoId = jobId.replace('demo-', '');
            // Simple mapping for demo models
            const demoModels: Record<string, string> = {
                'jacket-1': 'https://iteijaqdlduvfybamemk.supabase.co/storage/v1/object/public/3D%20assets/jacket.glb'
            };

            return NextResponse.json({
                Status: 'SUCCESS',
                ResultUrl: demoModels[demoId] || demoModels['jacket-1'],
                Progress: 100
            });
        }

        const { searchParams } = new URL(req.url);
        const isPro = searchParams.get('mode') === 'pro';
        const status = await queryJobStatus(jobId, isPro);

        return NextResponse.json(status);
    } catch (error: any) {
        console.error('Status check error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
