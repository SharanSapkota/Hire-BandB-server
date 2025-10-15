import * as repo from '../repositories/userEmailRepository';

export function listEmails(userId: number) {
  return repo.findEmailsByUser(userId);
}

export function createEmail(data: any) {
  return repo.createUserEmail(data);
}

export function setPrimary(id: number, userId: number) {
  return repo.setPrimaryEmail(id, userId);
}
