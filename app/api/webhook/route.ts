import { NextResponse } from 'next/server';
import { queryJobStatus } from '@/lib/hunyuan';

export async function POST(req: Request) {
    try {
        const { jobId, mode, callbackUrl } = await req.json();

        if (!jobId) {
            return NextResponse.json({ error: 'Missing jobId' }, { status: 400 });
        }

        console.log(`[Webhook] Received async trigger for job ${jobId}`);

        // Start a background process to monitor and report
        // Note: In a real production environment, this should be a background worker (Redis/BullMQ)
        // For this demo, we use a simple async interval on the server.

        const isPro = mode === 'pro';

        // This is a "simulated" webhook runner
        const checkStatus = async () => {
            let attempts = 0;
            const maxAttempts = 60; // 5 minutes max (5s * 60)

            const interval = setInterval(async () => {
                attempts++;
                try {
                    const status = await queryJobStatus(jobId, isPro);

                    if (status.Status === 'SUCCESS' || status.Status === 'FAILED') {
                        clearInterval(interval);

                        console.log(`[Webhook] Job ${jobId} completed with status ${status.Status}`);

                        // If a callback URL was provided, notify it
                        if (callbackUrl) {
                            try {
                                await fetch(callbackUrl, {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify(status)
                                });
                                console.log(`[Webhook] Successfully notified callbackUrl for job ${jobId}`);
                            } catch (error) {
                                console.error(`[Webhook] Failed to notify callbackUrl:`, error);
                            }
                        }
                    }

                    if (attempts >= maxAttempts) {
                        clearInterval(interval);
                        console.log(`[Webhook] Job ${jobId} timed out`);
                    }
                } catch (error) {
                    console.error(`[Webhook] Error checking status for ${jobId}:`, error);
                }
            }, 5000);
        };

        checkStatus();

        return NextResponse.json({
            message: 'Webhook background processing started',
            jobId
        });
    } catch (error: any) {
        console.error('Webhook Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
