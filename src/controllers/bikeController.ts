import { Request, Response } from 'express';
import { BikeService } from '../services/bikeService/bikeService';
import { BikeRepository } from '../repositories/bikeRepository';
import { sendSuccess, sendFailure } from '../utils/response';

const bikeRepository = new BikeRepository();
const bikeService = new BikeService(bikeRepository);

export async function list(req: Request, res: Response) {
  const bikes = await bikeService.listBikes(req.query);
  res.json(bikes);
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

const toNumberOrNull = (value: any) => {
  if (value === undefined || value === null || value === '') return null;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
};

const normaliseImagePath = (filepath: string) => {
  return `/media/${filepath.split(/[/\\]/).pop()}`;
};

export async function create(req: Request, res: Response) {
  try {
    const currentUser = req.user;
    if (!currentUser) {
      return sendFailure(res, 'Unauthorized', 401);
    }

    const files = (req.files as Express.Multer.File[]) || [];
    const addressRaw = (() => {
      if (!req.body.address) return null;
      try {
        return JSON.parse(req.body.address);
      } catch {
        return null;
      }
    })();

    const latitude = toNumberOrNull(req.body.latitude ?? addressRaw?.lat);
    const longitude = toNumberOrNull(req.body.longitude ?? addressRaw?.lng);

    if (latitude === null || longitude === null) {
      return sendFailure(res, 'Latitude and longitude are required', 400);
    }

    const payload: any = {
      ownerId: currentUser.id,
      name: req.body.name,
      description: req.body.description,
      pricePerHour: toNumberOrNull(req.body.pricePerHour),
      pricePerDay: toNumberOrNull(req.body.pricePerDay),
      rentAmount: toNumberOrNull(req.body.rentAmount),
      status: req.body.status || 'AVAILABLE',
      categoryName: req.body.category || req.body.categoryName,
      bikeImages: files.map((file) => ({ imageUrl: normaliseImagePath(file.filename) })),
      address: {
        address: addressRaw?.formatted || req.body.location || req.body.addressLine || '',
        street: req.body.street || addressRaw?.street || addressRaw?.formatted || req.body.location || '',
        city: req.body.city || addressRaw?.city || undefined,
        state: req.body.state || addressRaw?.state || undefined,
        country: req.body.country || addressRaw?.country || undefined,
        postalCode: req.body.postalCode || addressRaw?.postalCode || undefined,
        latitude,
        longitude,
        placeId: req.body.placeId || addressRaw?.placeId || undefined,
      },
    };

    if (!payload.name) {
      return sendFailure(res, 'Name is required', 400);
    }

    if (!payload.address.address || !payload.address.street) {
      return sendFailure(res, 'Address details are required', 400);
    }

    const bike = await bikeService.createBike(payload);
    res.status(201).json(bike);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal error' });
  }
}

export async function update(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const currentUser = req.user;
    if (!currentUser) {
      return sendFailure(res, 'Unauthorized', 401);
    }

    const files = (req.files as Express.Multer.File[]) || [];

    const parseJson = <T,>(value: unknown): T | null => {
      if (!value) return null;
      if (typeof value === 'string') {
        try {
          return JSON.parse(value) as T;
        } catch {
          return null;
        }
      }
      return value as T;
    };

    const rawExistingImages = parseJson<string[] | undefined>(req.body.existingImages) || [];
    const existingImages = rawExistingImages
      .filter(Boolean)
      .map((img) => {
        if (!img) return '';
        if (img.startsWith('/media/')) return img;
        const mediaIndex = img.indexOf('/media/');
        if (mediaIndex >= 0) {
          return img.substring(mediaIndex);
        }
        return img;
      })
      .filter(Boolean);

    if (existingImages.length + files.length > 5) {
      return sendFailure(res, 'Maximum 5 images allowed per bike', 400);
    }

    const addressRaw = parseJson<any>(req.body.address);
    const latitude = toNumberOrNull(req.body.latitude ?? addressRaw?.lat);
    const longitude = toNumberOrNull(req.body.longitude ?? addressRaw?.lng);

    const payload: any = {
      ownerId: currentUser.id,
      name: req.body.name,
      description: req.body.description,
      pricePerHour: toNumberOrNull(req.body.pricePerHour),
      pricePerDay: toNumberOrNull(req.body.pricePerDay),
      rentAmount: toNumberOrNull(req.body.rentAmount),
      status: req.body.status,
      categoryName: req.body.category || req.body.categoryName,
      bikeImages: files.map((file) => ({ imageUrl: normaliseImagePath(file.filename) })),
      existingImages,
    };

    if (latitude !== null && longitude !== null) {
      payload.address = {
        address: addressRaw?.formatted || req.body.location || '',
        street:
          req.body.street ||
          addressRaw?.street ||
          addressRaw?.formatted ||
          req.body.location ||
          '',
        city: req.body.city || addressRaw?.city || undefined,
        state: req.body.state || addressRaw?.state || undefined,
        country: req.body.country || addressRaw?.country || undefined,
        postalCode: req.body.postalCode || addressRaw?.postalCode || undefined,
        latitude,
        longitude,
        placeId: req.body.placeId || addressRaw?.placeId || undefined,
      };
    }

    const updated = await bikeService.updateBike(id, payload, currentUser);
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
