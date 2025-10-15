import * as repo from '../repositories/activityLogRepository';

export function listLogs(userId: number) {
  return repo.listLogsByUser(userId);
}

export function createLog(data: any) {
  return repo.createLog(data);
}
