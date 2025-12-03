const fs = require('fs');

// === CONFIGURATION ===
const PRIMARY_KEY = "72746f8f9ae24ec7bacd3e3fc9fef963"; // your sandbox primary key
const CALLBACK_URL = "https://example.com"; // replace with your callback host

// helper delay function
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Simple UUID generator
function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

async function generateAPIUserAndKey() {
  try {
    // Step 1: Generate UUID for API User
    const uuid = uuidv4();

    console.log("🔹 Creating API User...");
    const createUser = await fetch("https://sandbox.momodeveloper.mtn.com/v1_0/apiuser", {
      method: "POST",
      headers: {
        "X-Reference-Id": uuid,
        "Ocp-Apim-Subscription-Key": PRIMARY_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ providerCallbackHost: CALLBACK_URL })
    });

    console.log("Create User Status:", createUser.status);
    if (createUser.status !== 201) {
      console.error("❌ Failed to create API User", await createUser.text());
      return;
    }

    console.log("✅ API User created:", uuid);

    // Step 2: Wait 30 seconds for MTN sandbox to register the user
    console.log("⏳ Waiting 30 seconds for sandbox to register...");
    await delay(30000);

    // Step 3: Confirm API User exists
    console.log("🔹 Checking if API User exists...");
    const checkUser = await fetch(`https://sandbox.momodeveloper.mtn.com/v1_0/apiuser/${uuid}`, {
      method: "GET",
      headers: { "Ocp-Apim-Subscription-Key": PRIMARY_KEY }
    });

    console.log("Check User Status:", checkUser.status);
    if (!checkUser.ok) {
      console.error("❌ API User not found", await checkUser.text());
      return;
    }

    console.log("✅ API User confirmed in sandbox");

    // Step 4: Generate API Key
    console.log("🔹 Generating API Key...");
    const getKey = await fetch(`https://sandbox.momodeveloper.mtn.com/v1_0/apiuser/${uuid}/apikey`, {
      method: "POST",
      headers: { "Ocp-Apim-Subscription-Key": PRIMARY_KEY }
    });

    console.log("Generate Key Status:", getKey.status);
    if (!getKey.ok) {
      console.error("❌ Failed to generate API Key", await getKey.text());
      return;
    }

    const keyData = await getKey.json();
    console.log("✅ API Key generated:", keyData.apiKey);

    fs.writeFileSync('momo_credentials.json', JSON.stringify({
      apiUser: uuid,
      apiKey: keyData.apiKey,
      primaryKey: PRIMARY_KEY
    }, null, 2));
    console.log("✅ Credentials saved to momo_credentials.json");

  } catch (err) {
    console.error("❌ Error:", err);
  }
}

generateAPIUserAndKey();
