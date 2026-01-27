import * as tencentcloud from 'tencentcloud-sdk-nodejs';

const Hunyuan3DClient = tencentcloud.hunyuan.v20230901.Client;

const clientConfig = {
    credential: {
        secretId: process.env.TENCENT_SECRET_ID,
        secretKey: process.env.TENCENT_SECRET_KEY,
    },
    region: "ap-guangzhou", // Default to Guangzhou as it usually has AI services
    profile: {
        httpProfile: {
            endpoint: "hunyuan.tencentcloudapi.com",
        },
    },
};

const client = new Hunyuan3DClient(clientConfig);

export interface HunyuanJobResponse {
    JobId: string;
    Status: 'IDLE' | 'RUNNING' | 'SUCCESS' | 'FAILED';
    ResultUrl?: string;
    ErrorMsg?: string;
}

export async function submitImageTo3D(imageUrl: string, isPro: boolean = false) {
    try {
        const params = {
            ImageUrl: imageUrl,
            // Pro models usually offer better quality for common objects
            ModelResolution: isPro ? "high" : "medium",
        };

        // Note: Actual method names might vary slightly based on specific SDK version.
        // We use SubmitHunyuanTo3DProJob or SubmitHunyuanTo3DJob as per docs.
        const result = await client.SubmitHunyuanTo3DProJob(params);
        return result.JobId;
    } catch (err) {
        console.error("Hunyuan3D submission error:", err);
        throw err;
    }
}

export async function queryJobStatus(jobId: string): Promise<HunyuanJobResponse> {
    try {
        const params = { JobId: jobId };
        const result = await client.QueryHunyuanTo3DProJob(params);

        return {
            JobId: result.JobId,
            Status: result.Status as any,
            ResultUrl: result.ResultUrl,
            ErrorMsg: result.ErrorMsg
        };
    } catch (err) {
        const error = err as Error;
        console.error("Hunyuan3D status query error:", error);
        throw error;
    }
}
