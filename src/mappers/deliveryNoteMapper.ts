export const mapDeliveryNote = (data: any) => {
    // Map delivery note JSON to BAPI_GOODSMVT_CREATE or equivalent
    const {
        nomor_surat_jalan,
        tanggal_kirim,
        customer_name,
        company_id,
        detail_barang = [],
        no_polisi,
        kendaraan,
        sopir,
        tempat_kirim
    } = data;

    const bapiHeader = {
        PSTNG_DATE: new Date().toISOString().split('T')[0].replace(/-/g, ''), // YYYYMMDD
        DOC_DATE: tanggal_kirim ? formatDate(tanggal_kirim) : new Date().toISOString().split('T')[0].replace(/-/g, ''),
        REF_DOC_NO: nomor_surat_jalan?.substring(0, 16) || '', // BAPI limit
        HEADER_TXT: `Delivery from ${customer_name}`,
    };

    const bapiItems = detail_barang.map((item: any, index: number) => ({
        MATERIAL: '', // Need material mapping
        ENTRY_QNT: parseFloat(item.qty) || 0,
        ENTRY_UOM: item.unit || 'EA',
        ITEM_TEXT: item.description?.substring(0, 50) || '',
    }));

    return {
        GOODSMVT_HEADER: bapiHeader,
        GOODSMVT_CODE: { GM_CODE: '01' }, // MB01 - Goods Receipt for PO (example)
        GOODSMVT_ITEM: bapiItems
    };
};

// Helper function to format various date strings to YYYYMMDD
function formatDate(dateString: string): string {
    if (!dateString) return '';
    // Handle DD/MM/YYYY
    if (dateString.includes('/')) {
        const parts = dateString.split('/');
        if (parts.length === 3) {
            const year = parts[2].length === 2 ? `20${parts[2]}` : parts[2];
            const month = parts[1].padStart(2, '0');
            const day = parts[0].padStart(2, '0');
            return `${year}${month}${day}`;
        }
    }
    // Try parsing natural language Date
    try {
        const dt = new Date(dateString);
        if (!isNaN(dt.getTime())) {
            return dt.toISOString().split('T')[0].replace(/-/g, '');
        }
    } catch (e) { }
    return new Date().toISOString().split('T')[0].replace(/-/g, '');
}
