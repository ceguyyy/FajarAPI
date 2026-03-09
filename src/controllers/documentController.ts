import { Request, Response } from 'express';
import { mapDeliveryNote } from '../mappers/deliveryNoteMapper';
import { mapInvoiceTax } from '../mappers/invoiceTaxMapper';
import { mapPurchaseOrder } from '../mappers/purchaseOrderMapper';
import { mapInvoice } from '../mappers/invoiceMapper';
import { sendToSap } from '../services/sapService';

export const receiveDocument = async (req: Request, res: Response) => {
    try {
        let payload: any;

        // Sometimes Vercel passes unparsed bodies as raw Buffers if the Content-Type is missing
        if (Buffer.isBuffer(req.body)) {
            try {
                payload = JSON.parse(req.body.toString('utf8'));
            } catch (e) {
                payload = req.body.toString('utf8');
            }
        }
        // If it's a string, try to parse it
        else if (typeof req.body === 'string') {
            try {
                payload = JSON.parse(req.body);
            } catch (e) {
                payload = req.body;
            }
        }
        else {
            payload = req.body;
        }

        // If webhooks send { body_raw: "{\"data\":...}" }
        if (payload?.body_raw && typeof payload.body_raw === 'string') {
            try {
                payload = JSON.parse(payload.body_raw);
            } catch (e) {
                console.error("Failed to parse body_raw", e);
            }
        }
        // If webhooks send { body: "{\"data\":...}" }
        else if (payload?.body && typeof payload.body === 'string') {
            try {
                payload = JSON.parse(payload.body);
            } catch (e) {
                console.error("Failed to parse body string", e);
            }
        }
        // If webhooks send { body: { data: ... } }
        else if (payload?.body && typeof payload.body === 'object') {
            payload = payload.body;
        }

        if (!payload || !payload.doc_type) {
            return res.status(400).json({
                error: 'Missing doc_type in payload',
                received_body_type: typeof req.body,
                received_body_keys: req.body ? Object.keys(req.body) : [],
                received_payload_keys: payload ? Object.keys(payload) : [],
                raw_body_excerpt: JSON.stringify(req.body || {}).substring(0, 500)
            });
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
