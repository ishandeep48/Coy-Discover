import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import { FileStorage } from './fileStorage.js';

export class DuplicateSwipeError extends Error {
  constructor(message) {
    super(message);
    this.name = 'DuplicateSwipeError';
    this.status = 409;
  }
}

export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.status = 400;
  }
}

export class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
    this.status = 404;
  }
}

/**
 * DataAccessLayer (DAL)
 * 
 * Reusable data access layer handling business rules, data model integrity,
 * single-swipe validation, mutual match formation, and persistence coordination.
 */
export class DataAccessLayer {
  constructor({ seedFilePath, runtimeFilePath, currentUserId }) {
    this.seedFilePath = seedFilePath;
    this.storage = new FileStorage(runtimeFilePath);
    this.currentUserId = currentUserId;
    this.initialized = false;
  }

  /**
   * Initializes the runtime state.
   * - First startup: loads seed/profiles.json and writes initial data/runtime.json.
   * - Subsequent startups: loads existing data/runtime.json without resetting data.
   * - Never modifies the original seed file.
   */
  async initialize() {
    let runtimeData = await this.storage.read();

    if (!runtimeData) {
      console.log(`[DAL] No runtime.json found. Initializing from seed: ${this.seedFilePath}`);
      runtimeData = await this._createInitialRuntime();
      await this.storage.write(runtimeData);
      console.log(`[DAL] Successfully initialized runtime.json with ${runtimeData.profiles.length} profiles.`);
    } else {
      console.log(`[DAL] Loaded existing runtime.json with ${runtimeData.profiles.length} profiles, ${runtimeData.swipes.length} swipes, ${runtimeData.matches.length} matches.`);
    }

    this.initialized = true;
    return runtimeData;
  }

  /**
   * Reads seed/profiles.json (read-only) and returns initial runtime state.
   */
  async _createInitialRuntime() {
    let seedRaw;
    try {
      seedRaw = await fs.readFile(this.seedFilePath, 'utf-8');
    } catch (err) {
      throw new Error(`Failed to read immutable seed file at ${this.seedFilePath}: ${err.message}`);
    }

    let seedProfiles;
    try {
      seedProfiles = JSON.parse(seedRaw);
    } catch (err) {
      throw new Error(`Invalid JSON in seed file at ${this.seedFilePath}: ${err.message}`);
    }

    if (!Array.isArray(seedProfiles) || seedProfiles.length < 30) {
      throw new Error(`Seed profiles file must contain an array of at least 30 profiles. Found: ${seedProfiles?.length || 0}`);
    }

    // A few mock profiles pre-seeded with secret incoming likes on the logged-in user.
    // In accordance with Coy's rules, these are NEVER exposed in the feed or to the user
    // until the user also swipes LIKE on them, creating a mutual match.
    const initialIncomingLikes = [
      {
        swiperId: 'profile_3',  // Meera Nair
        targetProfileId: this.currentUserId,
        action: 'LIKE',
        createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
      },
      {
        swiperId: 'profile_7',  // Ananya Sharma
        targetProfileId: this.currentUserId,
        action: 'LIKE',
        createdAt: new Date(Date.now() - 3600000 * 3).toISOString()
      },
      {
        swiperId: 'profile_12', // Aditya Varma
        targetProfileId: this.currentUserId,
        action: 'LIKE',
        createdAt: new Date(Date.now() - 3600000 * 1).toISOString()
      }
    ];

    return {
      profiles: seedProfiles,
      swipes: initialIncomingLikes,
      matches: []
    };
  }

  /**
   * Helper to ensure the DAL has been initialized.
   */
  async _ensureReady() {
    if (!this.initialized) {
      await this.initialize();
    }
  }

  /**
   * GET /feed
   * Returns profiles not yet swiped on by the given user.
   * Strips any internal swipe signals (does NOT expose incoming likes).
   */
  async getFeed(userId = this.currentUserId) {
    await this._ensureReady();
    const runtime = await this.storage.read();

    // Collect all target profiles the user has already swiped on
    const swipedTargetIds = new Set(
      runtime.swipes
        .filter((s) => s.swiperId === userId)
        .map((s) => s.targetProfileId)
    );

    // Filter profiles:
    // 1. Exclude the user themselves
    // 2. Exclude profiles the user has already swiped on
    const availableProfiles = runtime.profiles.filter(
      (profile) => profile.id !== userId && !swipedTargetIds.has(profile.id)
    );

    // Return sanitized profile objects with exact model fields
    return availableProfiles.map((p) => ({
      id: p.id,
      name: p.name,
      age: p.age,
      photo: p.photo,
      bio: p.bio,
      cityOrCollege: p.cityOrCollege,
      interests: p.interests
    }));
  }

