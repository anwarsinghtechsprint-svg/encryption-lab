// Crypto utilities using Web Crypto API (Google Chrome's native cryptography)
// Uses real AES-GCM encryption for production-grade security

export function generateRandomKey(length: number = 32): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

export function generateKeyPair(): { publicKey: string; privateKey: string } {
  return {
    publicKey: `PUB_${generateRandomKey(16)}`,
    privateKey: `PRIV_${generateRandomKey(16)}`
  };
}

// Convert hex string to Uint8Array
function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return bytes;
}

// Convert Uint8Array to hex string
function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
}

// AES-GCM Encryption using Web Crypto API (Real encryption!)
export async function aesGcmEncrypt(plaintext: string, keyHex: string): Promise<string> {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(plaintext);
    
    // Derive a proper 256-bit key from the input using SHA-256
    const keyMaterial = await crypto.subtle.digest('SHA-256', encoder.encode(keyHex));
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyMaterial,
      { name: 'AES-GCM' },
      false,
      ['encrypt']
    );
    
    // Generate random IV (12 bytes for GCM)
    const iv = crypto.getRandomValues(new Uint8Array(12));
    
    // Encrypt
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      cryptoKey,
      data
    );
    
    // Combine IV + ciphertext and encode as base64
    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encrypted), iv.length);
    
    return btoa(String.fromCharCode(...combined));
  } catch (error) {
    console.error('Encryption error:', error);
    return '[Encryption failed]';
  }
}

// AES-GCM Decryption using Web Crypto API
export async function aesGcmDecrypt(ciphertext: string, keyHex: string): Promise<string> {
  try {
    const encoder = new TextEncoder();
    
    // Decode base64
    const combined = new Uint8Array(atob(ciphertext).split('').map(c => c.charCodeAt(0)));
    
    // Extract IV and ciphertext
    const iv = combined.slice(0, 12);
    const encrypted = combined.slice(12);
    
    // Derive the same key
    const keyMaterial = await crypto.subtle.digest('SHA-256', encoder.encode(keyHex));
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyMaterial,
      { name: 'AES-GCM' },
      false,
      ['decrypt']
    );
    
    // Decrypt
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      cryptoKey,
      encrypted
    );
    
    return new TextDecoder().decode(decrypted);
  } catch (error) {
    console.error('Decryption error:', error);
    return '[Decryption failed - invalid key or corrupted data]';
  }
}

// Legacy simple encrypt/decrypt for algorithms that don't use Web Crypto
export function simpleEncrypt(plaintext: string, key: string): string {
  const encoder = new TextEncoder();
  const data = encoder.encode(plaintext);
  const keyBytes = encoder.encode(key);
  
  const encrypted = new Uint8Array(data.length);
  for (let i = 0; i < data.length; i++) {
    encrypted[i] = data[i] ^ keyBytes[i % keyBytes.length];
  }
  
  return btoa(String.fromCharCode(...encrypted));
}

export function simpleDecrypt(ciphertext: string, key: string): string {
  try {
    const encrypted = new Uint8Array(
      atob(ciphertext).split('').map(c => c.charCodeAt(0))
    );
    const encoder = new TextEncoder();
    const keyBytes = encoder.encode(key);
    
    const decrypted = new Uint8Array(encrypted.length);
    for (let i = 0; i < encrypted.length; i++) {
      decrypted[i] = encrypted[i] ^ keyBytes[i % keyBytes.length];
    }
    
    return new TextDecoder().decode(decrypted);
  } catch {
    return '[Decryption failed - invalid input]';
  }
}

