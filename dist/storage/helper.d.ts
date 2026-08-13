import { FileUri } from './type.js';

/**
 * Facade layer for file operations (GCS/OneDrive/SharePoint/Public)
 */
declare class FileHelper {
    /**
     * Extract file URI information from the given URI.
     * alias for `decodeUri`
     */
    static extractFileUri(fileUrl: string): FileUri;
    /**
     * Decode file URI information from the given URI
     * - CloudStorage
     *   - `gs://{bucketName}/{filePath}`
     *   - `https://storage.googleapis.com/{bucketName}/{filePath}`
     *   - `https://{bucketName}.storage.googleapis.com/{filePath}`
     * - OneDrive - `onedrive://{driveId}/{itemId}`
     * - SharePoint - `sharepoint://{siteId}/{driveId}/{itemId}`
     * - Public - `https://{publicUrl}` | `http://{publicUrl}`
     */
    static decodeUri(fileUrl: string): FileUri;
    /**
     * Encode file URI information to a string.
     * - CloudStorage
     *   - `gs://{bucketName}/{filePath}`
     *   - `https://storage.googleapis.com/{bucketName}/{filePath}`
     *   - `https://{bucketName}.storage.googleapis.com/{filePath}`
     * - OneDrive - `onedrive://{driveId}/{itemId}`
     * - SharePoint - `sharepoint://{siteId}/{driveId}/{itemId}`
     * - Public - `https://{publicUrl}` | `http://{publicUrl}`
     */
    static encodeUri(fileUri: FileUri): string;
    /**
     * Get the file extension from the MIME type
     */
    static mimeFileExtension(mimeType: string): string | null;
}

export { FileHelper };
