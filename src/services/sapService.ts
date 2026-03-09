// import { Client } from 'node-rfc';

// Using a mock client since node-rfc requires specific C++ bindings and SAP SDK
export const sendToSap = async (bapiName: string, payload: any) => {
    try {
        console.log(`[SAP MOCK] Calling BAPI: ${bapiName} with payload:`, JSON.stringify(payload, null, 2));

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // For now, simulate a successful response
        const result = {
            RETURN: [
                { TYPE: 'S', MESSAGE: 'Mapping successful, simulated SAP call.' }
            ]
        };

        console.log('[SAP MOCK] Result:', result);
        return result;
    } catch (error) {
        console.error('Error calling SAP BAPI', error);
        throw error;
    }
};
