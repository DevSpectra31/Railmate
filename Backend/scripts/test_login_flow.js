
async function testLogin() {
    try {
        console.log("Attempting login to check for 500 error...");
        const response = await fetch('http://localhost:8000/api/v1/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: 'Vineet_72',
                password: 'wrongpassword'
            })
        });

        console.log(`Response Status: ${response.status}`);

        if (response.status === 500) {
            console.error("FAIL: Still getting 500 Internal Server Error");
            process.exit(1);
        } else {
            console.log("PASS: Not a 500 error. The server handled the request gracefully.");
        }
    } catch (error) {
        console.error("Error connecting to server:", error.message);
    }
}

testLogin();
