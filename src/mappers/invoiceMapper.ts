export const mapInvoice = (data: any) => {
    const {
        nomor_invoice,
        tanggal_transaksi,
        customer_name,
        nama_perusahaan,
        detail_barang_jasa = [],
        total_pembayaran
    } = data;

    const grossAmount = parseFloat((total_pembayaran || '').replace(/[^\d.-]/g, '')) || 0;

    const bapiHeader = {
        INVOICE_IND: 'X',
        DOC_DATE: formatDate(tanggal_transaksi),
        PSTNG_DATE: new Date().toISOString().split('T')[0].replace(/-/g, ''), // Default to today
        REF_DOC_NO: nomor_invoice?.substring(0, 16) || '',
        COMP_CODE: '1000', // Example
        GROSS_AMOUNT: grossAmount,
        CALC_TAX_IND: 'X',
        CURRENCY: 'IDR' // Default currency
    };

    const bapiItems = detail_barang_jasa.map((item: any, index: number) => ({
        INVOICE_DOC_ITEM: (index + 1).toString().padStart(6, '0'),
        ITEM_TEXT: item.description?.substring(0, 50) || '',
        QUANTITY: parseFloat(item.qty) || 0,
        ITEM_AMOUNT: parseFloat((item.unit_price || '').replace(/[^\d.-]/g, '')) * (parseFloat(item.qty) || 0)
    }));

    return {
        HEADERDATA: bapiHeader,
        ITEMDATA: bapiItems,
        INVOICESTATUS: '5' // 5 = Invoice is posted
    };
};

function formatDate(dateString: string): string {
    if (!dateString) return '';
    const months: any = {
        januari: '01', februari: '02', maret: '03', april: '04', mei: '05', juni: '06',
        juli: '07', agustus: '08', september: '09', oktober: '10', november: '11', desember: '12'
    };

    const lowerDate = dateString.toLowerCase();
    for (const [monthName, monthNum] of Object.entries(months)) {
        if (lowerDate.includes(monthName)) {
            const parts = lowerDate.split(' ');
            if (parts.length === 3) {
                // Assuming format "DD Month YYYY"
                return `${parts[2]}${monthNum}${parts[0].padStart(2, '0')}`;
            }
        }
    }

    return new Date().toISOString().split('T')[0].replace(/-/g, '');
}
