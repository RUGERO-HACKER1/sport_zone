// Use native fetch (Node 18+)
const apiFetch = global.fetch;

const BASE_URL = 'http://127.0.0.1:5000/api';

async function runTest() {
    try {
        console.log('🚀 Starting Admin & Payment Flow Test...\n');

        // 1. Login as Admin
        console.log('1️⃣ Logging in as Admin...');
        const adminLoginRes = await apiFetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin@sportzone.com', password: 'Admin@123' })
        });
        const adminData = await adminLoginRes.json();
        if (!adminData.success) throw new Error(`Admin login failed: ${adminData.message}`);
        const adminToken = adminData.data.token;
        console.log('✅ Admin logged in successfully.\n');

        // 2. Fetch Users
        console.log('2️⃣ Fetching Users...');
        const usersRes = await apiFetch(`${BASE_URL}/admin/users`, {
            headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        const usersData = await usersRes.json();
        if (!usersData.success) throw new Error('Failed to fetch users');
        console.log(`✅ Fetched ${usersData.data.length} users.\n`);

        // 3. Create Tournament
        console.log('3️⃣ Creating Tournament...');
        const tournamentRes = await apiFetch(`${BASE_URL}/tournaments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${adminToken}`
            },
            body: JSON.stringify({
                name: `Test Tournament ${Date.now()}`,
                description: 'Automated test tournament',
                maxTeams: 8,
                entryFee: 500,
                prizePool: '10000 RWF',
                startDate: new Date().toISOString(),
                endDate: new Date(Date.now() + 86400000).toISOString()
            })
        });
        const tournamentData = await tournamentRes.json();
        if (!tournamentData.success) throw new Error('Failed to create tournament');
        const tournamentId = tournamentData.data.id;
        console.log(`✅ Tournament created: ${tournamentData.data.name} (ID: ${tournamentId})\n`);

        // 4. Register a Player (Create new user first)
        console.log('4️⃣ Registering a Player...');
        const playerEmail = `player${Date.now()}@test.com`;
        const playerRes = await apiFetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                teamName: `Team ${Date.now()}`,
                captainName: 'Test Captain',
                email: playerEmail,
                phone: '0780000000',
                password: 'password123'
            })
        });
        const playerData = await playerRes.json();
        if (!playerData.success) throw new Error('Failed to register player');
        const playerToken = playerData.data.token;
        console.log(`✅ Player registered: ${playerEmail}\n`);

        // 5. Register for Tournament with Payment Proof
        console.log('5️⃣ Registering for Tournament with Payment...');
        const regRes = await apiFetch(`${BASE_URL}/tournaments/${tournamentId}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${playerToken}`
            },
            body: JSON.stringify({ paymentProof: 'TX-TEST-123' })
        });
        const regData = await regRes.json();
        if (!regData.success) throw new Error(`Registration failed: ${regData.message}`);
        const registrationId = regData.data.registration.id;
        console.log(`✅ Registered with payment proof. Status: ${regData.data.registration.status}\n`);

        // 6. Approve Payment (Admin)
        console.log('6️⃣ Approving Payment...');
        const approveRes = await apiFetch(`${BASE_URL}/admin/registrations/${registrationId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${adminToken}`
            },
            body: JSON.stringify({ status: 'confirmed', paymentStatus: 'paid' })
        });
        const approveData = await approveRes.json();
        if (!approveData.success) throw new Error('Failed to approve payment');
        console.log(`✅ Payment approved. New Status: ${approveData.data.status}\n`);

        console.log('🎉 All tests passed successfully!');

    } catch (error) {
        console.error('❌ Test Failed:', error.message);
        process.exit(1);
    }
}

runTest();
