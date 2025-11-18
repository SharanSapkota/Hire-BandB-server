import argon2 from 'argon2';
export async function hashRefreshToken(token: string) {
    return argon2.hash(token, { type: argon2.argon2id });
}

export async function verifyRefreshToken(token: string, hash: string) {
    try {
      return argon2.verify(hash, token);
    } catch {
      return false;
    }
  }