
async function runHealthCheck() {
    const BASE_URL = 'http://localhost:8000/api/v1';
    const timestamp = Date.now();
    let vendorToken = "";
    let customerToken = "";
    let stationId = "New Delhi";  // Treating string as ID for MVP
    let productId = "";
    let vendorId = "";

    console.log("=== STARTING RAILMATE HEALTH CHECK ===");

    // helper
    const post = async (url, body, token) => {
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;
        const res = await fetch(`${BASE_URL}${url}`, { method: 'POST', headers, body: JSON.stringify(body) });
        return { ok: res.ok, status: res.status, data: await res.json().catch(() => ({})) };
    };

    const get = async (url, token) => {
        const headers = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;
        const res = await fetch(`${BASE_URL}${url}`, { method: 'GET', headers });
        return { ok: res.ok, status: res.status, data: await res.json().catch(() => ({})) };
    };

    // 1. REGISTER VENDOR
    console.log("\n[1] Registering Vendor...");
    const vendorUser = {
        username: `vendor_${timestamp}`,
        email: `vendor_${timestamp}@railmate.com`,
        name: "Test Vendor",
        password: "password123",
        mobile: `88${timestamp.toString().slice(-8)}`,
        role: "Vendor",
        verified: true // Assuming backend respects this or default true
    };
    const regVend = await post('/users/register', vendorUser);
    if (!regVend.ok) { console.error("FAIL: Vendor Reg", regVend.data); return; }
    console.log("PASS: Vendor Registered");

    // 2. LOGIN VENDOR
    console.log("\n[2] Logging in Vendor...");
    const loginVend = await post('/users/login', { email: vendorUser.email, password: vendorUser.password });
    if (!loginVend.ok) { console.error("FAIL: Vendor Login", loginVend.data); return; }
    vendorToken = loginVend.data.data.accessToken;
    vendorId = loginVend.data.data.user._id;
    console.log("PASS: Vendor Logged In");

    // 3. ADD PRODUCT
    console.log("\n[3] Adding Product...");
    const productPayload = {
        name: "Veg Thali",
        price: 150,
        description: "Delicious thali",
        category: "Food",
        stationId: stationId,
        image: "http://example.com/thali.jpg"
    };
    const addProd = await post('/products/add', productPayload, vendorToken);
    if (!addProd.ok) { console.error("FAIL: Add Product", addProd.data); }
    else {
        productId = addProd.data.data._id;
        console.log("PASS: Product Added", productId);
    }

    // 4. REGISTER CUSTOMER
    console.log("\n[4] Registering Customer...");
    const custUser = {
        username: `cust_${timestamp}`,
        email: `cust_${timestamp}@railmate.com`,
        name: "Test Customer",
        password: "password123",
        mobile: `77${timestamp.toString().slice(-8)}`,
        role: "Customer"
    };
    const regCust = await post('/users/register', custUser);
    if (!regCust.ok) { console.error("FAIL: Cust Reg", regCust.data); return; }
    console.log("PASS: Customer Registered");

    // 5. LOGIN CUSTOMER
    console.log("\n[5] Logging in Customer...");
    const loginCust = await post('/users/login', { email: custUser.email, password: custUser.password });
    if (!loginCust.ok) { console.error("FAIL: Cust Login", loginCust.data); return; }
    customerToken = loginCust.data.data.accessToken;
    console.log("PASS: Customer Logged In");

    // 6. BOOK PARCEL (Phase 2 Check)
    console.log("\n[6] Booking Parcel...");
    const parcelPayload = {
        weight: 2.5,
        pickupStation: "New Delhi",
        destinationStation: "Agra",
        description: "Gift Box",
        paymentMode: "Online",
        paymentGateway_id: "PG-TEST",
        order_id: `ORD-${Date.now()}`,
        receiverDetails: { name: "Mom", mobile: "9999999999", address: "Home" },
        senderDetails: { name: "Me", mobile: "8888888888" }
    };
    const bookParcel = await post('/parcels/create', parcelPayload, customerToken);
    if (!bookParcel.ok) { console.error("FAIL: Book Parcel", bookParcel.data); }
    else {
        console.log("PASS: Parcel Booked. Cost:", bookParcel.data.data.amount);
        if (bookParcel.data.data.qrCode) console.log("PASS: QR Code generated");
    }

    // 7. LIST PRODUCTS (Shop Check)
    console.log("\n[7] Listing Products at Station...");
    const listProd = await get(`/products/station/${stationId}`, customerToken);
    if (!listProd.ok) { console.error("FAIL: List Products", listProd.data); }
    else {
        const found = listProd.data.data.find(p => p._id === productId);
        if (found) console.log("PASS: Found 'Veg Thali' in station products");
        else console.warn("WARN: Product not found in list");
    }

    // 8. CREATE ORDER (Shop Check)
    if (productId && vendorId) {
        console.log("\n[8] Creating Order...");
        const orderPayload = {
            items: [{ product: productId, quantity: 2 }],
            totalAmount: 300,
            stationId: stationId,
            vendorId: vendorId
        };
        const createOrderVal = await post('/orders/create', orderPayload, customerToken);
        if (!createOrderVal.ok) { console.error("FAIL: Create Order", createOrderVal.data); }
        else {
            console.log("PASS: Order Created", createOrderVal.data.data._id);
        }
    } else {
        console.log("SKIP: Skipping Order creation due to missing product/vendor");
    }

    console.log("\n=== HEALTH CHECK COMPLETE ===");
}

runHealthCheck();
