
async function runHealthCheckV2() {
    const BASE_URL = 'http://localhost:8000/api/v1';
    const timestamp = Date.now();
    let customerToken = "";
    let stationId = "";
    let productId = "";
    let parcelId = "";

    console.log("=== STARTING RAILMATE INTEGRATION TEST (V2) ===");

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

    // 1. GET STATION (Real ID)
    console.log("\n[1] Fetching Stations...");
    const stationsParams = await get('/stations');
    if (!stationsParams.ok) { console.error("FAIL: Get Stations", stationsParams.data); return; }

    const ndls = stationsParams.data.data.find(s => s.code === "NDLS");
    if (!ndls) { console.error("FAIL: NDLS station not found in seed data"); return; }
    stationId = ndls._id;
    console.log(`PASS: Found NDLS (${stationId})`);

    // 2. REGISTER & LOGIN CUSTOMER
    console.log("\n[2] Auth Customer...");
    const custUser = {
        username: `custv2_${timestamp}`,
        email: `custv2_${timestamp}@railmate.com`,
        name: "V2 Customer",
        password: "password123",
        mobile: `66${timestamp.toString().slice(-8)}`,
        role: "Customer"
    };
    await post('/users/register', custUser);
    const loginCust = await post('/users/login', { email: custUser.email, password: custUser.password });
    if (!loginCust.ok) { console.error("FAIL: Login", loginCust.data); return; }
    customerToken = loginCust.data.data.accessToken;
    console.log("PASS: Logged in");

    // 3. SHOP FLOW
    console.log("\n[3] Shop Flow (Get Products)...");
    const productsRes = await get(`/products/station/${stationId}`, customerToken);
    if (!productsRes.ok || productsRes.data.data.length === 0) { console.error("FAIL: No products", productsRes.data); }
    else {
        productId = productsRes.data.data[0]._id;
        console.log(`PASS: Found ${productsRes.data.data.length} products. Selected: ${productsRes.data.data[0].name}`);
    }

    // 4. ORDER FLOW
    if (productId) {
        console.log("\n[4] Creating Order...");
        const product = productsRes.data.data[0];
        const orderPayload = {
            items: [{ product: productId, quantity: 1, price: product.price }],
            totalAmount: product.price,
            stationId: stationId,
            vendorId: product.vendorId
        };
        const orderRes = await post('/orders/create', orderPayload, customerToken);
        if (orderRes.ok) console.log("PASS: Order Created", orderRes.data.data._id);
        else console.error("FAIL: Order Create", orderRes.data);
    }

    // 5. PARCEL FLOW (Dynamic Station ID)
    console.log("\n[5] Parcel Flow...");
    const parcelPayload = {
        weight: 5,
        pickupStation: "New Delhi", // The existing parcel controller uses Strings for stations or IDs? 
        // Controller uses Strings currently? Let's check. 
        // Controller: const { pickupStation ... } = req.body. 
        // If it's pure string, it works. If it needs ID, we need ID.
        // My seed script created Stations with Code/Name.
        // The Parcel Model schema for pickupStation is String. So "New Delhi" works.
        // But let's use the Name from the fetched station to be consistent.
        pickupStation: ndls.name,
        destinationStation: "Agra Cantt",
        description: "V2 Test Parcel",
        paymentMode: "Online",
        paymentGateway_id: "PG-V2",
        order_id: `ORD-V2-${timestamp}`,
        receiverDetails: { name: "Receiver V2", mobile: "9999999999" },
        senderDetails: { name: "Sender V2", mobile: "8888888888" }
    };
    const parcelRes = await post('/parcels/create', parcelPayload, customerToken);
    if (!parcelRes.ok) { console.error("FAIL: Parcel Create", parcelRes.data); }
    else {
        parcelId = parcelRes.data.data._id;
        console.log(`PASS: Parcel Created (${parcelId})`);

        // 6. TRACKING FLOW
        console.log("\n[6] Tracking Flow...");
        // initial status
        const track1 = await get(`/parcels/status/${parcelId}`);
        console.log("Initial Status:", track1.data.data.status);

        // update tracking (simulated courier update)
        const updateRes = await fetch(`${BASE_URL}/parcels/track/${parcelId}`, { // Note: using patch
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${customerToken}` },
            body: JSON.stringify({ location: "Mathura Junction", status: "In Transit" })
        });
        if (updateRes.ok) {
            console.log("PASS: Updated Tracking to 'In Transit' at 'Mathura Junction'");
            const track2 = await get(`/parcels/status/${parcelId}`);
            const history = track2.data.data.trackingHistory;
            const lastUpdate = history[history.length - 1];
            if (lastUpdate.location === "Mathura Junction") console.log("PASS: Verification - Tracking History updated correctly");
            else console.error("FAIL: Tracking History mismatch", history);
        } else {
            console.error("FAIL: Update Tracking", await updateRes.json());
        }
    }

    console.log("\n=== V2 CHECK COMPLETE ===");
}

runHealthCheckV2();
