import { getTencentAuthHeaders } from './tencent-auth';

const SECRET_ID = process.env.TENCENT_SECRET_ID || '';
const SECRET_KEY = process.env.TENCENT_SECRET_KEY || '';
const REGION = "ap-singapore";
const SERVICE = "hunyuan";
const VERSION = "2023-09-01";
const HOST = "hunyuan.intl.tencentcloudapi.com";

export interface HunyuanJobResponse {
    JobId: string;
    Status: 'IDLE' | 'RUNNING' | 'SUCCESS' | 'FAILED' | 'WAIT' | 'RUN' | 'DONE' | string;
    ResultUrl?: string;
    ErrorMsg?: string;
}

export interface MultiViewImage {
    ViewType: 'left' | 'right' | 'back' | 'top' | 'bottom' | 'left_front' | 'right_front';
    ViewImageBase64?: string;
    ViewImageUrl?: string;
}

export async function submitImageTo3D(
    input: string | MultiViewImage[],
    isPro: boolean = false
) {
    const action = isPro ? "SubmitHunyuanTo3DProJob" : "SubmitHunyuanTo3DRapidJob";

    let payload: any = {};

    if (Array.isArray(input)) {
        // Multi-view mode: The first image is the main/front image
        const mainImage = input[0];
        if (mainImage.ViewImageBase64) {
            payload.ImageBase64 = mainImage.ViewImageBase64.split(',')[1] || mainImage.ViewImageBase64;
        } else if (mainImage.ViewImageUrl) {
            payload.ImageUrl = mainImage.ViewImageUrl;
        }

        // Additional views go into MultiViewImages array
        // Note: The Pro API documentation specifies MultiViewImages as a parameter
        if (input.length > 1) {
            payload.MultiViewImages = input.slice(1).map(view => ({
                ViewType: view.ViewType,
                ViewImageBase64: view.ViewImageBase64?.split(',')[1] || view.ViewImageBase64,
                ViewImageUrl: view.ViewImageUrl
            }));
        }
    } else if (input.startsWith('data:image')) {
        payload.ImageBase64 = input.split(',')[1] || input;
    } else {
        payload.ImageUrl = input;
    }

    // Default to Model 3.0 or 3.1 based on isPro or specific requirements
    // For Pro, we can optionally specify Model: "3.1"
    if (isPro) {
        payload.Model = "3.1";
        payload.EnablePBR = true; // High fidelity
        payload.FaceCount = 80000;
        payload.GenerateType = "LowPoly";
        payload.PolygonType = "triangle";
    }

    const headers = getTencentAuthHeaders({
        secretId: SECRET_ID,
        secretKey: SECRET_KEY,
        service: SERVICE,
        version: VERSION,
        action: action,
        region: REGION,
        payload,
        host: HOST
    });

    try {
        console.log(`Submitting direct fetch to international ${SERVICE} (${action}) in ${REGION}...`);
        const response = await fetch(`https://${HOST}`, {
            method: 'POST',
            headers: headers as any,
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (data.Response.Error) {
            throw new Error(`${data.Response.Error.Code}: ${data.Response.Error.Message}`);
        }

        return data.Response.JobId;
    } catch (err) {
        console.error("Hunyuan3D direct API submission error:", err);
        throw err;
    }
}

export async function queryJobStatus(jobId: string, isPro: boolean = false): Promise<HunyuanJobResponse> {
    const action = isPro ? "QueryHunyuanTo3DProJob" : "QueryHunyuanTo3DRapidJob";
    const payload = { JobId: jobId };

    const headers = getTencentAuthHeaders({
        secretId: SECRET_ID,
        secretKey: SECRET_KEY,
        service: SERVICE,
        version: VERSION,
        action: action,
        region: REGION,
        payload,
        host: HOST
    });

    try {
        const response = await fetch(`https://${HOST}`, {
            method: 'POST',
            headers: headers as any,
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (data.Response.Error) {
            throw new Error(`${data.Response.Error.Code}: ${data.Response.Error.Message}`);
        }

        const res = data.Response;

        // Map Tencent statuses to frontend statuses
        let normalizedStatus = res.Status;
        if (res.Status === 'DONE') normalizedStatus = 'SUCCESS';
        if (res.Status === 'FAIL') normalizedStatus = 'FAILED';
        if (res.Status === 'RUN') normalizedStatus = 'RUNNING';
        if (res.Status === 'WAIT') normalizedStatus = 'WAIT';

        // Find the best 3D model URL (prefer non-GIF)
        let resultUrl = undefined;
        if (res.ResultFile3Ds && res.ResultFile3Ds.length > 0) {
            // Prioritize GLB, then OBJ/ZIP
            const modelFile =
                res.ResultFile3Ds.find((f: any) => f.Type === 'GLB') ||
                res.ResultFile3Ds.find((f: any) => f.Type === 'OBJ' || f.Type === 'ZIP') ||
                res.ResultFile3Ds.find((f: any) => f.Type !== 'GIF') ||
                res.ResultFile3Ds[0];

            // Wrap in our CORS proxy
            if (modelFile.Url) {
                resultUrl = `/api/model-proxy?url=${encodeURIComponent(modelFile.Url)}`;
            }
        }

        return {
            JobId: jobId,
            Status: normalizedStatus,
            ResultUrl: resultUrl,
            ErrorMsg: res.ErrorMessage || res.ErrorCode
        };
    } catch (err) {
        console.error("Hunyuan3D direct API status query error:", err);
        throw err;
    }
}
