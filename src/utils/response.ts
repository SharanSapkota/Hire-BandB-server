import { Response } from 'express';
interface ApiResponse {
    success: boolean;
    data: any;
    statusCode: number;
}
export function sendSuccess(res: Response, data: any = {data: []}, statusCode: number = 200) {
  return res.status(statusCode).json({ success: true, data, statusCode });
}

export function sendFailure(res: Response, data: any = [], statusCode: number = 500) {
  return res.status(statusCode).json({ success: false, data, statusCode });
}
