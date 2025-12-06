
async function runHealthCheckV3() {
    const BASE_URL = 'http://localhost:8000/api/v1';
    const timestamp = Date.now();
    let customerToken = "";
    let vendorToken = "";
    let stationId = "";
    let productId = "";
    let parcelId = "";
    let orderId = "";

    console.log("=== STARTING RAILMATE V3 (DASHBOARD CHECK) ===");

    // helper
    const post = async (url, body, token) => {
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;
        const res = await fetch(`${BASE_URL}${url}`, { method: 'POST', headers, body: JSON.stringify(body) });
        const data = await res.json().catch(() => ({}));
        return { ok: res.ok, status: res.status, data };
    };

    const get = async (url, token) => {
        const headers = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;
        const res = await fetch(`${BASE_URL}${url}`, { method: 'GET', headers });
        const data = await res.json().catch(() => ({}));
        return { ok: res.ok, status: res.status, data };
    };

    // 1. SETUP: GET STATION
    console.log("\n[1] SETUP...");
    const stationsParams = await get('/stations');
    const ndls = stationsParams.data.data.find(s => s.code === "NDLS");
    stationId = ndls._id;

    // 2. AUTH: CUSTOMER & VENDOR
    // CUST
    const custUser = { username: `custv3_${timestamp}`, email: `custv3_${timestamp}@railmate.com`, name: "V3 Customer", password: "password123", mobile: `55${timestamp.toString().slice(-8)}` };
    await post('/users/register', { ...custUser, role: "Customer" });
    const loginCust = await post('/users/login', { email: custUser.email, password: custUser.password });
    customerToken = loginCust.data.data.accessToken;

    // VENDOR
    const vendorUser = { username: `vendv3_${timestamp}`, email: `vendv3_${timestamp}@railmate.com`, name: "V3 Vendor", password: "password123", mobile: `44${timestamp.toString().slice(-8)}` };
    await post('/users/register', { ...vendorUser, role: "Vendor" });
    const loginVend = await post('/users/login', { email: vendorUser.email, password: vendorUser.password });
    vendorToken = loginVend.data.data.accessToken;
    console.log("PASS: Auth setup complete");

    // 3. VENDOR DASHBOARD: ADD PRODUCT
    console.log("\n[3] Vendor: Add Product...");
    const prodPayload = {
        name: "V3 Special Biryani",
        price: 300,
        description: "Test Biryani",
        category: "Dinner",
        stationId: stationId,
        image: "https://via.placeholder.com/150"
    };
    const addProd = await post('/products/add', prodPayload, vendorToken);
    if (addProd.ok) {
        productId = addProd.data.data._id;
        console.log(`PASS: Vendor added product ${prodPayload.name}`);
    } else {
        console.error("FAIL: Add Product", addProd.data);
    }

    // 4. CUSTOMER: BUY PRODUCT
    console.log("\n[4] Customer: Buy Product...");
    const orderPayload = {
        items: [{ product: productId, quantity: 2, price: 300 }], // 600 total
        totalAmount: 600,
        stationId: stationId,
        vendorId: addProd.data.data.vendorId // generated from req.user
    };
    const createOrder = await post('/orders/create', orderPayload, customerToken);
    if (createOrder.ok) {
        orderId = createOrder.data.data._id;
        console.log("PASS: Customer placed order");
    } else {
        console.error("FAIL: Create Order", createOrder.data);
    }

    // 5. CUSTOMER: BOOK PARCEL
    console.log("\n[5] Customer: Book Parcel...");
    const parcelPayload = {
        weight: 10,
        pickupStation: ndls.name,
        destinationStation: "Mumbai Central",
        description: "V3 Parcel",
        paymentMode: "Online",
        paymentGateway_id: `PG-V3-${timestamp}`,
        order_id: `ORD-V3-${timestamp}`,
        receiverDetails: { name: "Receiver V3", mobile: "9999999999" },
        senderDetails: { name: "Sender V3", mobile: "8888888888" }
    };
    const createParcel = await post('/parcels/create', parcelPayload, customerToken);
    if (createParcel.ok) {
        parcelId = createParcel.data.data._id;
        console.log("PASS: Customer booked parcel");
    } else {
        console.error("FAIL: Create Parcel", createParcel.data);
    }

    // 6. VERIFY DASHBOARDS (THE CORE TEST)
    console.log("\n[6] VERIFY DASHBOARDS...");

    // A. User Dashboard: Get Parcels
    const userParcels = await get('/parcels/user', customerToken);
    const myParcel = userParcels.data.data.find(p => p._id === parcelId);
    if (myParcel) console.log("PASS: User Dashboard -> Parcel Found");
    else console.error("FAIL: User Parcel missing");

    // B. User Dashboard: Get Orders
    const userOrders = await get('/orders/user/list', customerToken);
    const myOrder = userOrders.data.data.find(o => o._id === orderId);
    if (myOrder) console.log("PASS: User Dashboard -> Food Order Found");
    else console.error("FAIL: User Order missing");

    // C. Vendor Dashboard: Get Orders
    const vendorOrders = await get('/orders/vendor/list', vendorToken); // Authenticated as Vendor
    const vendOrder = vendorOrders.data.data.find(o => o._id === orderId);
    if (vendOrder) console.log("PASS: Vendor Dashboard -> Incoming Order Found");
    else console.error("FAIL: Vendor Order missing", vendorOrders.data);

    console.log("\n=== V3 CHECK COMPLETE ===");
}

runHealthCheckV3();
