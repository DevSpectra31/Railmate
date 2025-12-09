import fetch from 'node-fetch';

const API_URL = 'http://localhost:8000/api/v1';

async function verifyVendorFlow() {
    try {
        console.log("=== VENDOR API VERIFICATION ===");

        // 1. LOGIN
        console.log("[1] Logging in...");
        const loginRes = await fetch(`${API_URL}/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: "browser_fixed@test.com", password: "password123" })
        });

        if (!loginRes.ok) throw new Error(`Login failed: ${loginRes.status}`);
        const loginData = await loginRes.json();
        const token = loginData.data.accessToken;
        console.log("PASS: Login successful");

        // 2. GET STATIONS (Need one for product)
        console.log("\n[2] Fetching Stations...");
        const stRes = await fetch(`${API_URL}/stations`);
        const stData = await stRes.json();
        const station = stData.data[0];
        if (!station) throw new Error("No stations found");
        console.log(`PASS: Found station ${station.name}`);

        // 3. ADD PRODUCT
        console.log("\n[3] Adding Product...");
        const productPayload = {
            name: "Test Biryani",
            price: 250,
            description: "Delicious test biryani",
            category: "Lunch",
            stationId: station._id
        };
        const addProdRes = await fetch(`${API_URL}/products/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(productPayload)
        });

        if (!addProdRes.ok) {
            const txt = await addProdRes.text();
            throw new Error(`Add Product failed: ${addProdRes.status} ${txt}`);
        }
        console.log("PASS: Product added");

        // 4. LIST PRODUCTS
        console.log("\n[4] Listing Vendor Products...");
        const listRes = await fetch(`${API_URL}/products/vendor`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const listData = await listRes.json();
        const products = listData.data;
        console.log(`PASS: Found ${products.length} products`);
        const addedProduct = products.find(p => p.name === "Test Biryani");
        if (!addedProduct) throw new Error("Added product not found in list");
        console.log("PASS: Verified added product in list");

        // 5. CHECK DASHBOARD ORDERS (Should be empty or have old ones)
        console.log("\n[5] Checking Vendor Orders...");
        const ordRes = await fetch(`${API_URL}/orders/vendor/list`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!ordRes.ok) throw new Error(`Get Orders failed: ${ordRes.status}`);
        const ordData = await ordRes.json();
        console.log(`PASS: Fetched ${ordData.data.length} orders`);

        console.log("\n=== VERIFICATION COMPLETE ===");

    } catch (error) {
        console.error("FAIL:", error);
    }
}

verifyVendorFlow();
