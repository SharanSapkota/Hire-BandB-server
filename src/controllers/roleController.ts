import { Request, Response } from 'express';
import * as roleService from '../services/roleService';

export async function list(req: Request, res: Response) {
  const roles = await roleService.listRoles();
  res.json(roles);
}

export async function get(req: Request, res: Response) {
  const id = BigInt(Number(req.params.id));
  const role = await roleService.getRole(id);
  if (!role) return res.status(404).json({ error: 'not found' });
  res.json(role);
}

export async function create(req: Request, res: Response) {
  const role = await roleService.createRole(req.body);
  res.status(201).json(role);
}

export async function update(req: Request, res: Response) {
  const id = BigInt(Number(req.params.id));
  const updated = await roleService.updateRole(id, req.body);
  res.json(updated);
}

export async function remove(req: Request, res: Response) {
  const id = BigInt(Number(req.params.id));
  await roleService.deleteRole(id);
  res.json({ ok: true });
}
