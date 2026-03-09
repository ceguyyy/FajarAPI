export const sendToSap = async (bapiName: string, payload: any) => {
    try {
        const useRfc = process.env.USE_SAP_RFC === 'true';

        if (useRfc) {
            console.log(`[SAP RFC CLIENT] Connecting to SAP for BAPI: ${bapiName}`);

            // Dynamically import node-rfc so it doesn't break Vercel when missing
            const { Client } = require('node-rfc');

            const connectionParams = {
                ashost: process.env.SAP_ASHOST || '192.168.1.100',
                sysnr: process.env.SAP_SYSNR || '00',
                client: process.env.SAP_CLIENT || '100',
                user: process.env.SAP_USER || 'RFC_USER',
                passwd: process.env.SAP_PASSWORD || 'password'
            };

            const client = new Client(connectionParams);
            await client.open();
            console.log(`[SAP RFC CLIENT] Connected successfully.`);

            console.log(`[SAP RFC CLIENT] Executing ${bapiName}...`);
            const result = await client.call(bapiName, payload);
            console.log('[SAP RFC CLIENT] Result received from SAP.');

            await client.close();
            return result;

        } else {
            console.log(`[SAP HTTP CLIENT] Calling BAPI Endpoint: ${bapiName}`);

            const sapHost = process.env.SAP_ASHOST || 'http://localhost:8000';
            const endpointUrl = `${sapHost}/sap/opu/odata/sap/Z_OCR_INTEGRATION_SRV/ImportDocument`;

            const username = process.env.SAP_USER || '';
            const password = process.env.SAP_PASSWORD || '';
            const authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;

            console.log(`[SAP HTTP CLIENT] POST to: ${endpointUrl}`);

            const wrappedPayload = {
                bapi_name: bapiName,
                data: payload
            };

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
        }

    } catch (error: any) {
        console.error('Error in SAP integration:', error.message || error);

        return {
            sapError: true,
            status: "Failed to connect to SAP",
            details: error.message || String(error),
            attemptedMode: process.env.USE_SAP_RFC === 'true' ? 'RFC' : 'HTTP_REST'
        };
    }
};
