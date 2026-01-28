import {
  BadRequestError
} from "./chunk-2YCOXC43.js";

// src/storage/onedrive.ts
var OneDriveService = class _OneDriveService {
  /**
   * Extract driveId and itemId from SharePoint URL
   *
   * @param {string} sharePointUrl - `https://{sharePointEndpoint}/drives/{driveId}/items/{itemId}`
   */
  static extractDriveItemFromURL(sharePointUrl) {
    const url = new URL(sharePointUrl);
    const pathSegments = url.pathname.split("/").filter((segment) => segment.length > 0);
    const drivesIndex = pathSegments.indexOf("drives");
    const itemsIndex = pathSegments.indexOf("items");
    if (drivesIndex === -1 || itemsIndex === -1 || drivesIndex >= itemsIndex) {
      throw new BadRequestError(`OneDriveService: Invalid SharePoint URL format: ${sharePointUrl}`);
    }
    const driveId = pathSegments[drivesIndex + 1];
    const itemId = pathSegments[itemsIndex + 1];
    if (!driveId || !itemId) {
      throw new BadRequestError(`OneDriveService: Could not extract driveId or itemId from URL: ${sharePointUrl}`);
    }
    return {
      driveId: _OneDriveService.formatDriveId(driveId),
      itemId: _OneDriveService.formatItemId(itemId)
    };
  }
  // Convert itemId to standard format
  static formatItemId(itemId) {
    return itemId;
  }
  // Convert driveId to standard format
  static formatDriveId(driveId) {
    if (driveId.startsWith("b!")) {
      return driveId;
    }
    return driveId.replace(/^0+/, "").toUpperCase();
  }
  // Format the drive item to the standard format
  static formatDriveItem(item) {
    if (item.id) {
      item.id = _OneDriveService.formatItemId(item.id);
    }
    if (item.parentReference?.driveId) {
      item.parentReference.driveId = _OneDriveService.formatDriveId(item.parentReference.driveId);
    }
    if (item.parentReference?.id) {
      item.parentReference.id = _OneDriveService.formatItemId(item.parentReference.id);
    }
    return item;
  }
  static encodeOneDriveItemUri(item, driveType = "onedrive") {
    const driveId = item.parentReference?.driveId ? _OneDriveService.formatDriveId(item.parentReference.driveId) : "unknown";
    const itemId = item.id ? _OneDriveService.formatItemId(item.id) : "unknown";
    const siteId = item.parentReference?.siteId ?? "unknown";
    return driveType === "onedrive" ? `onedrive://${driveId}/${itemId}` : `sharepoint://${siteId}/${driveId}/${itemId}`;
  }
};

export {
  OneDriveService
};
//# sourceMappingURL=chunk-OWIUSNFE.js.map