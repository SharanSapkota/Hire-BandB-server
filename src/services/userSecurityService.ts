import * as repo from '../repositories/userSecurityRepository';

export function getSecurity(userId: number) {
  return repo.findSecurityByUserId(userId);
}

export function upsertSecurity(userId: number, data: any) {
  return repo.upsertSecurity(userId, data);
}
