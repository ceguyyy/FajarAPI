export const sendToSap = async (bapiName: string, payload: any) => {
    try {
        console.log(`[SAP HTTP CLIENT] Calling BAPI Endpoint: ${bapiName}`);

        // Construct SAP Gateway URL
        const sapHost = process.env.SAP_ASHOST || 'http://localhost:8000';

        let endpointUrl = `${sapHost}/sap/opu/odata/sap/Z_OCR_INTEGRATION_SRV/ImportDocument`;

        const username = process.env.SAP_USER || '';
        const password = process.env.SAP_PASSWORD || '';

        // Create Basic Auth header
        const authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;

        console.log(`[SAP HTTP CLIENT] POST to: ${endpointUrl}`);

        // Wrap the payload with the target BAPI name so the single SAP endpoint knows what to do
        const wrappedPayload = {
            bapi_name: bapiName,
            data: payload
        };

        // Execute HTTP REST/OData call to SAP Gateway
        const response = await fetch(endpointUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': authHeader
            },
            body: JSON.stringify(wrappedPayload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`SAP HTTP Error ${response.status}: ${errorText}`);
        }

        const result = await response.json();
        console.log('[SAP HTTP CLIENT] Result:', result);
        return result;

    } catch (error: any) {
        console.error('Error calling SAP REST endpoint:', error.message || error);

        // Return a clean error object instead of throwing so documentController can render it
        return {
            sapError: true,
            status: "Failed to connect to SAP Gateway",
            details: error.message || String(error),
            attemptedEndpoint: `${process.env.SAP_ASHOST || 'http://localhost'}/sap/opu/odata/sap/Z_OCR_INTEGRATION_SRV/ImportDocument`
        };
    }
};
