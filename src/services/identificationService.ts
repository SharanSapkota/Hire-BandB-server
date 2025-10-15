import * as repo from '../repositories/identificationRepository';

export function listServices() {
  return repo.listIdentificationServices();
}

export function createService(data: any) {
  return repo.createIdentificationService(data);
}

export function createIdentity(data: any) {
  return repo.createUserIdentity(data);
}

export function listIdentities(userId: number) {
  return repo.listUserIdentities(userId);
}