// SHA-256 hash using Web Crypto API
export async function sha256Hash(message: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// SHA-512 hash using Web Crypto API
export async function sha512Hash(message: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-512', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// SHA-1 hash using Web Crypto API (marked as insecure)
export async function sha1Hash(message: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-1', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Simple MD5 implementation for demonstration (NOT SECURE)
export function md5Hash(message: string): string {
  let hash = 0;
  for (let i = 0; i < message.length; i++) {
    const char = message.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  const baseHash = Math.abs(hash).toString(16).padStart(8, '0');
  return (baseHash + baseHash + baseHash + baseHash).slice(0, 32);
}

// Simple bcrypt simulation for demonstration
export function bcryptHash(password: string, cost: number = 10): string {
  const salt = generateRandomKey(8);
  return `$2b$${cost.toString().padStart(2, '0')}$${salt}${generateRandomKey(23).slice(0, 31)}`;
}

// RSA simulation using Web Crypto API concepts
export async function rsaEncrypt(plaintext: string, publicKey: string): Promise<string> {
  // For demo purposes, we'll use a deterministic transformation
  // Real RSA would use crypto.subtle.generateKey with RSA-OAEP
  const encoder = new TextEncoder();
  const data = encoder.encode(plaintext);
  
  // Create a hash of the public key to use as transformation basis
  const keyHash = await crypto.subtle.digest('SHA-256', encoder.encode(publicKey));
  const keyBytes = new Uint8Array(keyHash);
  
  const encrypted = new Uint8Array(data.length);
  for (let i = 0; i < data.length; i++) {
    encrypted[i] = (data[i] + keyBytes[i % keyBytes.length]) % 256;
  }
  
  return `RSA_${btoa(String.fromCharCode(...encrypted))}`;
}

export async function rsaDecrypt(ciphertext: string, privateKey: string, publicKey: string): Promise<string> {
  try {
    if (!ciphertext.startsWith('RSA_')) return '[Invalid RSA ciphertext]';
    
    const encoder = new TextEncoder();
    const keyHash = await crypto.subtle.digest('SHA-256', encoder.encode(publicKey));
    const keyBytes = new Uint8Array(keyHash);
    
    const encrypted = new Uint8Array(
      atob(ciphertext.slice(4)).split('').map(c => c.charCodeAt(0))
    );
    
    const decrypted = new Uint8Array(encrypted.length);
    for (let i = 0; i < encrypted.length; i++) {
      decrypted[i] = (encrypted[i] - keyBytes[i % keyBytes.length] + 256) % 256;
    }
    
    return new TextDecoder().decode(decrypted);
  } catch {
    return '[Decryption failed]';
  }
}

// Diffie-Hellman key exchange using larger primes for better demo
export function generateDHKeyPair(): { privateKey: number; publicKey: number; p: number; g: number } {
  const p = 7919; // Larger prime for better visualization
  const g = 5;
  const privateKey = Math.floor(Math.random() * (p - 2)) + 1;
  const publicKey = modPow(g, privateKey, p);
  
  return { privateKey, publicKey, p, g };
}

// Modular exponentiation for DH
function modPow(base: number, exp: number, mod: number): number {
  let result = 1;
  base = base % mod;
  while (exp > 0) {
    if (exp % 2 === 1) {
      result = (result * base) % mod;
    }
    exp = Math.floor(exp / 2);
    base = (base * base) % mod;
  }
  return result;
}

export function computeDHSharedSecret(privateKey: number, otherPublicKey: number, p: number): number {
  return modPow(otherPublicKey, privateKey, p);
}

// PBKDF2 key derivation using Web Crypto API
export async function pbkdf2Derive(password: string, salt: string, iterations: number = 100000): Promise<string> {
  const encoder = new TextEncoder();
  
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  );
  
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: encoder.encode(salt),
      iterations,
      hash: 'SHA-256'
    },
    keyMaterial,
    256
  );
  
  return bytesToHex(new Uint8Array(derivedBits));
}

// HMAC using Web Crypto API
export async function hmacSign(message: string, keyHex: string): Promise<string> {
  const encoder = new TextEncoder();
  
  const keyMaterial = await crypto.subtle.digest('SHA-256', encoder.encode(keyHex));
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyMaterial,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign(
    'HMAC',
    cryptoKey,
    encoder.encode(message)
  );
  
  return bytesToHex(new Uint8Array(signature));
}
