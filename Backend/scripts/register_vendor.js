import fetch from 'node-fetch';

const API_URL = 'http://localhost:8000/api/v1';

async function registerVendor() {
    try {
        const email = `browser_fixed@test.com`;
        const timestamp = Date.now(); // Keep for username uniqueness if needed
        const password = "password123";

        console.log(`Registering vendor: ${email}`);

        const res = await fetch(`${API_URL}/users/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: `browservendor_${timestamp}`,
                email: email,
                name: "Browser Test Vendor",
                password: password,
                mobile: `${timestamp}`.slice(-10),
                role: "Vendor",
                verified: true
            })
        });

        if (!res.ok) {
            const txt = await res.text();
            if (res.status === 409 || txt.includes("exists")) {
                console.log(`⚠️ User ${email} already exists. Using existing account.`);
            } else {
                throw new Error(`Registration failed: ${res.status} ${txt}`);
            }
        } else {
            const data = await res.json();
            console.log(`✅ Registered new vendor!`);
        }

        console.log("\n=== VENDOR CREDENTIALS ===");
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);
        console.log("==========================\n");

    } catch (error) {
        console.error("Error:", error);
    }
}

registerVendor();
