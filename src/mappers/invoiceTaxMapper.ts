export const mapInvoiceTax = (data: any) => {
    // Structure resembles Delivery Note but categorized as Invoice Tax
    const {
        nomor_surat_jalan, // might correspond to invoice number in this context
        tanggal_kirim,
        customer_name,
        detail_barang = [],
    } = data;

    const bapiHeader = {
        INVOICE_IND: 'X',
        DOC_DATE: new Date().toISOString().split('T')[0].replace(/-/g, ''),
        PSTNG_DATE: new Date().toISOString().split('T')[0].replace(/-/g, ''),
        REF_DOC_NO: nomor_surat_jalan?.substring(0, 16) || '',
        COMP_CODE: '1000', // Example company code
        GROSS_AMOUNT: 0, // Would normally need to sum up or take from OCR
        CALC_TAX_IND: 'X',
        CURRENCY: 'IDR' // Default currency
    };

    const bapiItems = detail_barang.map((item: any, index: number) => ({
        INVOICE_DOC_ITEM: (index + 1).toString().padStart(6, '0'),
        ITEM_TEXT: item.description?.substring(0, 50) || '',
        QUANTITY: parseFloat(item.qty) || 0,
        PO_UNIT: item.unit || 'EA'
    }));

    return {
        HEADERDATA: bapiHeader,
        ITEMDATA: bapiItems,
        INVOICESTATUS: '5' // 5 = Invoice is posted
    };
};
