import { queryJobStatus } from './lib/hunyuan';

async function check() {
    const jobId = '1409828222824128512';
    console.log(`Checking status for Job ID: ${jobId}`);
    try {
        const status = await queryJobStatus(jobId, true); // Assuming Pro based on the length/format
        console.log('Status Result:', JSON.stringify(status, null, 2));
    } catch (err) {
        console.error('Error checking status:', err);
    }
}

check();
