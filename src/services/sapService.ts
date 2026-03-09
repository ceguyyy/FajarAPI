export const sendToSap = async (bapiName: string, payload: any) => {
    try {
        console.log(`[SAP HTTP CLIENT] Calling BAPI Endpoint: ${bapiName}`);

        // Construct SAP Gateway URL
        const sapHost = process.env.SAP_ASHOST || 'http://localhost:8000';

        let endpointUrl = '';
        if (bapiName === 'BAPI_INCOMINGINVOICE_CREATE1') {
            endpointUrl = `${sapHost}/sap/opu/odata/sap/z_bapi_invoice`; // Example given by user
        } else {
            // Default dynamic route
            endpointUrl = `${sapHost}/sap/opu/odata/sap/Z_OCR_INTEGRATION_SRV/${bapiName}`;
        }

        const username = process.env.SAP_USER || '';
        const password = process.env.SAP_PASSWORD || '';

        // Create Basic Auth header
        const authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;

        console.log(`[SAP HTTP CLIENT] POST to: ${endpointUrl}`);

        // Execute HTTP REST/OData call to SAP Gateway
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

    } catch (error) {
        console.error('Error calling SAP REST endpoint', error);
        throw error;
    }
};
