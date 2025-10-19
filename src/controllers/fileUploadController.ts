import { Request, Response } from 'express';
import { FileUploadService } from '../services/FileUpload/fileUploadService';
import { sendSuccess } from '../utils/response';

const fileUploadService = new FileUploadService();

export const getPreSignedUploadUrl = async (req: Request, res: Response) => {
  try {
    const { fileName, fileType } = req.query;
    const uploadUrlData = await fileUploadService.getUploadUrl(
      fileName as string,
      fileType as string
    );

    sendSuccess(res, uploadUrlData, 200);
  } catch (error) {
    console.error('Error generating pre-signed URL:', error);
    res.status(500).json({ error: 'Failed to generate pre-signed URL' });
  }

};