  /**
   * POST /swipe
   * Records a LIKE or PASS swipe and checks for a mutual match.
   * Enforces:
   * - A user can swipe on a profile only once.
   * - Valid action (LIKE or PASS).
   * - Target profile must exist.
   * - Store matches only when both users have liked each other.
   * - Atomic and serialized write to runtime.json using storage transaction.
   */
  async recordSwipe({ swiperId = this.currentUserId, targetProfileId, action }) {
    await this._ensureReady();

    // Input Validation
    if (!targetProfileId || typeof targetProfileId !== 'string') {
      throw new ValidationError('targetProfileId is required and must be a string.');
    }

    if (action !== 'LIKE' && action !== 'PASS') {
      throw new ValidationError(`Invalid action "${action}". Action must be either "LIKE" or "PASS".`);
    }

    if (swiperId === targetProfileId) {
      throw new ValidationError('Users cannot swipe on their own profile.');
    }

    // Execute through serialized transaction queue to prevent race conditions
    return this.storage.transaction(async (runtime) => {
      // Check if target profile exists
      const targetProfile = runtime.profiles.find((p) => p.id === targetProfileId);
      if (!targetProfile) {
        throw new NotFoundError(`Profile with id "${targetProfileId}" not found.`);
      }

      // Enforce single-swipe rule
      const alreadySwiped = runtime.swipes.some(
        (s) => s.swiperId === swiperId && s.targetProfileId === targetProfileId
      );
      if (alreadySwiped) {
        throw new DuplicateSwipeError(`User "${swiperId}" has already swiped on profile "${targetProfileId}".`);
      }

      // Create new Swipe record
      const newSwipe = {
        swiperId,
        targetProfileId,
        action,
        createdAt: new Date().toISOString()
      };
      runtime.swipes.push(newSwipe);

      let isMatch = false;
      let matchRecord = null;

      // Check for mutual match
      if (action === 'LIKE') {
        const otherUserLikedBack = runtime.swipes.some(
          (s) => s.swiperId === targetProfileId && s.targetProfileId === swiperId && s.action === 'LIKE'
        );

        if (otherUserLikedBack) {
          isMatch = true;

          // Check if match record already exists
          matchRecord = runtime.matches.find(
            (m) =>
              (m.user1Id === swiperId && m.user2Id === targetProfileId) ||
              (m.user1Id === targetProfileId && m.user2Id === swiperId)
          );

          if (!matchRecord) {
            matchRecord = {
              id: crypto.randomUUID(),
              user1Id: swiperId,
              user2Id: targetProfileId,
              createdAt: new Date().toISOString()
            };
            runtime.matches.push(matchRecord);
          }
        }
      }

      const result = {
        swipe: newSwipe,
        isMatch,
        match: matchRecord || null,
        matchedProfile: isMatch ? targetProfile : null
      };

      return {
        updatedData: runtime,
        result
      };
    });
  }

  /**
   * GET /matches
   * Returns mutual matches for the user.
   * Only returns matches where BOTH users have liked each other.
   */
  async getMatches(userId = this.currentUserId) {
    await this._ensureReady();
    const runtime = await this.storage.read();

    const userMatches = runtime.matches.filter(
      (m) => m.user1Id === userId || m.user2Id === userId
    );

    // Map each match to include the other user's profile details
    return userMatches.map((match) => {
      const otherUserId = match.user1Id === userId ? match.user2Id : match.user1Id;
      const otherProfile = runtime.profiles.find((p) => p.id === otherUserId) || {
        id: otherUserId,
        name: 'Unknown User'
      };

      return {
        id: match.id,
        matchedUserId: otherUserId,
        createdAt: match.createdAt,
        profile: otherProfile
      };
    });
  }

  /**
   * Helper to retrieve full runtime summary/stats for verification
   */
  async getStats(userId = this.currentUserId) {
    await this._ensureReady();
    const runtime = await this.storage.read();
    const userSwipes = runtime.swipes.filter((s) => s.swiperId === userId);
    const userMatches = runtime.matches.filter((m) => m.user1Id === userId || m.user2Id === userId);

    return {
      totalProfiles: runtime.profiles.length,
      totalSwipes: runtime.swipes.length,
      userSwipes: userSwipes.length,
      userMatches: userMatches.length,
      currentUserId: userId
    };
  }
}
