export type EncryptionMode = {
  id: string;
  name: string;
  fullName: string;
  description: string;
  howItWorks: string;
  pros: string[];
  cons: string[];
  useCases: string[];
  securityLevel: 'high' | 'medium' | 'low';
  requiresIV: boolean;
  requiresNonce: boolean;
  providesAuthentication: boolean;
  parallelizable: boolean;
  blocks: BlockStep[];
};

export type BlockStep = {
  id: string;
  label: string;
  type: 'plaintext' | 'ciphertext' | 'iv' | 'nonce' | 'counter' | 'xor' | 'encrypt' | 'auth' | 'tag';
  row: number;
  col: number;
  connections?: { to: string; label?: string }[];
};

export const encryptionModes: EncryptionMode[] = [
  {
    id: 'ecb',
    name: 'ECB',
    fullName: 'Electronic Codebook',
    description: 'The simplest mode where each block is encrypted independently with the same key. This is insecure for most use cases because identical plaintext blocks produce identical ciphertext blocks.',
    howItWorks: 'Each plaintext block is encrypted directly with the key. No chaining or initialization vector is used. The same plaintext always produces the same ciphertext.',
    pros: [
      'Simple to implement',
      'Parallelizable encryption and decryption',
      'No IV/nonce required'
    ],
    cons: [
      'Patterns in plaintext visible in ciphertext',
      'Identical blocks encrypt to identical ciphertext',
      'Vulnerable to block substitution attacks',
      'NOT recommended for most uses'
    ],
    useCases: [
      'Encrypting single random values',
      'Legacy systems (avoid if possible)'
    ],
    securityLevel: 'low',
    requiresIV: false,
    requiresNonce: false,
    providesAuthentication: false,
    parallelizable: true,
    blocks: [
      { id: 'p1', label: 'Block 1', type: 'plaintext', row: 0, col: 0 },
      { id: 'p2', label: 'Block 2', type: 'plaintext', row: 0, col: 1 },
      { id: 'p3', label: 'Block 3', type: 'plaintext', row: 0, col: 2 },
      { id: 'e1', label: 'AES', type: 'encrypt', row: 1, col: 0, connections: [{ to: 'c1' }] },
      { id: 'e2', label: 'AES', type: 'encrypt', row: 1, col: 1, connections: [{ to: 'c2' }] },
      { id: 'e3', label: 'AES', type: 'encrypt', row: 1, col: 2, connections: [{ to: 'c3' }] },
      { id: 'c1', label: 'Cipher 1', type: 'ciphertext', row: 2, col: 0 },
      { id: 'c2', label: 'Cipher 2', type: 'ciphertext', row: 2, col: 1 },
      { id: 'c3', label: 'Cipher 3', type: 'ciphertext', row: 2, col: 2 }
    ]
  },
  {
    id: 'cbc',
    name: 'CBC',
    fullName: 'Cipher Block Chaining',
    description: 'Each plaintext block is XORed with the previous ciphertext block before encryption. This creates a chain where each block depends on all previous blocks, hiding patterns in the plaintext.',
    howItWorks: 'An Initialization Vector (IV) is XORed with the first plaintext block. Each subsequent plaintext block is XORed with the previous ciphertext block before encryption. This creates a dependency chain.',
    pros: [
      'Hides patterns in plaintext',
      'Each ciphertext block depends on all previous blocks',
      'Widely supported and well-understood'
    ],
    cons: [
      'Cannot parallelize encryption',
      'Padding oracle attacks possible if not authenticated',
      'Error in one block affects subsequent blocks',
      'Requires padding for non-block-aligned data'
    ],
    useCases: [
      'File encryption',
      'Disk encryption',
      'TLS (older versions)',
      'Database encryption'
    ],
    securityLevel: 'medium',
    requiresIV: true,
    requiresNonce: false,
    providesAuthentication: false,
    parallelizable: false,
    blocks: [
      { id: 'iv', label: 'IV', type: 'iv', row: 0, col: 0, connections: [{ to: 'x1' }] },
      { id: 'p1', label: 'Block 1', type: 'plaintext', row: 0, col: 1, connections: [{ to: 'x1' }] },
      { id: 'p2', label: 'Block 2', type: 'plaintext', row: 0, col: 2, connections: [{ to: 'x2' }] },
      { id: 'p3', label: 'Block 3', type: 'plaintext', row: 0, col: 3, connections: [{ to: 'x3' }] },
      { id: 'x1', label: 'XOR', type: 'xor', row: 1, col: 1, connections: [{ to: 'e1' }] },
      { id: 'x2', label: 'XOR', type: 'xor', row: 1, col: 2, connections: [{ to: 'e2' }] },
      { id: 'x3', label: 'XOR', type: 'xor', row: 1, col: 3, connections: [{ to: 'e3' }] },
      { id: 'e1', label: 'AES', type: 'encrypt', row: 2, col: 1, connections: [{ to: 'c1' }, { to: 'x2', label: 'chain' }] },
      { id: 'e2', label: 'AES', type: 'encrypt', row: 2, col: 2, connections: [{ to: 'c2' }, { to: 'x3', label: 'chain' }] },
      { id: 'e3', label: 'AES', type: 'encrypt', row: 2, col: 3, connections: [{ to: 'c3' }] },
      { id: 'c1', label: 'Cipher 1', type: 'ciphertext', row: 3, col: 1 },
      { id: 'c2', label: 'Cipher 2', type: 'ciphertext', row: 3, col: 2 },
      { id: 'c3', label: 'Cipher 3', type: 'ciphertext', row: 3, col: 3 }
    ]
  },
  {
    id: 'ctr',
    name: 'CTR',
    fullName: 'Counter Mode',
    description: 'Turns a block cipher into a stream cipher by encrypting successive values of a counter. The encrypted counter is then XORed with plaintext. This allows parallel encryption and random access.',
    howItWorks: 'A nonce and counter value are combined and encrypted. The resulting keystream is XORed with plaintext. The counter increments for each block, allowing parallel processing.',
    pros: [
      'Fully parallelizable',
      'Random access to encrypted data',
      'No padding required',
      'Preprocessing possible'
    ],
    cons: [
      'Nonce must never be reused with same key',
      'No built-in authentication',
      'Bit-flipping attacks possible'
    ],
    useCases: [
      'High-speed encryption',
      'Disk encryption (with authentication)',
      'Network encryption',
      'Streaming data'
    ],
    securityLevel: 'medium',
    requiresIV: false,
    requiresNonce: true,
    providesAuthentication: false,
    parallelizable: true,
    blocks: [
      { id: 'n1', label: 'Nonce|1', type: 'counter', row: 0, col: 0, connections: [{ to: 'e1' }] },
      { id: 'n2', label: 'Nonce|2', type: 'counter', row: 0, col: 1, connections: [{ to: 'e2' }] },
      { id: 'n3', label: 'Nonce|3', type: 'counter', row: 0, col: 2, connections: [{ to: 'e3' }] },
      { id: 'e1', label: 'AES', type: 'encrypt', row: 1, col: 0, connections: [{ to: 'x1' }] },
      { id: 'e2', label: 'AES', type: 'encrypt', row: 1, col: 1, connections: [{ to: 'x2' }] },
      { id: 'e3', label: 'AES', type: 'encrypt', row: 1, col: 2, connections: [{ to: 'x3' }] },
      { id: 'p1', label: 'Block 1', type: 'plaintext', row: 1, col: 0, connections: [{ to: 'x1' }] },
      { id: 'p2', label: 'Block 2', type: 'plaintext', row: 1, col: 1, connections: [{ to: 'x2' }] },
      { id: 'p3', label: 'Block 3', type: 'plaintext', row: 1, col: 2, connections: [{ to: 'x3' }] },
      { id: 'x1', label: 'XOR', type: 'xor', row: 2, col: 0, connections: [{ to: 'c1' }] },
      { id: 'x2', label: 'XOR', type: 'xor', row: 2, col: 1, connections: [{ to: 'c2' }] },
      { id: 'x3', label: 'XOR', type: 'xor', row: 2, col: 2, connections: [{ to: 'c3' }] },
      { id: 'c1', label: 'Cipher 1', type: 'ciphertext', row: 3, col: 0 },
      { id: 'c2', label: 'Cipher 2', type: 'ciphertext', row: 3, col: 1 },
      { id: 'c3', label: 'Cipher 3', type: 'ciphertext', row: 3, col: 2 }
    ]
  },
  {
    id: 'gcm',
    name: 'GCM',
    fullName: 'Galois/Counter Mode',
    description: 'Combines CTR mode encryption with Galois field authentication. Provides both confidentiality and authenticity in a single pass, making it highly efficient and secure.',
    howItWorks: 'Uses CTR mode for encryption while simultaneously computing an authentication tag using Galois field multiplication. The tag verifies both ciphertext and optional additional authenticated data (AAD).',
    pros: [
      'Authenticated encryption (AEAD)',
      'Highly parallelizable',
      'Single-pass encryption + authentication',
      'Can authenticate unencrypted data (AAD)',
      'Industry standard'
    ],
    cons: [
      'Nonce must NEVER be reused',
      'Short tags can be vulnerable',
      'More complex implementation'
    ],
    useCases: [
      'TLS 1.2/1.3',
      'IPsec VPNs',
      'SSH',
      'Secure storage',
      'API encryption'
    ],
    securityLevel: 'high',
    requiresIV: false,
    requiresNonce: true,
    providesAuthentication: true,
    parallelizable: true,
    blocks: [
      { id: 'n1', label: 'Nonce|1', type: 'counter', row: 0, col: 0, connections: [{ to: 'e1' }] },
      { id: 'n2', label: 'Nonce|2', type: 'counter', row: 0, col: 1, connections: [{ to: 'e2' }] },
      { id: 'n3', label: 'Nonce|3', type: 'counter', row: 0, col: 2, connections: [{ to: 'e3' }] },
      { id: 'e1', label: 'AES', type: 'encrypt', row: 1, col: 0, connections: [{ to: 'x1' }] },
      { id: 'e2', label: 'AES', type: 'encrypt', row: 1, col: 1, connections: [{ to: 'x2' }] },
      { id: 'e3', label: 'AES', type: 'encrypt', row: 1, col: 2, connections: [{ to: 'x3' }] },
      { id: 'p1', label: 'Block 1', type: 'plaintext', row: 1, col: 0, connections: [{ to: 'x1' }] },
      { id: 'p2', label: 'Block 2', type: 'plaintext', row: 1, col: 1, connections: [{ to: 'x2' }] },
      { id: 'p3', label: 'Block 3', type: 'plaintext', row: 1, col: 2, connections: [{ to: 'x3' }] },
      { id: 'x1', label: 'XOR', type: 'xor', row: 2, col: 0, connections: [{ to: 'c1' }, { to: 'g1' }] },
      { id: 'x2', label: 'XOR', type: 'xor', row: 2, col: 1, connections: [{ to: 'c2' }, { to: 'g2' }] },
      { id: 'x3', label: 'XOR', type: 'xor', row: 2, col: 2, connections: [{ to: 'c3' }, { to: 'g3' }] },
      { id: 'c1', label: 'Cipher 1', type: 'ciphertext', row: 3, col: 0 },
      { id: 'c2', label: 'Cipher 2', type: 'ciphertext', row: 3, col: 1 },
      { id: 'c3', label: 'Cipher 3', type: 'ciphertext', row: 3, col: 2 },
      { id: 'g1', label: 'GHASH', type: 'auth', row: 4, col: 0, connections: [{ to: 'g2' }] },
      { id: 'g2', label: 'GHASH', type: 'auth', row: 4, col: 1, connections: [{ to: 'g3' }] },
      { id: 'g3', label: 'GHASH', type: 'auth', row: 4, col: 2, connections: [{ to: 'tag' }] },
      { id: 'tag', label: 'Auth Tag', type: 'tag', row: 4, col: 3 }
    ]
  }
];

export function getModeSecurityColor(level: 'high' | 'medium' | 'low'): string {
  switch (level) {
    case 'high': return 'text-primary';
    case 'medium': return 'text-chart-4';
    case 'low': return 'text-destructive';
  }
}

export function getModeSecurityBadge(level: 'high' | 'medium' | 'low'): { label: string; variant: 'default' | 'secondary' | 'destructive' } {
  switch (level) {
    case 'high': return { label: 'Recommended', variant: 'default' };
    case 'medium': return { label: 'Use with Auth', variant: 'secondary' };
    case 'low': return { label: 'Avoid', variant: 'destructive' };
  }
}
