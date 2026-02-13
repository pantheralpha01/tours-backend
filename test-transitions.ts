/**
 * State Machine Transition Tests
 * Tests booking, payment, dispatch, dispute, and refund status transitions
 */

import http from "http";
import { URL } from "url";

const BASE_URL = "http://localhost:4000";
let testsPassed = 0;
let testsFailed = 0;
let authToken = "";

// Test helper
async function makeRequest(
  method: string,
  path: string,
  body?: unknown
): Promise<{ status: number; data: unknown }> {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method,
      headers: {
        "Content-Type": "application/json",
        ...(authToken && { Authorization: `Bearer ${authToken}` }),
      },
    };

    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        try {
          resolve({ status: res.statusCode || 500, data: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode || 500, data });
        }
      });
    });

    req.on("error", reject);
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function test(
  name: string,
  fn: () => Promise<void>
): Promise<void> {
  try {
    await fn();
    console.log(`✓ ${name}`);
    testsPassed++;
  } catch (error: unknown) {
    console.log(`✗ ${name}`);
    console.log(`  Error: ${error instanceof Error ? error.message : String(error)}`);
    testsFailed++;
  }
}

async function assertEqual(actual: unknown, expected: unknown, message: string) {
  if (actual !== expected) {
    throw new Error(`${message}: expected ${expected}, got ${actual}`);
  }
}

