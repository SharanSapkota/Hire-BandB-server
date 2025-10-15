import { Request, Response } from 'express';
import * as mappingService from '../services/permissionMappingService';

export async function listUserPermissions(req: Request, res: Response) {
  const items = await mappingService.listUserPermissions();
  res.json(items);
}

export async function createUserPermission(req: Request, res: Response) {
  const item = await mappingService.createUserPermission(req.body);
  res.status(201).json(item);
}

export async function listRolePermissions(req: Request, res: Response) {
  const items = await mappingService.listRolePermissions();
  res.json(items);
}

export async function createRolePermission(req: Request, res: Response) {
  const item = await mappingService.createRolePermission(req.body);
  res.status(201).json(item);
}
