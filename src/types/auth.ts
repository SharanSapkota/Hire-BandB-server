
  export interface RefreshTokenRecord {
    id: string;
    userId: string;
    tokenHash: string;
    expiresAt: Date;
    revoked: boolean;
    replacedBy?: string;
  }
  