import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Root directories
const backendRoot = path.resolve(__dirname, '..');
const repoRoot = path.resolve(backendRoot, '..');

// Find seed file location (supports running from repo root or Backend directory)
function resolveSeedPath() {
  const candidates = [
    path.join(backendRoot, 'seed', 'profiles.json'),
    path.join(repoRoot, 'seed', 'profiles.json'),
    path.join(process.cwd(), 'seed', 'profiles.json')
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }
  return candidates[0]; // fallback
}

// Find or set data directory
function resolveDataPath() {
  const dataDir = process.env.DATA_DIR 
    ? path.resolve(process.env.DATA_DIR) 
    : path.join(backendRoot, 'data');
  return path.join(dataDir, 'runtime.json');
}

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  // Centralized consistent ID for the assumed single logged-in user
  currentUserId: process.env.CURRENT_USER_ID || 'current_user',
  seedFilePath: resolveSeedPath(),
  runtimeFilePath: resolveDataPath()
};
