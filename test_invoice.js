const http = require('http');

const data = JSON.stringify({
    doc_type: "invoice",
    data: {
        nomor_invoice: "260103",
        tanggal_transaksi: "19 Januari 2026",
        customer_name: "cv/karya_bersama_indah",
        nama_perusahaan: "CV. KARYA BERSAMA",
        total_pembayaran: "2.320.000",
        detail_barang_jasa: [
            {
                description: "Pembersin fantai",
                qty: "30",
                unit: "1",
                unit_price: "16.000"
            }
        ]
    }
});

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/documents',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = http.request(options, (res) => {
    let responseData = '';
    res.on('data', (chunk) => { responseData += chunk; });
    res.on('end', () => {
        console.log('Status Code:', res.statusCode);
        console.log('Response:', JSON.stringify(JSON.parse(responseData), null, 2));
    });
});

req.on('error', (error) => { console.error('Error:', error); });
req.write(data);
req.end();
