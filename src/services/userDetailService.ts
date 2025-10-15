import * as repo from '../repositories/userDetailRepository';

export function getDetail(userId: number) {
  return repo.findUserDetailByUserId(userId);
}

export function upsertDetail(userId: number, data: any) {
  return repo.upsertUserDetail(userId, data);
}
