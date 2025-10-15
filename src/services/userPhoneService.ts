import * as repo from '../repositories/userPhoneRepository';

export function listPhones(userId: number) {
  return repo.findPhonesByUser(userId);
}

export function createPhone(data: any) {
  return repo.createPhone(data);
}

export function updatePhone(id: bigint | number, data: any) {
  return repo.updatePhone(id, data);
}

export function deletePhone(id: bigint | number) {
  return repo.deletePhone(id);
}
