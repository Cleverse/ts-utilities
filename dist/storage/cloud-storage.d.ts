import { Storage, SaveData } from '@google-cloud/storage';
import { PrimitiveValue } from '../types/Utility/primitive.js';

type FileUriInfo = {
    bucketName: string;
    filePath: string;
};
interface UploadOptions {
    contentType?: string;
    metadata?: Record<string, PrimitiveValue>;
}
interface UploadResult {
    uri: string;
    fileSize: number;
    checksumCrc32c: string | undefined;
    checksumMd5: string | undefined;
    contentType: string;
    bucketName: string;
    filePath: string;
}
/**
 * GCS Helper class for file operations
 */
declare class CloudStorageService {
    readonly storage: Storage;
    constructor(storage: Storage);
    getFileMetadata(fileUrl: string): Promise<{
        bucketName: string;
        filePath: string;
        name: string;
        contentType: string;
        size: number;
        checksumCrc32c: string | undefined;
        checksumMd5: string | undefined;
        createdAt: Date;
        modifiedAt: Date;
        webUrl: string | undefined;
    } | null>;
    download(fileUrl: string): Promise<Buffer>;
    /**
     * Upload new file to GCS
     */
    upload(bucketName: string, filePath: string, content: SaveData, options?: UploadOptions): Promise<UploadResult>;
    /**
     * Upload new file to GCS from the given file URL
     */
    uploadFromUrl(bucketName: string, filePath: string, fileDownloadUrl: string, options?: UploadOptions): Promise<UploadResult>;
    getSignedUrl(fileUrl: string, ttl?: number): Promise<string>;
    checkResourceType(resourceUrl: string): Promise<"file" | "folder" | null>;
    /**
     * Check if a URL is a GCS URL
     * @param fileUrl - The URL of the file.
     * @returns True if the URL is a GCS URL, false otherwise.
     */
    static isGCSUrl(fileUrl: string): boolean;
    /**
     * Extract GCS File info from a URL
     * @param baseMediaUrl - The URL of the file.
     * e.g.
     *   - `gs://{bucketName}/{objectPath}`
     *   - `https://{bucketName}.storage.googleapis.com/{objectPath}`
     *   - `https://storage.googleapis.com/{bucketName}/{objectPath}`
     */
    static extractInfo(baseMediaUrl: string): FileUriInfo | null;
    static basePublicUrl(fileInfo: FileUriInfo): string;
    static toPublicUrl(fileInfo: FileUriInfo): string;
    static toGCSUri(fileInfo: FileUriInfo): string;
}

export { CloudStorageService, type UploadOptions, type UploadResult };
