import fetch from 'node-fetch';

const API_URL = 'http://localhost:8000/api/v1';

async function verifyServer() {
    try {
        console.log("Checking server health...");
        const res = await fetch(`${API_URL}/healthcheck`); // Assuming standard healthcheck or just check root
        console.log("Health status:", res.status);
    } catch (e) {
        console.error("Server check failed:", e.message);
    }
}

async function registerVendor() {
    await verifyServer();
    try {
        const email = `browservendor_${Date.now()}@test.com`;
        const timestamp = Date.now();
        const password = "password123";

        console.log(`Attempting to register vendor: ${email}`);

        const res = await fetch(`${API_URL}/users/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: `vendor_${timestamp}`,
                email: email,
                name: "Debug Vendor",
                password: password,
                mobile: `${timestamp}`.slice(-10),
                role: "Vendor",
                verified: true
            })
        });

        console.log(`Response status: ${res.status}`);
        const txt = await res.text();
        console.log(`Response body: ${txt}`);

        if (!res.ok) {
            throw new Error(`Registration failed: ${res.status}`);
        }

        console.log("SUCCESS: Vendor registered.");
    } catch (error) {
        console.error("Error during registration:", error);
    }
}

registerVendor();
