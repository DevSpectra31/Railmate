
import QRCode from "qrcode"; // Ensure we can import, although frontend uses it from response
// Actually we just use fetch here.

async function testParcelBooking() {
    try {
        // 1. Login
        console.log("Logging in...");
        const loginRes = await fetch('http://localhost:8000/api/v1/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'Vineet_72', password: 'wrongpassword' }) // Ideally correct password, but from previous turn we know server handles it.
            // Wait, "wrongpassword" gave 401 in previous test. I need a valid login to get a token.
            // I don't know the password.
            // But I can register a temp user? Or just bypass auth for testing?
            // Or I can use the "register" endpoint to create a fresh user and get token.
        });

        // Let's try to register a new user to ensure we have a valid token
        const timestamp = Date.now();
        const registerPayload = {
            username: `testuser_${timestamp}`,
            email: `test_${timestamp}@example.com`,
            name: "Test User",
            password: "password123",
            mobile: `99${timestamp.toString().slice(-8)}`, // Mock 10 digit
            role: "Customer"
        };

        console.log("Registering temp user...");
        const registerRes = await fetch('http://localhost:8000/api/v1/users/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(registerPayload)
        });

        if (!registerRes.ok) {
            console.error("Registration failed", await registerRes.text());
            // Fallback: try logging in with the user from screenshot if we knew password.
            // But we don't.
            return;
        }

        // Login with new user
        console.log("Logging in with temp user...");
        const loginResponse = await fetch('http://localhost:8000/api/v1/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: registerPayload.email, password: registerPayload.password })
        });

        const loginData = await loginResponse.json();
        const token = loginData.data?.accessToken;

        if (!token) {
            console.error("Failed to get access token");
            return;
        }

        console.log("Got Access Token.");

        // 2. Create Parcel
        console.log("Creating Parcel...");
        const parcelPayload = {
            weight: 5.5,
            pickupStation: "New Delhi",
            destinationStation: "Mumbai Central",
            paymentMode: "Online",
            paymentGateway_id: "PG-12345",
            order_id: `ORD-${Date.now()}`,
            description: "Test Parcel",
            receiverDetails: {
                name: "Receiver Name",
                mobile: "9876543210",
                address: "Mumbai"
            },
            senderDetails: {
                name: "Sender Name",
                mobile: "1234567890"
            }
        };

        const parcelRes = await fetch('http://localhost:8000/api/v1/parcels/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(parcelPayload)
        });

        const parcelData = await parcelRes.json();

        if (parcelRes.ok) {
            console.log("Parcel Created Successfully!");
            console.log("Parcel ID:", parcelData.data._id);
            if (parcelData.data.qrCode && parcelData.data.qrCode.startsWith("data:image/png;base64")) {
                console.log("PASS: QR Code generated successfully.");
            } else {
                console.error("FAIL: QR Code missing or invalid.");
            }

            if (parcelData.data.receiverDetails.name === "Receiver Name") {
                console.log("PASS: Receiver Details saved.");
            } else {
                console.error("FAIL: Receiver Details mismatch.");
            }
            if (parcelData.data.amount === 105) { // 50 + 5.5*10 = 105
                console.log("PASS: Cost calculation correct (105).");
            } else {
                console.error(`FAIL: Cost calculation incorrect. Expected 105, got ${parcelData.data.amount}`);
            }

        } else {
            console.error("Parcel creation failed:", JSON.stringify(parcelData));
        }

    } catch (error) {
        console.error("Error:", error);
    }
}

testParcelBooking();
