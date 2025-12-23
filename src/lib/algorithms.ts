export type AlgorithmType = 'symmetric' | 'asymmetric' | 'hashing';
export type SecurityLevel = 'high' | 'medium' | 'broken';

export interface Algorithm {
  id: string;
  name: string;
  type: AlgorithmType;
  securityLevel: SecurityLevel;
  keySize: string;
  speed: string;
  description: string;
  whyUsed: string;
  realWorldUsage: string[];
  flowSteps: FlowStep[];
  warnings?: string[];
  canDecrypt: boolean;
}

export interface FlowStep {
  label: string;
  description: string;
  icon: 'input' | 'key' | 'process' | 'output' | 'lock' | 'unlock';
}

export const algorithms: Algorithm[] = [
  // Symmetric Encryption
  {
    id: 'aes',
    name: 'AES (Advanced Encryption Standard)',
    type: 'symmetric',
    securityLevel: 'high',
    keySize: '128/192/256 bits',
    speed: 'Very Fast',
    description: 'AES is a symmetric block cipher chosen by the U.S. government to protect classified information. It encrypts data in fixed-size blocks of 128 bits using keys of 128, 192, or 256 bits.',
    whyUsed: 'AES is the gold standard for symmetric encryption due to its security, efficiency, and widespread hardware support. It resists all known practical attacks when used correctly.',
    realWorldUsage: ['HTTPS/TLS encryption', 'Full disk encryption (BitLocker, FileVault)', 'Wi-Fi WPA2/WPA3', 'VPN tunnels', 'Cloud storage encryption'],
    flowSteps: [
      { label: 'Plaintext', description: 'Original message to encrypt', icon: 'input' },
      { label: 'Secret Key', description: '128/192/256-bit symmetric key', icon: 'key' },
      { label: 'AES Encryption', description: 'Multiple rounds of substitution, permutation, and mixing', icon: 'process' },
      { label: 'Ciphertext', description: 'Encrypted output (same size as input)', icon: 'output' }
    ],
    canDecrypt: true
  },
  {
    id: 'chacha20',
    name: 'ChaCha20',
    type: 'symmetric',
    securityLevel: 'high',
    keySize: '256 bits',
    speed: 'Very Fast',
    description: 'ChaCha20 is a stream cipher designed by Daniel Bernstein. It generates a keystream that is XORed with plaintext to produce ciphertext. It\'s designed to be fast in software.',
    whyUsed: 'ChaCha20 is an alternative to AES that performs better on devices without hardware AES acceleration. It\'s simpler to implement securely and resistant to timing attacks.',
    realWorldUsage: ['TLS 1.3 cipher suite', 'Google Chrome', 'WireGuard VPN', 'SSH', 'Mobile device encryption'],
    flowSteps: [
      { label: 'Plaintext', description: 'Message to encrypt', icon: 'input' },
      { label: 'Key + Nonce', description: '256-bit key and 96-bit nonce', icon: 'key' },
      { label: 'ChaCha20 Stream', description: 'Generates pseudorandom keystream', icon: 'process' },
      { label: 'Ciphertext', description: 'XOR of plaintext and keystream', icon: 'output' }
    ],
    canDecrypt: true
  },
  
  // Asymmetric Encryption
  {
    id: 'rsa',
    name: 'RSA (Rivest-Shamir-Adleman)',
    type: 'asymmetric',
    securityLevel: 'high',
    keySize: '2048-4096 bits',
    speed: 'Slow',
    description: 'RSA is one of the first public-key cryptosystems. Security is based on the difficulty of factoring large prime numbers. Uses a public key for encryption and private key for decryption.',
    whyUsed: 'RSA enables secure key exchange without prior shared secrets. It\'s used for digital signatures and encrypting small amounts of data like symmetric keys.',
    realWorldUsage: ['SSL/TLS certificates', 'Email encryption (PGP/GPG)', 'Digital signatures', 'Secure key exchange', 'Code signing'],
    flowSteps: [
      { label: 'Plaintext', description: 'Message to encrypt', icon: 'input' },
      { label: 'Public Key', description: 'Recipient\'s public key (n, e)', icon: 'key' },
      { label: 'RSA Encryption', description: 'Modular exponentiation: c = m^e mod n', icon: 'lock' },
      { label: 'Ciphertext', description: 'Encrypted message', icon: 'output' },
      { label: 'Private Key', description: 'Recipient\'s private key (d)', icon: 'key' },
      { label: 'RSA Decryption', description: 'Modular exponentiation: m = c^d mod n', icon: 'unlock' }
    ],
    canDecrypt: true
  },
  {
    id: 'ecc',
    name: 'ECC (Elliptic Curve Cryptography)',
    type: 'asymmetric',
    securityLevel: 'high',
    keySize: '256-384 bits',
    speed: 'Fast',
    description: 'ECC uses the algebraic structure of elliptic curves over finite fields. It provides the same security as RSA with much smaller keys, making it ideal for constrained environments.',
    whyUsed: 'ECC offers stronger security per bit than RSA, resulting in smaller keys, faster operations, and lower power consumption. Ideal for mobile and IoT devices.',
    realWorldUsage: ['Bitcoin/Ethereum wallets', 'TLS 1.3', 'Apple\'s Secure Enclave', 'WhatsApp encryption', 'Smart cards'],
    flowSteps: [
      { label: 'Message', description: 'Data to encrypt or sign', icon: 'input' },
      { label: 'EC Key Pair', description: 'Private scalar + public point on curve', icon: 'key' },
      { label: 'Point Multiplication', description: 'Scalar multiplication on elliptic curve', icon: 'process' },
      { label: 'Output', description: 'Encrypted data or signature', icon: 'output' }
    ],
    canDecrypt: true
  },
  {
    id: 'diffie-hellman',
    name: 'Diffie-Hellman Key Exchange',
    type: 'asymmetric',
    securityLevel: 'high',
    keySize: '2048+ bits',
    speed: 'Medium',
    description: 'Diffie-Hellman allows two parties to establish a shared secret over an insecure channel. Neither party\'s private key is ever transmitted, only public values.',
    whyUsed: 'DH enables secure key establishment without pre-shared secrets. It\'s fundamental to establishing session keys in protocols like TLS and VPNs.',
    realWorldUsage: ['TLS handshake', 'VPN key exchange', 'SSH key negotiation', 'IPsec', 'Signal Protocol'],
    flowSteps: [
      { label: 'Public Parameters', description: 'Prime p and generator g', icon: 'input' },
      { label: 'Private Keys', description: 'Alice: a, Bob: b (secret)', icon: 'key' },
      { label: 'Public Exchange', description: 'A = g^a mod p, B = g^b mod p', icon: 'process' },
      { label: 'Shared Secret', description: 'Both compute: s = B^a = A^b mod p', icon: 'output' }
    ],
    canDecrypt: false
  },
  
  // Hashing Algorithms
  {
    id: 'sha256',
    name: 'SHA-256',
    type: 'hashing',
    securityLevel: 'high',
    keySize: 'N/A (256-bit output)',
    speed: 'Fast',
    description: 'SHA-256 is part of the SHA-2 family. It produces a 256-bit (32-byte) hash value, typically rendered as a 64-character hexadecimal number. It\'s a one-way function.',
    whyUsed: 'SHA-256 is collision-resistant and preimage-resistant, making it ideal for data integrity verification, digital signatures, and blockchain proof-of-work.',
    realWorldUsage: ['Bitcoin mining', 'SSL/TLS certificates', 'Git commit hashes', 'File integrity checks', 'Digital signatures'],
    flowSteps: [
      { label: 'Input', description: 'Any length message', icon: 'input' },
      { label: 'Padding', description: 'Message padded to multiple of 512 bits', icon: 'process' },
      { label: 'Compression', description: '64 rounds of bitwise operations', icon: 'process' },
      { label: 'Hash', description: 'Fixed 256-bit output', icon: 'output' }
    ],
    canDecrypt: false
  },
  {
    id: 'sha512',
    name: 'SHA-512',
    type: 'hashing',
    securityLevel: 'high',
    keySize: 'N/A (512-bit output)',
    speed: 'Fast',
    description: 'SHA-512 produces a 512-bit hash. It uses 64-bit words (vs 32-bit in SHA-256) and 80 rounds. Often faster than SHA-256 on 64-bit processors.',
    whyUsed: 'SHA-512 provides a larger hash output for applications requiring extra security margin. It\'s also faster on 64-bit architectures.',
    realWorldUsage: ['Password hashing (with salt)', 'Secure storage checksums', 'Digital certificates', 'Blockchain applications', 'HMAC constructions'],
    flowSteps: [
      { label: 'Input', description: 'Any length message', icon: 'input' },
      { label: 'Padding', description: 'Message padded to multiple of 1024 bits', icon: 'process' },
      { label: 'Compression', description: '80 rounds of 64-bit operations', icon: 'process' },
      { label: 'Hash', description: 'Fixed 512-bit output', icon: 'output' }
    ],
    canDecrypt: false
  },
  {
    id: 'md5',
    name: 'MD5',
    type: 'hashing',
    securityLevel: 'broken',
    keySize: 'N/A (128-bit output)',
    speed: 'Very Fast',
    description: 'MD5 produces a 128-bit hash value. It was designed in 1991 and was widely used, but cryptographic weaknesses have been discovered making it unsuitable for security.',
    whyUsed: 'MD5 is still used for non-security checksums (file verification) where collision attacks are not a concern. It should NEVER be used for passwords or security.',
    realWorldUsage: ['Legacy file checksums', 'Non-security checksums', '⚠️ NOT for passwords', '⚠️ NOT for signatures'],
    flowSteps: [
      { label: 'Input', description: 'Any length message', icon: 'input' },
      { label: 'Padding', description: 'Pad to 512-bit boundary', icon: 'process' },
      { label: 'Compression', description: '4 rounds of 16 operations', icon: 'process' },
      { label: 'Hash', description: '128-bit output (WEAK!)', icon: 'output' }
    ],
    warnings: [
      'Collision attacks discovered in 2004',
      'Can create two different files with same MD5 hash',
      'Should NOT be used for passwords or certificates',
      'Replace with SHA-256 for any security purpose'
    ],
    canDecrypt: false
  },
  {
    id: 'bcrypt',
    name: 'bcrypt',
    type: 'hashing',
    securityLevel: 'high',
    keySize: 'N/A (184-bit output)',
    speed: 'Intentionally Slow',
    description: 'bcrypt is a password hashing function designed to be computationally expensive. It includes a salt and a configurable work factor to slow down brute-force attacks.',
    whyUsed: 'bcrypt is specifically designed for password hashing. Its adjustable cost factor means it can be made slower as hardware improves, maintaining security over time.',
    realWorldUsage: ['Password storage', 'User authentication systems', 'Django/Rails default hasher', 'Many web frameworks', 'Industry standard for passwords'],
    flowSteps: [
      { label: 'Password', description: 'User password input', icon: 'input' },
      { label: 'Salt', description: 'Random 128-bit salt', icon: 'key' },
      { label: 'Expensive Key Setup', description: 'Blowfish key schedule (2^cost iterations)', icon: 'process' },
      { label: 'Hash', description: '184-bit hash with embedded salt', icon: 'output' }
    ],
    canDecrypt: false
  }
];

