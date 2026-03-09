export const mapPurchaseOrder = (data: any) => {
    const {
        nomor_po,
        tanggal_dibuat,
        customer_name,
        detail_barang_dipesan = [],
        total_po_amount,
        supplier_code
    } = data;

    const bapiHeader = {
        DOC_TYPE: 'NB', // Standard PO
        VENDOR: supplier_code?.split('_')[0] || '', // Extracting '210180' from '210180_FJARSAP'
        DOC_DATE: formatDate(tanggal_dibuat),
        PURCH_ORG: '1000', // Example
        PUR_GROUP: '001', // Example
        COMP_CODE: '1000'
    };

    const bapiItems = detail_barang_dipesan.map((item: any, index: number) => {
        // Description: "30000726_PEMBERSIH LANTAI" -> "30000726" as material
        const materialMatch = item.description?.match(/^(\d+)_/);
        const material = materialMatch ? materialMatch[1] : '';

        return {
            PO_ITEM: ((index + 1) * 10).toString().padStart(5, '0'),
            MATERIAL: material,
            SHORT_TEXT: item.description?.substring(0, 40) || '',
            QUANTITY: parseFloat(item.qty) || 0,
            PO_UNIT: item.unit || 'EA',
            NET_PRICE: parseFloat((item.unit_price || '').replace(/[^\d.-]/g, '')) || 0,
        };
    });

    return {
        POHEADER: bapiHeader,
        POITEM: bapiItems
    };
};

function formatDate(dateString: string): string {
    if (!dateString) return '';
    // Handle DD.MM.YYYY
    if (dateString.includes('.')) {
        const parts = dateString.split('.');
        if (parts.length === 3) {
            return `${parts[2]}${parts[1]}${parts[0]}`;
        }
    }
    return new Date().toISOString().split('T')[0].replace(/-/g, '');
}