async function runTests() {
  console.log("🧪 Starting State Machine Transition Tests\n");

  // Login first
  console.log("🔐 Authenticating...");
  const loginRes = await makeRequest("POST", "/api/auth/login", {
    email: "admin@example.com",
    password: "Admin@123",
  });
  
  if (loginRes.status !== 200) {
    console.error("❌ Login failed:", loginRes.data);
    process.exit(1);
  }
  
  const loginData = loginRes.data as { accessToken: string };
  authToken = loginData.accessToken;
  console.log("✓ Authenticated\n");

  // ===== BOOKING TRANSITIONS =====
  console.log("📘 Booking Transitions:");

  let bookingId = "";
  await test(
    "Create booking with DRAFT status",
    async () => {
      const res = await makeRequest("POST", "/api/bookings", {
        customerName: "Test Customer",
        serviceTitle: "Test Tour",
        amount: 100,
        currency: "USD",
        status: "DRAFT",
        agentId: "1",
      });
      await assertEqual(res.status, 201, "Status code");
      const data = res.data as { id: string };
      bookingId = data.id;
    }
  );

  await test(
    "Transition booking DRAFT → CONFIRMED",
    async () => {
      const res = await makeRequest(
        "PUT",
        `/api/bookings/${bookingId}/transition`,
        {
          toStatus: "CONFIRMED",
          transitionReason: "Customer confirmed",
        }
      );
      await assertEqual(res.status, 200, "Status code");
      const data = res.data as { status: string };
      await assertEqual(data.status, "CONFIRMED", "Booking status");
    }
  );

  await test(
    "Reject invalid booking transition CONFIRMED → DRAFT",
    async () => {
      const res = await makeRequest(
        "PUT",
        `/api/bookings/${bookingId}/transition`,
        {
          toStatus: "DRAFT",
          transitionReason: "Invalid transition",
        }
      );
      await assertEqual(res.status, 400, "Status code (should be bad request)");
    }
  );

  // ===== PAYMENT TRANSITIONS =====
  console.log("\n📗 Payment Transitions:");

  let paymentId = "";
  await test(
    "Create payment with INITIATED status",
    async () => {
      const res = await makeRequest("POST", "/api/payments", {
        bookingId,
        amount: 100,
        currency: "USD",
        state: "INITIATED",
      });
      await assertEqual(res.status, 201, "Status code");
      const data = res.data as { id: string };
      paymentId = data.id;
    }
  );

  await test(
    "Transition payment INITIATED → PENDING",
    async () => {
      const res = await makeRequest("PUT", `/api/payments/${paymentId}`, {
        state: "PENDING",
        transitionReason: "Processing payment",
      });
      await assertEqual(res.status, 200, "Status code");
      const data = res.data as { state: string };
      await assertEqual(data.state, "PENDING", "Payment state");
    }
  );

  await test(
    "Transition payment PENDING → COMPLETED",
    async () => {
      const res = await makeRequest("PUT", `/api/payments/${paymentId}`, {
        state: "COMPLETED",
        transitionReason: "Payment successful",
      });
      await assertEqual(res.status, 200, "Status code");
      const data = res.data as { state: string };
      await assertEqual(data.state, "COMPLETED", "Payment state");
    }
  );

  await test(
    "Reject invalid payment transition COMPLETED → PENDING",
    async () => {
      const res = await makeRequest("PUT", `/api/payments/${paymentId}`, {
        state: "PENDING",
        transitionReason: "Invalid",
      });
      await assertEqual(res.status, 400, "Status code");
    }
  );

  // ===== DISPATCH TRANSITIONS =====
  console.log("\n📙 Dispatch Transitions:");

  let dispatchId = "";
  await test(
    "Create dispatch with PENDING status",
    async () => {
      const res = await makeRequest("POST", "/api/dispatch", {
        bookingId,
        status: "PENDING",
      });
      await assertEqual(res.status, 201, "Status code");
      const data = res.data as { id: string };
      dispatchId = data.id;
    }
  );

  await test(
    "Transition dispatch PENDING → ASSIGNED",
    async () => {
      const res = await makeRequest(
        "PUT",
        `/api/dispatch/${dispatchId}`,
        {
          status: "ASSIGNED",
          assignedToId: "1",
          transitionReason: "Assigned to agent",
        }
      );
      await assertEqual(res.status, 200, "Status code");
      const data = res.data as { status: string };
      await assertEqual(data.status, "ASSIGNED", "Dispatch status");
    }
  );

  await test(
    "Transition dispatch ASSIGNED → IN_PROGRESS",
    async () => {
      const res = await makeRequest(
        "PUT",
        `/api/dispatch/${dispatchId}`,
        {
          status: "IN_PROGRESS",
          transitionReason: "Agent started",
        }
      );
      await assertEqual(res.status, 200, "Status code");
      const data = res.data as { status: string };
      await assertEqual(data.status, "IN_PROGRESS", "Dispatch status");
    }
  );

  await test(
    "Transition dispatch IN_PROGRESS → COMPLETED",
    async () => {
      const res = await makeRequest(
        "PUT",
        `/api/dispatch/${dispatchId}`,
        {
          status: "COMPLETED",
          transitionReason: "Work completed",
        }
      );
      await assertEqual(res.status, 200, "Status code");
      const data = res.data as { status: string };
      await assertEqual(data.status, "COMPLETED", "Dispatch status");
    }
  );

  // ===== DISPUTE TRANSITIONS =====
  console.log("\n📕 Dispute Transitions:");

  let disputeId = "";
  await test(
    "Create dispute with OPEN status",
    async () => {
      const res = await makeRequest("POST", "/api/disputes", {
        bookingId,
        reason: "Service issue",
        description: "Tour did not meet expectations",
      });
      await assertEqual(res.status, 201, "Status code");
      const data = res.data as { id: string };
      disputeId = data.id;
    }
  );

  await test(
    "Transition dispute OPEN → UNDER_REVIEW",
    async () => {
      const res = await makeRequest("PUT", `/api/disputes/${disputeId}`, {
        status: "UNDER_REVIEW",
        transitionReason: "Review initiated",
        assignedToId: "1",
      });
      await assertEqual(res.status, 200, "Status code");
      const data = res.data as { status: string };
      await assertEqual(data.status, "UNDER_REVIEW", "Dispute status");
    }
  );

  await test(
    "Transition dispute UNDER_REVIEW → RESOLVED",
    async () => {
      const res = await makeRequest("PUT", `/api/disputes/${disputeId}`, {
        status: "RESOLVED",
        transitionReason: "Issue resolved",
      });
      await assertEqual(res.status, 200, "Status code");
      const data = res.data as { status: string };
      await assertEqual(data.status, "RESOLVED", "Dispute status");
    }
  );

  // ===== REFUND TRANSITIONS =====
  console.log("\n📓 Refund Transitions:");

  let refundId = "";
  await test(
    "Create refund with REQUESTED status",
    async () => {
      const res = await makeRequest("POST", "/api/refunds", {
        bookingId,
        amount: 50,
        reason: "Partial refund for service issue",
      });
      await assertEqual(res.status, 201, "Status code");
      const data = res.data as { id: string };
      refundId = data.id;
    }
  );

  await test(
    "Transition refund REQUESTED → APPROVED",
    async () => {
      const res = await makeRequest("PUT", `/api/refunds/${refundId}`, {
        status: "APPROVED",
        transitionReason: "Approved by manager",
      });
      await assertEqual(res.status, 200, "Status code");
      const data = res.data as { status: string };
      await assertEqual(data.status, "APPROVED", "Refund status");
    }
  );

  await test(
    "Transition refund APPROVED → PROCESSING",
    async () => {
      const res = await makeRequest("PUT", `/api/refunds/${refundId}`, {
        status: "PROCESSING",
        transitionReason: "Processing refund",
      });
      await assertEqual(res.status, 200, "Status code");
      const data = res.data as { status: string };
      await assertEqual(data.status, "PROCESSING", "Refund status");
    }
  );

  await test(
    "Transition refund PROCESSING → COMPLETED",
    async () => {
      const res = await makeRequest("PUT", `/api/refunds/${refundId}`, {
        status: "COMPLETED",
        reference: "REF-2026-001",
        transitionReason: "Refund processed successfully",
      });
      await assertEqual(res.status, 200, "Status code");
      const data = res.data as { status: string };
      await assertEqual(data.status, "COMPLETED", "Refund status");
    }
  );

  // ===== SUMMARY =====
  console.log("\n====================================");
  console.log(`✓ Passed: ${testsPassed}`);
  console.log(`✗ Failed: ${testsFailed}`);
  console.log(`📊 Total: ${testsPassed + testsFailed}`);
  console.log("====================================\n");

  process.exit(testsFailed > 0 ? 1 : 0);
}

// Run tests
runTests().catch(console.error);
