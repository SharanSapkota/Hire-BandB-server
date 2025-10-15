import * as repo from '../repositories/locationRepository';

export function listLocations(userId: number) {
  return repo.listLocationsByUser(userId);
}

export function createLocation(data: any) {
  return repo.createLocation(data);
}

export function deleteLocation(id: number) {
  return repo.deleteLocation(id);
}
