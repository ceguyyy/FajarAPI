import { Request, Response } from 'express';
import { mapDeliveryNote } from '../mappers/deliveryNoteMapper';
import { mapInvoiceTax } from '../mappers/invoiceTaxMapper';
import { mapPurchaseOrder } from '../mappers/purchaseOrderMapper';
import { mapInvoice } from '../mappers/invoiceMapper';
import { sendToSap } from '../services/sapService';

export const receiveDocument = async (req: Request, res: Response) => {
    try {
        // Some webhooks wrap the payload in a 'body' property
        let payload = req.body;
        if (payload.body) {
            // It could be double wrapped depending on the webhook provider
            payload = payload.body;
        }

        if (!payload || !payload.doc_type) {
            return res.status(400).json({ error: 'Missing doc_type in payload' });
        }

        const doc_type = payload.doc_type;
        // Sometimes the actual OCR data is nested inside 'data', sometimes it's at the root.
        // E.g., The payload shows: { "data": { "nomor_invoice": "..." }, "doc_type": "invoice" }
        const data = payload.data || payload;

        let bapiPayload: any;
        let bapiName: string;

        switch (doc_type) {
            case 'delivery_note':
                bapiName = 'BAPI_GOODSMVT_CREATE'; // Example BAPI
                bapiPayload = mapDeliveryNote(data);
                break;
            case 'invoice_tax':
                bapiName = 'BAPI_INCOMINGINVOICE_CREATE1'; // Updated as requested
                bapiPayload = mapInvoiceTax(data);
                break;
            case 'purchase_order':
                bapiName = 'BAPI_SALESORDER_CREATEFROMDAT2'; // Example BAPI
                bapiPayload = mapPurchaseOrder(data);
                break;
            case 'invoice':
                bapiName = 'BAPI_INCOMINGINVOICE_CREATE1'; // Updated as requested
                bapiPayload = mapInvoice(data);
                break;
            default:
                return res.status(400).json({ error: `Unsupported doc_type: ${doc_type}` });
        }

        // Call SAP Service
        // const sapResponse = await sendToSap(bapiName, bapiPayload);

        return res.status(200).json({
            message: 'Document successfully processed and mapped',
            doc_type,
            bapiName,
            bapiPayload,
            // sapResponse
        });

    } catch (error) {
        console.error('Error processing document:', error);
        return res.status(500).json({ error: 'Internal Server Error', details: String(error) });
    }
};
