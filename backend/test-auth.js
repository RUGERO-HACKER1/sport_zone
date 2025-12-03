// const fetch = require('node-fetch'); // Native fetch in Node 18+

const API_URL = 'http://localhost:5000/api/auth';
const TEST_USER = {
    teamName: 'Test Team ' + Date.now(),
    captainName: 'Test Captain',
    email: 'test' + Date.now() + '@example.com',
    phone: '1234567890',
    password: 'password123'
};

async function testAuth() {
    console.log('🚀 Starting Auth Test...');

    // 1. Register
    console.log('\n1️⃣ Testing Registration...');
    try {
        const regRes = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(TEST_USER)
        });
        const regData = await regRes.json();

        if (!regRes.ok) {
            throw new Error(`Registration failed: ${regData.message}`);
        }
        console.log('✅ Registration successful!');
        console.log('User ID:', regData.data.user.id);

        // 2. Login
        console.log('\n2️⃣ Testing Login...');
        const loginRes = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: TEST_USER.email,
                password: TEST_USER.password
            })
        });
        const loginData = await loginRes.json();

        if (!loginRes.ok) {
            throw new Error(`Login failed: ${loginData.message}`);
        }
        console.log('✅ Login successful!');
        console.log('Token received:', !!loginData.data.token);

    } catch (error) {
        console.error('❌ Test Failed:', error.message);
        process.exit(1);
    }
}

testAuth();
