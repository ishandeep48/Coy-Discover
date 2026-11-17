import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

/**
 * FileStorage
 * 
 * Manages low-level atomic JSON file persistence with serialized write queue.
 * - Writes to a temporary file first (.tmp).
 * - Renames temporary file to destination file atomically.
 * - Chains all write operations through a promise queue to guarantee serialization
 *   and prevent concurrent race conditions.
 * - Handles Windows file locking with exponential/backoff retries.
 */
export class FileStorage {
  constructor(targetFilePath) {
    this.targetFilePath = path.resolve(targetFilePath);
    this.dirPath = path.dirname(this.targetFilePath);
    // Promise queue to serialize all write transactions
    this.writeQueue = Promise.resolve();
  }

  /**
   * Ensures the enclosing directory exists.
   */
  async ensureDirectory() {
    await fs.mkdir(this.dirPath, { recursive: true });
  }

  /**
   * Reads and parses JSON safely.
   * Returns null if file does not exist (ENOENT).
   * Throws on corrupted JSON or other filesystem errors.
   */
  async read() {
    try {
      const raw = await fs.readFile(this.targetFilePath, 'utf-8');
      return JSON.parse(raw);
    } catch (err) {
      if (err.code === 'ENOENT') {
        return null;
      }
      if (err instanceof SyntaxError) {
        throw new Error(`Corrupted JSON detected in ${this.targetFilePath}: ${err.message}`);
      }
      throw err;
    }
  }

  /**
   * Directly writes data atomically (serialized).
   */
  async write(data) {
    return this.transaction(async () => {
      return { updatedData: data, result: data };
    });
  }

  /**
   * Serialized transaction runner.
   * Ensures the read-modify-write cycle is completely serialized:
   * 1. Waits for previous queued transactions to finish.
   * 2. Reads the freshest data.
   * 3. Calls updateFn(currentData).
   * 4. Atomically persists updatedData to disk.
   * 5. Resolves with updateFn's result.
   */
  async transaction(updateFn) {
    return new Promise((resolve, reject) => {
      this.writeQueue = this.writeQueue
        .then(async () => {
          try {
            const currentData = await this.read();
            const { updatedData, result } = await updateFn(currentData);
            await this._atomicWrite(updatedData);
            resolve(result);
          } catch (err) {
            reject(err);
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  /**
   * Performs the atomic write:
   * 1. Create temp file in the SAME directory (ensures same filesystem partition).
   * 2. Write payload to temp file.
   * 3. Atomically rename temp file to target.
   * 4. Cleans up temp file if any step fails.
   */
  async _atomicWrite(data) {
    await this.ensureDirectory();

    const randomSuffix = crypto.randomBytes(6).toString('hex');
    const tempFileName = `.${path.basename(this.targetFilePath)}.${Date.now()}.${randomSuffix}.tmp`;
    const tempFilePath = path.join(this.dirPath, tempFileName);

    const serialized = JSON.stringify(data, null, 2);

    try {
      // 1. Write to temporary file
      await fs.writeFile(tempFilePath, serialized, 'utf-8');

      // 2. Atomically rename to destination (with retries for Windows filesystem locks)
      await this._atomicRenameWithRetry(tempFilePath, this.targetFilePath);
    } catch (err) {
      // Clean up temp file on failure
      try {
        await fs.unlink(tempFilePath);
      } catch (_) {
        // ignore unlink error
      }
      throw new Error(`Failed to write atomically to ${this.targetFilePath}: ${err.message}`);
    }
  }

  /**
   * Windows filesystem may intermittently lock files during indexing/antivirus scans.
   * Retry loop ensures reliable atomic replacement.
   */
  async _atomicRenameWithRetry(source, destination, maxRetries = 6, delayMs = 30) {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        await fs.rename(source, destination);
        return;
      } catch (err) {
        if ((err.code === 'EPERM' || err.code === 'EBUSY') && attempt < maxRetries - 1) {
          await new Promise((resolve) => setTimeout(resolve, delayMs * (attempt + 1)));
          continue;
        }
        throw err;
      }
    }
  }
}
