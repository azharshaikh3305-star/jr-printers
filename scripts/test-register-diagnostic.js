/**
 * JR PRINTING WORKS - Diagnostic Script
 * Tests the /api/auth/register endpoint by sending a mock POST request
 * and logging database connection status, incoming body content, and server responses.
 *
 * Usage: node scripts/test-register-diagnostic.js
 */

const BASE_URL = process.env.API_URL || 'http://localhost:3000';

async function runDiagnostic() {
  console.log('='.repeat(70));
  console.log('🔍 JR PRINTING WORKS - /api/auth/register Diagnostic Tool');
  console.log(`📡 Target API Host: ${BASE_URL}`);
  console.log(`⏰ Timestamp: ${new Date().toISOString()}`);
  console.log('='.repeat(70));

  // 1. Check Server Health & Database Connection Status
  console.log('\n[STEP 1] Checking Backend Health & Database Connection Status...');
  try {
    const healthRes = await fetch(`${BASE_URL}/api/health`);
    if (!healthRes.ok) {
      console.error(`❌ Health check failed with status: ${healthRes.status} ${healthRes.statusText}`);
    } else {
      const healthData = await healthRes.json();
      console.log('✅ Server is alive and responsive:');
      console.log('   - Server Status:', healthData.message);
      console.log('   - Database Status:', healthData.database?.status || 'Unknown');
      console.log('   - Database Host:', healthData.database?.host || 'none');
      console.log('   - Database Name:', healthData.database?.name || 'none');
    }
  } catch (err) {
    console.error(`❌ Could not connect to ${BASE_URL}/api/health: ${err.message}`);
    console.error('   Ensure the dev server is running on port 3000.');
    process.exit(1);
  }

  // 2. Prepare Mock Registration Payload
  const timestamp = Date.now().toString().slice(-4);
  const mockPayload = {
    name: 'Diagnostic Tester',
    email: `diagnostic.tester.${timestamp}@example.com`,
    phone: `+91 98765${timestamp}`,
    password: 'SecureMockPassword123',
  };

  console.log('\n[STEP 2] Outgoing Mock Registration Payload:');
  console.log(JSON.stringify(mockPayload, null, 2));

  // 3. Send Mock POST Request to /api/auth/register
  console.log('\n[STEP 3] Sending Mock POST Request to /api/auth/register...');
  try {
    const startTime = Date.now();
    const response = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(mockPayload),
    });
    const duration = Date.now() - startTime;

    console.log(`📥 HTTP Status: ${response.status} ${response.statusText} (${duration}ms)`);
    console.log(`📋 Content-Type: ${response.headers.get('content-type')}`);

    const responseBody = await response.json();
    console.log('\n📄 Received Response JSON:');
    console.log(JSON.stringify(responseBody, null, 2));

    if (response.ok && responseBody.success) {
      console.log('\n✅ PASS: /api/auth/register accepted mock payload and created user registration record!');
      if (responseBody.data?.devOtp) {
        console.log(`🔑 Verification OTP generated: ${responseBody.data.devOtp}`);
      }
    } else {
      console.warn(`⚠️ Backend returned non-200 response:`, responseBody.message);
    }
  } catch (err) {
    console.error(`❌ Request failed: ${err.message}`);
  }

  // 4. Test Error Handling (Missing Password Payload)
  console.log('\n[STEP 4] Testing Input Validation & Error Handling (Missing Password)...');
  const invalidPayload = {
    name: 'Invalid Test User',
    email: 'invalid.test@example.com',
    phone: '+91 9999999999',
    // Missing password
  };

  try {
    const errorResponse = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(invalidPayload),
    });

    const errorBody = await errorResponse.json();
    console.log(`📥 HTTP Status: ${errorResponse.status} ${errorResponse.statusText}`);
    console.log(`📄 Response: ${JSON.stringify(errorBody)}`);

    if (errorResponse.status === 400 && !errorBody.success) {
      console.log('✅ PASS: Backend correctly validated payload and returned HTTP 400 Bad Request.');
    } else {
      console.warn('⚠️ Unexpected validation response status.');
    }
  } catch (err) {
    console.error(`❌ Validation test failed: ${err.message}`);
  }

  console.log('\n' + '='.repeat(70));
  console.log('🎉 Diagnostic test complete! Backend logs above reflect incoming payload and DB status.');
  console.log('='.repeat(70));
}

runDiagnostic();
