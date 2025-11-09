import fs from 'fs';
import path from 'path';
import multer from 'multer';

const mediaDir = path.join(process.cwd(), 'media');

if (!fs.existsSync(mediaDir)) {
  fs.mkdirSync(mediaDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, mediaDir);
  },
  filename: (_req, file, cb) => {
    const extension = path.extname(file.originalname) || '.bin';
    const safeName = path.basename(file.originalname, extension).replace(/\s+/g, '-');
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${safeName}-${uniqueSuffix}${extension}`);
  },
});

const imageMimeRegex = /^image\/(png|jpe?g|webp)$/i;

const fileFilter: multer.Options['fileFilter'] = (_req, file, cb) => {
  if (imageMimeRegex.test(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only PNG, JPG, JPEG, or WEBP images are allowed'));
  }
};

export const uploadBikeImages = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

export const MEDIA_ROOT = mediaDir;

