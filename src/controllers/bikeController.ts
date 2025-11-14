import { Request, Response } from 'express';
import { BikeService } from '../services/bikeService/bikeService';
import { BikeRepository } from '../repositories/bikeRepository';
import { sendSuccess, sendFailure } from '../utils/response';
import { bikePresenter } from '../presentation/bike';
import { ERROR_MESSAGES } from '../constants/errorConstant';
import * as bookingService from '../services/bookingService';

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
    const currentUser = req.user;
    const bike = await bikeService.getBike(id, currentUser);
    // const bookings = await bookingService.getBookingsByBikeIdAndUserId(id, currentUser.id);
    const presentableBike = bikePresenter(bike);
    if (!bike) return sendFailure(res, { error: ERROR_MESSAGES.NOT_FOUND }, 404);
    return sendSuccess(res, presentableBike, 200);
  } catch (err) {
    console.error(err);
    return sendFailure(res, { error: ERROR_MESSAGES.INTERNAL_ERROR }, 500);
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
      return sendFailure(res, { error: ERROR_MESSAGES.UNAUTHORIZED }, 401);
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
      return sendFailure(res, { error: ERROR_MESSAGES.BAD_REQUEST }, 400);
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
      return sendFailure(res, { error: ERROR_MESSAGES.BAD_REQUEST }, 400);
    }

    if (!payload.address.address || !payload.address.street) {
      return sendFailure(res, { error: ERROR_MESSAGES.BAD_REQUEST }, 400);
    }

    const bike = await bikeService.createBike(payload);
    return sendSuccess(res, bike, 201);
  } catch (err) {
    console.error(err);
    return sendFailure(res, { error: ERROR_MESSAGES.INTERNAL_ERROR }, 500);
  }
}

export async function update(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const currentUser = req.user;
    if (!currentUser) {
      return sendFailure(res, { error: ERROR_MESSAGES.UNAUTHORIZED }, 401);
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
      return sendFailure(res, { error: ERROR_MESSAGES.BAD_REQUEST }, 400);
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
    return sendSuccess(res, updated, 200);
  } catch (err: any) {
    if (err.message === ERROR_MESSAGES.NOT_FOUND) return sendFailure(res, { error: ERROR_MESSAGES.NOT_FOUND }, 404);
    if (err.message === ERROR_MESSAGES.FORBIDDEN) return sendFailure(res, { error: ERROR_MESSAGES.FORBIDDEN }, 403);
    console.error(err);
    return sendFailure(res, { error: ERROR_MESSAGES.INTERNAL_ERROR }, 500);
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    await bikeService.deleteBike(id, req.user);
    return sendSuccess(res, { ok: true }, 200);
  } catch (err: any) {
    if (err.message === ERROR_MESSAGES.NOT_FOUND) return sendFailure(res, { error: ERROR_MESSAGES.NOT_FOUND }, 404);
    if (err.message === ERROR_MESSAGES.FORBIDDEN) return sendFailure(res, { error: ERROR_MESSAGES.FORBIDDEN }, 403);
    console.error(err);
    return sendFailure(res, { error: ERROR_MESSAGES.INTERNAL_ERROR }, 500);
  }
}