export const algorithmCategories = [
  {
    name: 'Symmetric Encryption',
    description: 'Same key for encryption and decryption',
    algorithms: algorithms.filter(a => a.type === 'symmetric')
  },
  {
    name: 'Asymmetric Encryption',
    description: 'Public/private key pairs',
    algorithms: algorithms.filter(a => a.type === 'asymmetric')
  },
  {
    name: 'Hashing Algorithms',
    description: 'One-way functions for data integrity',
    algorithms: algorithms.filter(a => a.type === 'hashing')
  }
];

export function getSecurityLevelColor(level: SecurityLevel): string {
  switch (level) {
    case 'high': return 'text-primary';
    case 'medium': return 'text-chart-4';
    case 'broken': return 'text-destructive';
  }
}

export function getSecurityLevelBadge(level: SecurityLevel): { label: string; variant: 'default' | 'secondary' | 'destructive' } {
  switch (level) {
    case 'high': return { label: 'High Security', variant: 'default' };
    case 'medium': return { label: 'Medium Security', variant: 'secondary' };
    case 'broken': return { label: 'Broken / Insecure', variant: 'destructive' };
  }
}

export function getTypeLabel(type: AlgorithmType): string {
  switch (type) {
    case 'symmetric': return 'Symmetric';
    case 'asymmetric': return 'Asymmetric';
    case 'hashing': return 'Hashing';
  }
}

export function getTypeIcon(type: AlgorithmType): 'key' | 'keys' | 'hash' {
  switch (type) {
    case 'symmetric': return 'key';
    case 'asymmetric': return 'keys';
    case 'hashing': return 'hash';
  }
}
