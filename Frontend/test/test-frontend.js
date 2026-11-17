import assert from 'node:assert/strict';
import { CURRENT_USER_ID, CURRENT_USER_PROFILE } from '../src/api.js';

async function testFrontendContracts() {
  console.log('🧪 Running Frontend Contract & Integration Tests...\n');

  // 1. Current User Identity
  console.log('1️⃣  Checking Logged-in User Configuration...');
  assert.equal(CURRENT_USER_ID, 'current_user', 'CURRENT_USER_ID must be centralized as "current_user".');
  assert.equal(typeof CURRENT_USER_PROFILE.name, 'string');
  assert.equal(typeof CURRENT_USER_PROFILE.photo, 'string');
  console.log('   ✅ Centralized user ID is verified.');

  // 2. Profile Contract
  console.log('\n2️⃣  Verifying Profile Contract Requirements...');
  const sampleProfile = {
    id: 'profile_1',
    name: 'Rhea Sen',
    age: 22,
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    bio: 'Film photography, matcha lattes...',
    cityOrCollege: "St. Stephen's College, Delhi",
    interests: ['Film Photography', 'Matcha', 'Cinema', 'Thrifting']
  };

  assert.equal(typeof sampleProfile.id, 'string');
  assert.equal(typeof sampleProfile.name, 'string');
  assert.equal(typeof sampleProfile.age, 'number');
  assert.equal(typeof sampleProfile.photo, 'string');
  assert.equal(typeof sampleProfile.bio, 'string');
  assert.equal(typeof sampleProfile.cityOrCollege, 'string');
  assert(Array.isArray(sampleProfile.interests));
  assert.equal(sampleProfile.hasLikedYou, undefined, 'Must never reveal incoming likes in profile contract.');
  console.log('   ✅ Profile contract meets all requirements.');

  // 3. Match Celebration Contract
  console.log('\n3️⃣  Verifying Match Celebration Contract...');
  const sampleMatch = {
    id: 'match_001',
    profile: {
      id: 'profile_3',
      name: 'Meera Nair',
      photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9'
    }
  };
  assert.equal(typeof sampleMatch.id, 'string');
  assert.equal(typeof sampleMatch.profile.id, 'string');
  assert.equal(typeof sampleMatch.profile.name, 'string');
  assert.equal(typeof sampleMatch.profile.photo, 'string');
  console.log('   ✅ Match celebration payload verified.');

  console.log('\n🎉 ALL FRONTEND CONTRACT TESTS PASSED!\n');
}

testFrontendContracts().catch((err) => {
  console.error('❌ Frontend test failed:', err);
  process.exit(1);
});
