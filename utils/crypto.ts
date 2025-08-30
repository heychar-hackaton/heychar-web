import crypto from 'node:crypto';

// Reads ENCRYPTION_KEY from env. Supports base64 (preferred) and hex.
function loadKey(): Buffer {
  const raw = process.env.ENCRYPTION_KEY || '';
  if (!raw) {
    throw new Error('ENCRYPTION_KEY is not set');
  }

  // Try base64 first, then hex
  const tryBase64 = () => {
    try {
      const buf = Buffer.from(raw, 'base64');
      return buf.length === 32 ? buf : null;
    } catch {
      return null;
    }
  };
  const tryHex = () => {
    try {
      const buf = Buffer.from(raw, 'hex');
      return buf.length === 32 ? buf : null;
    } catch {
      return null;
    }
  };

  const key = tryBase64() ?? tryHex();
  if (!key) {
    throw new Error('ENCRYPTION_KEY must decode to 32 bytes (base64 or hex)');
  }
  return key;
}

const KEY = loadKey();

export type EncryptedPayload = {
  // Base64-encoded values
  iv: string; // 12 bytes
  tag: string; // 16 bytes auth tag
  ciphertext: string;
};

export function encryptString(plain: string, aad?: string): EncryptedPayload {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', KEY, iv);
  if (aad) {
    cipher.setAAD(Buffer.from(aad, 'utf8'));
  }
  const enc = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return {
    iv: iv.toString('base64'),
    tag: tag.toString('base64'),
    ciphertext: enc.toString('base64'),
  };
}

export function decryptString(payload: EncryptedPayload, aad?: string): string {
  const iv = Buffer.from(payload.iv, 'base64');
  const tag = Buffer.from(payload.tag, 'base64');
  const ciphertext = Buffer.from(payload.ciphertext, 'base64');
  const decipher = crypto.createDecipheriv('aes-256-gcm', KEY, iv);
  if (aad) {
    decipher.setAAD(Buffer.from(aad, 'utf8'));
  }
  decipher.setAuthTag(tag);
  const dec = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  return dec.toString('utf8');
}

// Helper to pack/unpack to a single string for DB storage
export function pack(payload: EncryptedPayload): string {
  return JSON.stringify(payload);
}

export function unpack(packed: string): EncryptedPayload {
  return JSON.parse(packed) as EncryptedPayload;
}
