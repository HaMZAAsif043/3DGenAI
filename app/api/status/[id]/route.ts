import { NextResponse } from 'next/server';
import { queryJobStatus } from '@/lib/hunyuan';

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const jobId = params.id;
        if (!jobId) {
            return NextResponse.json({ error: 'Job ID missing' }, { status: 400 });
        }

        const status = await queryJobStatus(jobId);

        return NextResponse.json(status);
    } catch (error: any) {
        console.error('Status check error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
