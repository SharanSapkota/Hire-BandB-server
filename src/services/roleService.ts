import * as roleRepo from '../repositories/roleRepository';

export function listRoles() {
  return roleRepo.findAllRoles();
}

export function getRole(id: bigint | number) {
  return roleRepo.findRoleById(id);
}

export function createRole(data: any) {
  return roleRepo.createRole(data);
}

export function updateRole(id: bigint | number, data: any) {
  return roleRepo.updateRole(id, data);
}

export function deleteRole(id: bigint | number) {
  return roleRepo.deleteRole(id);
}
