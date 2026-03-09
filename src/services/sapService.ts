import { Client } from 'node-rfc';

export const sendToSap = async (bapiName: string, payload: any) => {
    try {
        console.log(`[SAP RFC CLIENT] Connecting to SAP for BAPI: ${bapiName}`);

        // Construct SAP connection parameters from environment variables
        const connectionParams = {
            ashost: process.env.SAP_ASHOST || '192.168.1.100',
            sysnr: process.env.SAP_SYSNR || '00',
            client: process.env.SAP_CLIENT || '100',
            user: process.env.SAP_USER || 'RFC_USER',
            passwd: process.env.SAP_PASSWORD || 'password'
        };

        // Initialize SAP RFC Client
        const client = new Client(connectionParams);

        // Open connection to SAP ECC
        await client.open();
        console.log(`[SAP RFC CLIENT] Connected successfully.`);

        console.log(`[SAP RFC CLIENT] Executing ${bapiName}...`);

        // Execute the BAPI function in SAP
        const result = await client.call(bapiName, payload);

        console.log('[SAP RFC CLIENT] Result received from SAP.');

        // Close the connection
        await client.close();

        return result;

    } catch (error: any) {
        console.error('Error executing SAP RFC:', error.message || error);

        // Return a clean error object instead of throwing so documentController can render it
        return {
            sapError: true,
            status: "Failed to connect to SAP via RFC",
            details: error.message || String(error)
        };
    }
};
