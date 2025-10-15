import * as permRepo from '../repositories/permissionRepository';

export function listPermissions() {
  return permRepo.findAllPermissions();
}

export function getPermission(id: number) {
  return permRepo.findPermissionById(id);
}

export function createPermission(data: any) {
  return permRepo.createPermission(data);
}

export function updatePermission(id: number, data: any) {
  return permRepo.updatePermission(id, data);
}

export function deletePermission(id: number) {
  return permRepo.deletePermission(id);
}
