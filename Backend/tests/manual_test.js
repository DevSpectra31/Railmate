import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:8000/api/v1';

async function testBackend() {
    console.log("Starting Backend Verification...");

    // 1. Healthcheck
    try {
        const res = await fetch(`${BASE_URL}/healthcheck`);
        const data = await res.json();
        console.log("Healthcheck:", data.message === "Health check passed" ? "PASS" : "FAIL");
    } catch (e) {
        console.log("Healthcheck: FAIL (Server might be down)");
        return;
    }

    // 2. Register Status (Assuming user exists or fails gracefully)
    // For manual test, we skip auth flow complexity and just check if endpoints are reachable (401 expected without token)

    const endpoints = [
        { name: "Create Parcel", url: `${BASE_URL}/parcels/create`, method: "POST" },
        { name: "Create Order", url: `${BASE_URL}/orders/create`, method: "POST" },
        { name: "Add Product", url: `${BASE_URL}/products/add`, method: "POST" },
        { name: "Get Stations", url: `${BASE_URL}/stations`, method: "GET" },
    ];

    for (const ep of endpoints) {
        try {
            const res = await fetch(ep.url, { method: ep.method });
            // We expect 401 Unauthorized for protected routes, or 200/400 for public/bad request
            if (res.status === 401 || res.status === 200 || res.status === 400) {
                console.log(`${ep.name}: PASS (Reachable, Status ${res.status})`);
            } else {
                console.log(`${ep.name}: FAIL (Status ${res.status})`);
            }
        } catch (e) {
            console.log(`${ep.name}: FAIL (Network Error)`);
        }
    }
}

testBackend();
