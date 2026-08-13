import { DriveItem } from '@microsoft/microsoft-graph-types';

declare class OneDriveService {
    /**
     * Extract driveId and itemId from SharePoint URL
     *
     * @param {string} sharePointUrl - `https://{sharePointEndpoint}/drives/{driveId}/items/{itemId}`
     */
    static extractDriveItemFromURL(sharePointUrl: string): {
        driveId: string;
        itemId: string;
    };
    static formatItemId(itemId: string): string;
    static formatDriveId(driveId: string): string;
    static formatDriveItem(item: DriveItem): DriveItem;
    static encodeOneDriveItemUri(item: DriveItem, driveType?: "onedrive" | "sharepoint"): string;
}

export { OneDriveService };
