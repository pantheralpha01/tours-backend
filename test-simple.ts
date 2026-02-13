/**
 * Simple API Test - Debug Version
 * Tests basic booking creation and transition
 */

import http from "http";

const BASE_URL = "http://localhost:4000";

async function makeRequest(
  method: string,
  path: string,
  body?: unknown,
  token?: string
): Promise<{ status: number; body: string }> {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: parseInt(url.port || "80"),
      path: url.pathname + url.search,
      method,
      timeout: 5000,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    };

    console.log(`[${method}] ${path}`);

    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        console.log(`Response: ${res.statusCode}`);
        resolve({ status: res.statusCode || 500, body: data });
      });
    });

    req.on("error", (err) => {
      console.error(`Error: ${err.message}`);
      reject(err);
    });

    req.on("timeout", () => {
      console.error("Request timeout");
      req.destroy();
      reject(new Error("Request timeout"));
    });

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function run() {
  try {
    console.log("🧪 Starting API tests\n");

    // Login
    console.log("📝 Step 1: Login");
    const loginRes = await makeRequest("POST", "/api/auth/login", {
      email: "admin@example.com",
      password: "Admin@123",
    });

    if (loginRes.status !== 200) {
      console.error("Login failed:", loginRes.body);
      process.exit(1);
    }

    const loginData = JSON.parse(loginRes.body);
    const token = loginData.accessToken;
    const userId = loginData.user.id;
    console.log(`✓ Logged in as: ${loginData.user.email}`);
    console.log(`  User ID: ${userId}\n`);

    // Create booking
    console.log("📝 Step 2: Create booking (DRAFT)");
    const bookingRes = await makeRequest(
      "POST",
      "/api/bookings",
      {
        customerName: "Test Customer",
        serviceTitle: "Test Tour",
        amount: 100,
        currency: "USD",
        status: "DRAFT",
      },
      token
    );

    if (bookingRes.status !== 201) {
      console.error("Booking creation failed:", bookingRes.body);
      process.exit(1);
    }

    const bookingData = JSON.parse(bookingRes.body);
    const bookingId = bookingData.id;
    console.log(`✓ Booking created`);
    console.log(`  ID: ${bookingId}`);
    console.log(`  Status: ${bookingData.status}\n`);

    // Transition booking: DRAFT → CONFIRMED
    console.log("📝 Step 3: Transition booking DRAFT → CONFIRMED");
    const transitionRes = await makeRequest(
      "PUT",
      `/api/bookings/${bookingId}/transition`,
      {
        toStatus: "CONFIRMED",
        transitionReason: "Customer confirmed booking",
      },
      token
    );

    if (transitionRes.status !== 200) {
      console.error("Transition failed:", transitionRes.body);
      process.exit(1);
    }

    const transitionData = JSON.parse(transitionRes.body);
    console.log(`✓ Booking transitioned`);
    console.log(`  Status: ${transitionData.status}\n`);

    // Try invalid transition
    console.log("📝 Step 4: Try invalid transition CONFIRMED → DRAFT");
    const invalidRes = await makeRequest(
      "PUT",
      `/api/bookings/${bookingId}/transition`,
      {
        toStatus: "DRAFT",
        transitionReason: "Invalid transition",
      },
      token
    );

    if (invalidRes.status === 400) {
      console.log(`✓ Invalid transition rejected (400)`);
      console.log(`  Message: ${JSON.parse(invalidRes.body).message}\n`);
    } else {
      console.error(
        `✗ Expected 400, got ${invalidRes.status}:`,
        invalidRes.body
      );
    }

    console.log("✅ All tests passed!");
  } catch (error) {
    console.error("Test error:", error);
    process.exit(1);
  }
}

run();
