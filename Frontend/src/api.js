/**
 * API Client for Coy Discover Backend
 */

// If VITE_API_URL is set, use it; otherwise use empty string which routes through Vite's local proxy
const BASE_URL = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) || '';

// Consistent user ID matching backend config
export const CURRENT_USER_ID = 'current_user';

export const CURRENT_USER_PROFILE = {
  id: CURRENT_USER_ID,
  name: 'You',
  photo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
  bio: 'Living in the moment & discovering new connections.',
  cityOrCollege: 'Delhi'
};

async function handleResponse(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const errorMsg = data.error || data.message || `Request failed with status ${res.status}`;
    const error = new Error(errorMsg);
    error.status = res.status;
    error.data = data;
    throw error;
  }
  return data;
}

/**
 * Fetch discover feed: returns profiles not yet swiped on
 */
export async function getFeed() {
  const res = await fetch(`${BASE_URL}/feed`, {
    headers: {
      'x-user-id': CURRENT_USER_ID
    }
  });
  return handleResponse(res);
}

/**
 * Record a swipe: LIKE or PASS
 * @param {string} targetProfileId
 * @param {'LIKE'|'PASS'} action
 */
export async function postSwipe(targetProfileId, action) {
  const res = await fetch(`${BASE_URL}/swipe`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': CURRENT_USER_ID
    },
    body: JSON.stringify({ targetProfileId, action })
  });
  return handleResponse(res);
}

/**
 * Fetch confirmed mutual matches
 */
export async function getMatches() {
  const res = await fetch(`${BASE_URL}/matches`, {
    headers: {
      'x-user-id': CURRENT_USER_ID
    }
  });
  return handleResponse(res);
}

/**
 * Development-only reset to seed profiles
 */
export async function devResetData() {
  const res = await fetch(`${BASE_URL}/dev/reset`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': CURRENT_USER_ID
    }
  });
  return handleResponse(res);
}
