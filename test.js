const http = require('http');

const data = JSON.stringify({
    doc_type: "purchase_order",
    data: {
        nomor_po: "3500742171",
        tanggal_dibuat: "09.01.2026",
        customer_name: "210180-karya_bersama_cv",
        supplier_code: "210180_FJARSAP",
        detail_barang_dipesan: [
            {
                description: "30000726_PEMBERSIH LANTAI",
                qty: "30.0",
                unit: "EA",
                unit_price: "16,000 IDR"
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
    res.on('data', (chunk) => {
        responseData += chunk;
    });

    res.on('end', () => {
        console.log('Status Code:', res.statusCode);
        console.log('Response:', JSON.parse(responseData));
    });
});

req.on('error', (error) => {
    console.error('Error:', error);
});

req.write(data);
req.end();
