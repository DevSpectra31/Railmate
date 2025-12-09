import fetch from 'node-fetch';
import fs from 'fs';

const API_URL = 'http://localhost:8000/api/v1';
const LOG_FILE = 'verify_result.txt';

function log(msg) {
    console.log(msg);
    fs.appendFileSync(LOG_FILE, msg + '\n');
}

async function verifyVendorUpdate() {
    fs.writeFileSync(LOG_FILE, ''); // Clear
    try {
        const timestamp = Date.now();
        const vendorKey = `vendor_${timestamp}`;
        // Ensure uniqueness
        const userKey = `user_${timestamp}_${Math.floor(Math.random() * 1000)}`;

        log("1. Registering Test Vendor...");
        const vendorReg = await fetch(`${API_URL}/users/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: vendorKey,
                email: `${vendorKey}@test.com`,
                name: "Test Vendor",
                password: "password123",
                mobile: `${Date.now() + Math.random()}`.slice(-10),
                role: "Vendor"
            })
        });

        if (!vendorReg.ok && vendorReg.status !== 409) {
            const err = await vendorReg.text();
            throw new Error(`Vendor Reg Failed: ${vendorReg.status} ${err}`);
        }

        // Login Vendor
        const vendorLoginRes = await fetch(`${API_URL}/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: `${vendorKey}@test.com`, password: "password123" })
        });
        const vendorData = await vendorLoginRes.json();
        if (!vendorData.data) throw new Error("Vendor login failed: " + JSON.stringify(vendorData));
        const vendorToken = vendorData.data.accessToken;

        log("Logged in Vendor.");

        log("2. Registering Test User...");
        const userReg = await fetch(`${API_URL}/users/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: userKey,
                email: `${userKey}@test.com`,
                name: "Test User",
                password: "password123",
                mobile: `${Date.now() + Math.random()}`.slice(-10),
                role: "Customer"
            })
        });

        if (!userReg.ok) {
            const err = await userReg.text();
            throw new Error(`User Reg Failed: ${userReg.status} ${err}`);
        }

        // Login User
        const userLoginRes = await fetch(`${API_URL}/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: `${userKey}@test.com`, password: "password123" })
        });
        const userData = await userLoginRes.json();
        if (!userData.data) throw new Error("User login failed: " + JSON.stringify(userData));
        const userToken = userData.data.accessToken;
        log("Logged in User.");

        // Need a product and station. 
        log("3. Creating Station (if needed) and Product...");
        let stationId;
        const stationsRes = await fetch(`${API_URL}/stations`);
        const stationsData = await stationsRes.json();
        if (stationsData.data && stationsData.data.length > 0) {
            stationId = stationsData.data[0]._id;
        } else {
            // Assuming stations exist
            log("No stations found. Cannot create order.");
            throw new Error("No stations");
        }

        const productRes = await fetch(`${API_URL}/products/add`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${vendorToken}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: "Test Product",
                price: 100,
                description: "Test Desc",
                category: "Test",
                stationId: stationId
            })
        });
        const productData = await productRes.json();
        if (!productData.data) throw new Error(`Product creation failed: ${JSON.stringify(productData)}`);
        const productId = productData.data._id;
        log("Created Product: " + productId);

        log("4. Creating Order as User...");
        const orderRes = await fetch(`${API_URL}/orders/create`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${userToken}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                stationId: stationId,
                items: [{ productId: productId, quantity: 1 }],
                deliveryDetails: { trainNumber: "12345", coachNumber: "B1", seatNumber: "12" }
            })
        });
        const orderData = await orderRes.json();
        if (!orderData.data) throw new Error(`Order creation failed: ${JSON.stringify(orderData)}`);
        const orderId = orderData.data._id;
        log("Created Order: " + orderId);

        log("5. Vendor Updating Status...");
        const updateRes = await fetch(`${API_URL}/orders/${orderId}/status`, {
            method: 'PATCH',
            headers: { 'Authorization': `Bearer ${vendorToken}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: "Preparing" })
        });

        const updateData = await updateRes.json();
        log("Update Response Status: " + updateData.data?.status);

        if (updateData.data?.status === "Preparing") {
            log("✅ VERIFICATION PASSED: Full flow success.");
        } else {
            log(`❌ VERIFICATION FAILED: Status mismatch. ${JSON.stringify(updateData)}`);
        }

    } catch (error) {
        log(`❌ VERIFICATION FAILED: ${error.message || error}`);
    }
}

verifyVendorUpdate();
