import fetch from 'node-fetch';

const API_URL = 'http://localhost:8000/api/v1';

async function verifyOrderFlow() {
    try {
        console.log("=== ORDER FLOW VERIFICATION ===");

        // 1. LOGIN VENDOR (to get product ID)
        console.log("[1] Login Vendor...");
        const vLoginRes = await fetch(`${API_URL}/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: "browser_fixed@test.com", password: "password123" })
        });
        const vData = await vLoginRes.json();
        const vToken = vData.data.accessToken;

        // Get Product
        const pRes = await fetch(`${API_URL}/products/vendor`, { headers: { 'Authorization': `Bearer ${vToken}` } });
        const pData = await pRes.json();
        const product = pData.data.find(p => p.name === "Test Biryani");

        if (!product) throw new Error("Test Biryani product not found! Run verify_vendor_api.js first.");
        console.log(`PASS: Found Product: ${product._id}`);

        // 2. CREATE CUSTOMER & LOGIN
        console.log("\n[2] Customer Setup...");
        const custEmail = `cust_${Date.now()}@test.com`;
        await fetch(`${API_URL}/users/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: `cust_${Date.now()}`,
                email: custEmail,
                name: "Test Customer",
                password: "password123",
                mobile: `${Date.now()}`.slice(-10),
                role: "Customer",
                verified: true
            })
        });

        const cLoginRes = await fetch(`${API_URL}/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: custEmail, password: "password123" })
        });
        const cData = await cLoginRes.json();
        const cToken = cData.data.accessToken;
        console.log("PASS: Customer Logged In");

        // 3. PLACE ORDER
        console.log("\n[3] Placing Order...");
        const orderPayload = {
            items: [{ productId: product._id, quantity: 2 }], // Note: controller expects productId in items? Let's check controller.
            // Controller: items.productId ? No. 
            // Controller: item.productId? 
            // Let's re-read controller.
            // Controller loop: for (const item of items) { const product = await Product.findById(item.productId); }
            // So structure is items: [{ productId: "...", quantity: 1 }]
            stationId: product.stationId,
            deliveryDetails: { seat: "D1-45", pnr: "1234567890" } // Mock details
        };

        const orderRes = await fetch(`${API_URL}/orders/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${cToken}` },
            body: JSON.stringify(orderPayload)
        });

        if (!orderRes.ok) {
            const txt = await orderRes.text();
            throw new Error(`Order Creation Failed: ${orderRes.status} ${txt}`);
        }
        const orderData = await orderRes.json();
        const orderId = orderData.data._id;
        console.log(`PASS: Order Created: ${orderId}`);

        // 4. VENDOR SEES ORDER
        console.log("\n[4] Vendor Checking Order...");
        const vOrdersRes = await fetch(`${API_URL}/orders/vendor/list`, {
            headers: { 'Authorization': `Bearer ${vToken}` }
        });
        const vOrdersData = await vOrdersRes.json();
        const foundOrder = vOrdersData.data.find(o => o._id === orderId);

        if (!foundOrder) throw new Error("Vendor did not see the new order!");
        console.log(`PASS: Vendor sees order. Status: ${foundOrder.status}`);

        // 5. UPDATE STATUS
        console.log("\n[5] Updating Status...");
        const updateRes = await fetch(`${API_URL}/orders/${orderId}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${vToken}` },
            body: JSON.stringify({ status: "Confirmed" })
        });

        if (!updateRes.ok) throw new Error(`Update failed: ${updateRes.status}`);
        const updateData = await updateRes.json();
        console.log(`PASS: Status Updated to: ${updateData.data.status}`);

        console.log("\n=== ORDER FLOW COMPLETE ===");

    } catch (e) {
        console.error("FAIL:", e);
    }
}

verifyOrderFlow();
