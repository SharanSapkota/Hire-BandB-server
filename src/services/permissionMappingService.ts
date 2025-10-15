import * as userPermRepo from '../repositories/userPermissionRepository';
import * as rolePermRepo from '../repositories/rolePermissionRepository';

export function listUserPermissions() {
  return userPermRepo.findAllUserPermissions();
}

export function createUserPermission(data: any) {
  return userPermRepo.createUserPermission(data);
}

export function listRolePermissions() {
  return rolePermRepo.findAllRolePermissions();
}

export function createRolePermission(data: any) {
  return rolePermRepo.createRolePermission(data);
}
