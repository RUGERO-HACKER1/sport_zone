import fetch from "node-fetch";
import { v4 as uuidv4 } from "uuid";

// === CONFIGURATION ===
const PRIMARY_KEY = "72746f8f9ae24ec7bacd3e3fc9fef963"; // sandbox primary key
const CALLBACK_URL = "https://example.com"; // replace with your callback host
const PAYER_MSISDN = "250780000001"; // sandbox test number
const AMOUNT = "10"; // payment amount
const CURRENCY = "RWF";

// helper delay function
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// helper for base64 encoding
function toBase64(str) {
  return Buffer.from(str).toString("base64");
}

async function main() {
  try {
    // Step 1: Create API User
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

    if (createUser.status !== 201) {
      console.error("❌ Failed to create API User (may already exist)", await createUser.text());
    } else {
      console.log("✅ API User created:", uuid);
    }

    // Wait 15 seconds
    console.log("⏳ Waiting 15 seconds for sandbox to register...");
    await delay(15000);

    // Step 2: Generate API Key
    console.log("🔹 Generating API Key...");
    const getKey = await fetch(`https://sandbox.momodeveloper.mtn.com/v1_0/apiuser/${uuid}/apikey`, {
      method: "GET",
      headers: { "Ocp-Apim-Subscription-Key": PRIMARY_KEY }
    });

    if (!getKey.ok) {
      console.error("❌ Failed to generate API Key", await getKey.text());
      return;
    }

    const keyData = await getKey.json();
    const API_KEY = keyData.apiKey;
    console.log("✅ API Key generated:", API_KEY);

    // Step 3: Generate Access Token
    console.log("🔹 Generating Access Token...");
    const tokenResponse = await fetch("https://sandbox.momodeveloper.mtn.com/collection/token/", {
      method: "POST",
      headers: {
        "Authorization": "Basic " + toBase64(`${uuid}:${API_KEY}`),
        "Ocp-Apim-Subscription-Key": PRIMARY_KEY
      }
    });

    if (!tokenResponse.ok) {
      console.error("❌ Failed to generate Access Token", await tokenResponse.text());
      return;
    }

    const tokenData = await tokenResponse.json();
    const ACCESS_TOKEN = tokenData.access_token;
    console.log("✅ Access Token:", ACCESS_TOKEN);

    // Step 4: Send Request to Pay
    console.log("🔹 Sending Request to Pay...");
    const paymentUUID = uuidv4(); // unique reference for this payment
    const paymentResponse = await fetch("https://sandbox.momodeveloper.mtn.com/collection/v1_0/requesttopay", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + ACCESS_TOKEN,
        "X-Reference-Id": paymentUUID,
        "X-Target-Environment": "sandbox",
        "Ocp-Apim-Subscription-Key": PRIMARY_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        amount: AMOUNT,
        currency: CURRENCY,
        externalId: "test123",
        payer: {
          partyIdType: "MSISDN",
          partyId: PAYER_MSISDN
        },
        payerMessage: "Payment for test",
        payeeNote: "Thanks"
      })
    });

    if (!paymentResponse.ok) {
      console.error("❌ Failed to send Request to Pay", await paymentResponse.text());
      return;
    }

    console.log("✅ Request to Pay sent!");
    console.log("Payment Reference (X-Reference-Id):", paymentUUID);

  } catch (err) {
    console.error("❌ Error:", err);
  }
}

main();
