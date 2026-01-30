import crypto from 'crypto';

interface AuthParams {
    secretId: string;
    secretKey: string;
    service: string;
    version: string;
    action: string;
    region: string;
    payload: any;
    host?: string; // Optional custom host
    timestamp?: number;
}

export function getTencentAuthHeaders({
    secretId,
    secretKey,
    service,
    version,
    action,
    region,
    payload,
    host: customHost,
    timestamp = Math.floor(Date.now() / 1000)
}: AuthParams) {
    const host = customHost || `${service}.tencentcloudapi.com`;
    const contentType = "application/json; charset=utf-8";
    const date = new Date(timestamp * 1000).toISOString().split('T')[0];

    // 1. Canonical Request
    const httpRequestMethod = "POST";
    const canonicalUri = "/";
    const canonicalQueryString = "";
    const canonicalHeaders = `content-type:${contentType}\nhost:${host}\nx-tc-action:${action.toLowerCase()}\n`;
    const signedHeaders = "content-type;host;x-tc-action";

    const hashedPayload = crypto.createHash("sha256").update(JSON.stringify(payload)).digest("hex");
    const canonicalRequest = `${httpRequestMethod}\n${canonicalUri}\n${canonicalQueryString}\n${canonicalHeaders}\n${signedHeaders}\n${hashedPayload}`;

    // 2. String to Sign
    const algorithm = "TC3-HMAC-SHA256";
    const credentialScope = `${date}/${service}/tc3_request`;
    const hashedCanonicalRequest = crypto.createHash("sha256").update(canonicalRequest).digest("hex");
    const stringToSign = `${algorithm}\n${timestamp}\n${credentialScope}\n${hashedCanonicalRequest}`;

    // 3. Calculate Signature
    const kDate = crypto.createHmac("sha256", `TC3${secretKey}`).update(date).digest();
    const kService = crypto.createHmac("sha256", kDate).update(service).digest();
    const kSigning = crypto.createHmac("sha256", kService).update("tc3_request").digest();
    const signature = crypto.createHmac("sha256", kSigning).update(stringToSign).digest("hex");

    // 4. Final Headers
    const authorization = `${algorithm} Credential=${secretId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

    return {
        "Authorization": authorization,
        "Content-Type": contentType,
        "Host": host,
        "X-TC-Action": action,
        "X-TC-Version": version,
        "X-TC-Timestamp": timestamp.toString(),
        "X-TC-Region": region,
    };
}
