export abstract class BaseFileUploadService {
    constructor() {}
    abstract uploadFile(file: any): Promise<any>
}