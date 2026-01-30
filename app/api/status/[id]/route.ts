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
                'jacket-1': 'https://raw.githubusercontent.com/google/model-viewer/master/packages/shared-assets/models/Astronaut.glb',
                'bag-1': 'https://raw.githubusercontent.com/google/model-viewer/master/packages/shared-assets/models/Astronaut.glb',
                'car-1': 'https://raw.githubusercontent.com/google/model-viewer/master/packages/shared-assets/models/Astronaut.glb',
                'sofa-3': 'https://raw.githubusercontent.com/google/model-viewer/master/packages/shared-assets/models/NeilArmstrong.glb',
                'sofa-2': 'https://raw.githubusercontent.com/google/model-viewer/master/packages/shared-assets/models/NeilArmstrong.glb',
                'sofa-1': 'https://raw.githubusercontent.com/google/model-viewer/master/packages/shared-assets/models/NeilArmstrong.glb',
                'shoe-1': 'https://raw.githubusercontent.com/google/model-viewer/master/packages/shared-assets/models/Astronaut.glb',
                'fridge-1': 'https://raw.githubusercontent.com/google/model-viewer/master/packages/shared-assets/models/Astronaut.glb'
            };

            return NextResponse.json({
                Status: 'SUCCESS',
                ResultUrl: demoModels[demoId] || demoModels['sofa-3'],
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
