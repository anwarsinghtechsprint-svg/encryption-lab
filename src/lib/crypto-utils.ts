// Simple crypto utilities for educational demonstration
// Note: These are simplified implementations for learning purposes

export function generateRandomKey(length: number = 32): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

export function generateKeyPair(): { publicKey: string; privateKey: string } {
  // Simulated key pair for demonstration
  return {
    publicKey: `PUB_${generateRandomKey(16)}`,
    privateKey: `PRIV_${generateRandomKey(16)}`
  };
}

// Simple XOR-based encryption for demonstration (NOT SECURE - educational only)
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

// Simple MD5 implementation for demonstration (NOT SECURE)
export function md5Hash(message: string): string {
  // Simplified MD5 simulation - returns a deterministic "hash-like" output
  let hash = 0;
  for (let i = 0; i < message.length; i++) {
    const char = message.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  // Generate a 32-char hex string that looks like MD5
  const baseHash = Math.abs(hash).toString(16).padStart(8, '0');
  return (baseHash + baseHash + baseHash + baseHash).slice(0, 32);
}

// Simple bcrypt simulation for demonstration
export function bcryptHash(password: string, cost: number = 10): string {
  const salt = generateRandomKey(8);
  // Simulated bcrypt output format
  return `$2b$${cost.toString().padStart(2, '0')}$${salt}${generateRandomKey(23).slice(0, 31)}`;
}

// RSA simulation for demonstration
export function rsaEncrypt(plaintext: string, publicKey: string): string {
  // Simulated RSA encryption - XOR with key hash for demo
  const keyHash = publicKey.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const encoder = new TextEncoder();
  const data = encoder.encode(plaintext);
  
  const encrypted = new Uint8Array(data.length);
  for (let i = 0; i < data.length; i++) {
    encrypted[i] = (data[i] + keyHash + i) % 256;
  }
  
  return `RSA_${btoa(String.fromCharCode(...encrypted))}`;
}

export function rsaDecrypt(ciphertext: string, privateKey: string, publicKey: string): string {
  try {
    if (!ciphertext.startsWith('RSA_')) return '[Invalid RSA ciphertext]';
    
    const keyHash = publicKey.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    const encrypted = new Uint8Array(
      atob(ciphertext.slice(4)).split('').map(c => c.charCodeAt(0))
    );
    
    const decrypted = new Uint8Array(encrypted.length);
    for (let i = 0; i < encrypted.length; i++) {
      decrypted[i] = (encrypted[i] - keyHash - i + 256 * 10) % 256;
    }
    
    return new TextDecoder().decode(decrypted);
  } catch {
    return '[Decryption failed]';
  }
}

// Diffie-Hellman key exchange simulation
export function generateDHKeyPair(): { privateKey: number; publicKey: number; p: number; g: number } {
  const p = 23; // Small prime for demo
  const g = 5;  // Generator
  const privateKey = Math.floor(Math.random() * (p - 2)) + 1;
  const publicKey = Math.pow(g, privateKey) % p;
  
  return { privateKey, publicKey, p, g };
}

export function computeDHSharedSecret(privateKey: number, otherPublicKey: number, p: number): number {
  return Math.pow(otherPublicKey, privateKey) % p;
}
