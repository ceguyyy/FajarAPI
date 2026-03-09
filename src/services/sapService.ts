export const sendToSap = async (bapiName: string, payload: any) => {
    try {
        console.log(`[SAP HTTP CLIENT] Calling BAPI Endpoint: ${bapiName}`);

        // Construct SAP Gateway URL from environment variables
        const sapHost = process.env.SAP_ASHOST || 'http://localhost:8000';
        // Assume standard SAP OData/REST path, though this may need to be tailored to the user's exact SAP Gateway configuration
        const endpointUrl = `${sapHost}/sap/opu/odata/sap/Z_OCR_INTEGRATION_SRV/${bapiName}`;

        const username = process.env.SAP_USER || '';
        const password = process.env.SAP_PASSWORD || '';

        // Create Basic Auth header
        const authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;

        console.log(`[SAP HTTP CLIENT] POST to: ${endpointUrl}`);

        // Uncomment the actual fetch call once SAP Gateway is open. For now, we will attempt the HTTP call and handle the inevitable fetch error if the URL is invalid.
        /*
        const response = await fetch(endpointUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': authHeader
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`SAP HTTP Error ${response.status}: ${errorText}`);
        }

        const result = await response.json();
        console.log('[SAP HTTP CLIENT] Result:', result);
        return result;
        */

        // --- MOCK RETURN FOR NOW UNTIL SAP URL IS CONFIRMED ---
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));

        const mockResult = {
            RETURN: [
                { TYPE: 'S', MESSAGE: `Prepared to send to ${endpointUrl}. Waiting for SAP Gateway URL to be confirmed.` }
            ]
        };
        console.log('[SAP HTTP CLIENT] Mock Result:', mockResult);
        return mockResult;

    } catch (error) {
        console.error('Error calling SAP REST endpoint', error);
        throw error;
    }
};
