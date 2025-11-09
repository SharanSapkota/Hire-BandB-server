import { Request, Response } from 'express';
import { BikeService } from '../services/bikeService/bikeService';
import { BikeRepository } from '../repositories/bikeRepository';
import { sendSuccess, sendFailure } from '../utils/response';
import { bikePresenter } from '../presentation/bike';

const bikeRepository = new BikeRepository();
const bikeService = new BikeService(bikeRepository);

export async function list(req: Request, res: Response) {
  const bikes = await bikeService.listBikes(req.query);
  const presentableBikes = bikes.map((bike: any) => {
    return bikePresenter(bike);
  });
  sendSuccess(res, presentableBikes, 200);
}

export async function listByAddress(req: Request, res: Response) {
  try{
    const lat = Number(req.query.lat);
    const lng = Number(req.query.lng);
    const city = req.query?.city as string;
    const state = req.query?.state as string;
    const country = req.query?.country as string;
    const query = { lat, lng, city, state, country };
    const bikes = await bikeService.listBikesByAddress(query);

    return sendSuccess(res, bikes, 200);
} catch (err: any) {
  return sendFailure(res, { error: err.toString()}, 500);
}
}

export async function get(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const bike = await bikeService.getBike(id);
    if (!bike) return sendFailure(res, { error: 'not found' }, 404);
    return sendSuccess(res, bike, 200);
  } catch (err) {
    console.error(err);
    return sendFailure(res, { error: 'internal error' }, 500);
  }

}

export async function create(req: Request, res: Response) {
  try {
    const bike = await bikeService.createBike(req.body);
    res.status(201).json(bike);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal error' });
  }
}

export async function update(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const updated = await bikeService.updateBike(id, req.body, req.user);
    res.json(updated);
  } catch (err: any) {
    if (err.message === 'not_found') return res.status(404).json({ error: 'not found' });
    if (err.message === 'forbidden') return res.status(403).json({ error: 'forbidden' });
    console.error(err);
    res.status(500).json({ error: 'internal error' });
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    await bikeService.deleteBike(id, req.user);
    res.json({ ok: true });
  } catch (err: any) {
    if (err.message === 'not_found') return res.status(404).json({ error: 'not found' });
    if (err.message === 'forbidden') return res.status(403).json({ error: 'forbidden' });
    console.error(err);
    res.status(500).json({ error: 'internal error' });
  }
}
