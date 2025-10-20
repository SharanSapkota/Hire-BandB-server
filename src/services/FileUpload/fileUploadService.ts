import { BaseFileUploadService } from "./BaseClass";
import { S3Service } from "./s3upload";

export class FileUploadService implements BaseFileUploadService {
    s3Service: S3Service;
    constructor() {
        this.s3Service = new S3Service();
    }
    async uploadFile(file: any): Promise<string> {
        const getUrl = this.s3Service.generateUploadUrl();
        return Promise.resolve("file uploaded");  
    }

    async getUploadUrl(fileName?: string, fileType?: string): Promise<{
        uploadURL: string;
        // key: string;
        // publicUrl: string;
      }> {
        const uploadUrl = await this.s3Service.generateUploadUrl(fileName, fileType);

        return uploadUrl;
    }

}