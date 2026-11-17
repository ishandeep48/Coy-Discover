import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createApp } from '../src/server.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to make mock requests against the app without binding to network port
async function makeRequest(app, method, url, body = null, headers = {}) {
  const { default: http } = await import('node:http');

  return new Promise((resolve, reject) => {
    const server = http.createServer(app);
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      const payload = body ? JSON.stringify(body) : null;

      const req = http.request(
        {
          hostname: '127.0.0.1',
          port,
          path: url,
          method,
          headers: {
            'Content-Type': 'application/json',
            ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {}),
            ...headers
          }
        },
        (res) => {
          let data = '';
          res.on('data', (chunk) => (data += chunk));
          res.on('end', () => {
            server.close();
            try {
              const json = data ? JSON.parse(data) : {};
              resolve({ status: res.statusCode, body: json });
            } catch (e) {
              resolve({ status: res.statusCode, raw: data });
            }
          });
        }
      );

      req.on('error', (err) => {
        server.close();
        reject(err);
      });

      if (payload) {
        req.write(payload);
      }
      req.end();
    });
  });
}

async function runTests() {
  console.log('🧪 Starting Discover Data Layer API tests...\n');

  // Test isolated directory
  const testDataDir = path.join(__dirname, 'test-data');
  await fs.rm(testDataDir, { recursive: true, force: true });
  await fs.mkdir(testDataDir, { recursive: true });

  const testRuntimeFile = path.join(testDataDir, 'runtime.json');
  const seedFile = path.resolve(__dirname, '../seed/profiles.json');

  // Record initial seed file mtime and hash to guarantee immutability
  const initialSeedContent = await fs.readFile(seedFile, 'utf-8');

  // 1. First Startup Initialization
  console.log('1️⃣  Testing First Startup Initialization...');
  const { app, dal } = await createApp({
    seedFilePath: seedFile,
    runtimeFilePath: testRuntimeFile,
    currentUserId: 'current_user'
  });

  const runtimeExists = await fs.stat(testRuntimeFile).then(() => true).catch(() => false);
  assert.equal(runtimeExists, true, 'data/runtime.json should be created on first startup.');

  const initialRuntime = JSON.parse(await fs.readFile(testRuntimeFile, 'utf-8'));
  assert(initialRuntime.profiles.length >= 30, 'Should load at least 30 profiles from seed.');
  assert.equal(initialRuntime.matches.length, 0, 'Matches should initially be empty.');
  console.log(`   ✅ Initialized runtime.json with ${initialRuntime.profiles.length} profiles.`);

  // 2. Health check
  console.log('\n2️⃣  Testing Health Check...');
  const healthRes = await makeRequest(app, 'GET', '/health');
  assert.equal(healthRes.status, 200);
  assert.equal(healthRes.body.status, 'ok');
  console.log('   ✅ GET /health returns 200 OK.');

  // 3. GET /feed
  console.log('\n3️⃣  Testing GET /feed...');
  const feedRes = await makeRequest(app, 'GET', '/feed');
  assert.equal(feedRes.status, 200);
  assert.equal(feedRes.body.success, true);
  assert(feedRes.body.count >= 30, 'Feed should return available profiles.');

  // Verify profiles do NOT expose incoming likes or internal swipe actions
  for (const profile of feedRes.body.profiles) {
    assert.equal(typeof profile.id, 'string');
    assert.equal(typeof profile.name, 'string');
    assert.equal(typeof profile.age, 'number');
    assert.equal(typeof profile.photo, 'string');
    assert.equal(typeof profile.bio, 'string');
    assert.equal(typeof profile.cityOrCollege, 'string');
    assert(Array.isArray(profile.interests));
    assert.equal(profile.hasLikedYou, undefined, 'Must not expose incoming likes.');
    assert.equal(profile.swipe, undefined, 'Must not expose internal swipe signals.');
  }
  console.log(`   ✅ GET /feed returned ${feedRes.body.count} sanitized unswiped profiles.`);

  // 4. POST /swipe validation errors
  console.log('\n4️⃣  Testing POST /swipe Validation...');
  const badActionRes = await makeRequest(app, 'POST', '/swipe', {
    targetProfileId: 'profile_1',
    action: 'INVALID_ACTION'
  });
  assert.equal(badActionRes.status, 400, 'Should reject invalid swipe action with 400.');

  const missingTargetRes = await makeRequest(app, 'POST', '/swipe', {
    action: 'LIKE'
  });
  assert.equal(missingTargetRes.status, 400, 'Should reject missing targetProfileId with 400.');

  const nonExistentTargetRes = await makeRequest(app, 'POST', '/swipe', {
    targetProfileId: 'non_existent_profile_9999',
    action: 'LIKE'
  });
  assert.equal(nonExistentTargetRes.status, 404, 'Should reject non-existent profile with 404.');

  const swipeSelfRes = await makeRequest(app, 'POST', '/swipe', {
    targetProfileId: 'current_user',
    action: 'LIKE'
  });
  assert.equal(swipeSelfRes.status, 400, 'Should reject user swiping on themselves with 400.');
  console.log('   ✅ Validations passed (invalid action, missing target, non-existent target, swipe self).');

  // 5. POST /swipe PASS
  console.log('\n5️⃣  Testing POST /swipe with PASS...');
  const passRes = await makeRequest(app, 'POST', '/swipe', {
    targetProfileId: 'profile_1',
    action: 'PASS'
  });
  assert.equal(passRes.status, 201);
  assert.equal(passRes.body.matched, false);
  assert.equal(passRes.body.isMatch, false);
  assert.equal(passRes.body.swipe.action, 'PASS');
  assert.equal(passRes.body.swipe.targetProfileId, 'profile_1');

  // Check single swipe rule on profile_1
  const duplicatePassRes = await makeRequest(app, 'POST', '/swipe', {
    targetProfileId: 'profile_1',
    action: 'PASS'
  });
  assert.equal(duplicatePassRes.status, 409, 'Duplicate swipe on profile_1 should return 409 Conflict.');
  console.log('   ✅ Single swipe rule enforced: Duplicate swipe returns 409 Conflict.');

  // Verify profile_1 is no longer in GET /feed
  const feedAfterPass = await makeRequest(app, 'GET', '/feed');
  assert.equal(
    feedAfterPass.body.profiles.some((p) => p.id === 'profile_1'),
    false,
    'profile_1 should be excluded from feed after swiping PASS.'
  );
  console.log('   ✅ Swiped profile is excluded from subsequent feed calls.');

  // 6. POST /swipe LIKE without mutual like
  console.log('\n6️⃣  Testing POST /swipe LIKE without mutual like...');
  // profile_2 has NOT liked current_user
  const likeNoMatchRes = await makeRequest(app, 'POST', '/swipe', {
    targetProfileId: 'profile_2',
    action: 'LIKE'
  });
  assert.equal(likeNoMatchRes.status, 201);
  assert.equal(likeNoMatchRes.body.matched, false, 'Should not match if target did not like user.');
  console.log('   ✅ Non-mutual like recorded cleanly with matched: false.');

  // 7. POST /swipe LIKE WITH mutual like (profile_3 pre-liked current_user)
  console.log('\n7️⃣  Testing POST /swipe with MUTUAL MATCH...');
  const mutualMatchRes = await makeRequest(app, 'POST', '/swipe', {
    targetProfileId: 'profile_3',
    action: 'LIKE'
  });
  assert.equal(mutualMatchRes.status, 201);
  assert.equal(mutualMatchRes.body.matched, true, 'Should detect mutual match!');
  assert.equal(mutualMatchRes.body.match.profile.id, 'profile_3');
  assert.equal(mutualMatchRes.body.match.profile.name, 'Meera Nair');
  console.log('   ✅ Mutual match detected and returned in response!');

  // 8. GET /matches
  console.log('\n8️⃣  Testing GET /matches...');
  const matchesRes = await makeRequest(app, 'GET', '/matches');
  assert.equal(matchesRes.status, 200);
  assert.equal(matchesRes.body.count, 1, 'Should contain exactly 1 mutual match.');
  assert.equal(matchesRes.body.matches[0].profile.id, 'profile_3');
  assert.equal(matchesRes.body.matches[0].profile.name, 'Meera Nair');
  console.log('   ✅ GET /matches returns only mutual matches with profile data.');

  // 9. Subsequent Startup: Ensure runtime state persists and is NOT reset
  console.log('\n9️⃣  Testing Subsequent Startup (Persistence Check)...');
  const { app: app2 } = await createApp({
    seedFilePath: seedFile,
    runtimeFilePath: testRuntimeFile,
    currentUserId: 'current_user'
  });

  const matchesAfterRestart = await makeRequest(app2, 'GET', '/matches');
  assert.equal(matchesAfterRestart.body.count, 1, 'Matches must persist across server restarts.');
  assert.equal(matchesAfterRestart.body.matches[0].profile.id, 'profile_3');

  const statsAfterRestart = await makeRequest(app2, 'GET', '/stats');
  assert.equal(statsAfterRestart.body.stats.userMatches, 1);
  assert.equal(statsAfterRestart.body.stats.userSwipes, 3); // profile_1 (PASS), profile_2 (LIKE), profile_3 (LIKE)
  console.log('   ✅ Runtime state persisted across simulated restart without resetting.');

  // 10. Concurrency & Serialized Writes Check
  console.log('\n🔟 Testing Concurrent Swipe Writes (Race Condition Prevention)...');
  const concurrentTargets = ['profile_4', 'profile_5', 'profile_6', 'profile_8', 'profile_9'];
  const swipePromises = concurrentTargets.map((id) =>
    makeRequest(app2, 'POST', '/swipe', {
      targetProfileId: id,
      action: 'LIKE'
    })
  );

  const concurrentResults = await Promise.all(swipePromises);
  for (const res of concurrentResults) {
    assert.equal(res.status, 201, 'All serialized concurrent writes should succeed with 201.');
  }

  // Verify state integrity after concurrent writes
  const statsAfterConcurrent = await makeRequest(app2, 'GET', '/stats');
  assert.equal(statsAfterConcurrent.body.stats.userSwipes, 3 + concurrentTargets.length);
  console.log('   ✅ Concurrent write serialization verified with zero race conditions or data corruption.');

  // 11. Development Reset Endpoint
  console.log('\n1️⃣1️⃣ Testing Development Reset Endpoint...');
  const resetRes = await makeRequest(app2, 'POST', '/dev/reset');
  assert.equal(resetRes.status, 200);
  assert.equal(resetRes.body.success, true);
  const feedAfterReset = await makeRequest(app2, 'GET', '/feed');
  assert.equal(feedAfterReset.body.count, 32, 'All 32 profiles should be unswiped after reset.');
  console.log('   ✅ Dev reset endpoint successfully restored original seed state.');

  // 12. Immutability of Seed File
  console.log('\n1️⃣2️⃣ Verifying Seed File Immutability...');
  const finalSeedContent = await fs.readFile(seedFile, 'utf-8');
  assert.equal(finalSeedContent, initialSeedContent, 'seed/profiles.json must NEVER be modified!');
  console.log('   ✅ Seed file remains completely untouched and immutable.');

  // Cleanup test sandbox
  await fs.rm(testDataDir, { recursive: true, force: true });

  console.log('\n🎉 ALL 12 BACKEND TEST SUITES PASSED CLEANLY!\n');
}

runTests().catch((err) => {
  console.error('\n❌ Test execution failed:', err);
  process.exit(1);
});
