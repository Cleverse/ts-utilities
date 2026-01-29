"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }

var _chunkZBUJ2LFRcjs = require('./chunk-ZBUJ2LFR.cjs');


var _chunkT6TWWATEcjs = require('./chunk-T6TWWATE.cjs');

// src/storage/onedrive.ts
_chunkT6TWWATEcjs.init_cjs_shims.call(void 0, );
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
      throw new (0, _chunkZBUJ2LFRcjs.BadRequestError)(`OneDriveService: Invalid SharePoint URL format: ${sharePointUrl}`);
    }
    const driveId = pathSegments[drivesIndex + 1];
    const itemId = pathSegments[itemsIndex + 1];
    if (!driveId || !itemId) {
      throw new (0, _chunkZBUJ2LFRcjs.BadRequestError)(`OneDriveService: Could not extract driveId or itemId from URL: ${sharePointUrl}`);
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
    if (_optionalChain([item, 'access', _ => _.parentReference, 'optionalAccess', _2 => _2.driveId])) {
      item.parentReference.driveId = _OneDriveService.formatDriveId(item.parentReference.driveId);
    }
    if (_optionalChain([item, 'access', _3 => _3.parentReference, 'optionalAccess', _4 => _4.id])) {
      item.parentReference.id = _OneDriveService.formatItemId(item.parentReference.id);
    }
    return item;
  }
  static encodeOneDriveItemUri(item, driveType = "onedrive") {
    const driveId = _optionalChain([item, 'access', _5 => _5.parentReference, 'optionalAccess', _6 => _6.driveId]) ? _OneDriveService.formatDriveId(item.parentReference.driveId) : "unknown";
    const itemId = item.id ? _OneDriveService.formatItemId(item.id) : "unknown";
    const siteId = _nullishCoalesce(_optionalChain([item, 'access', _7 => _7.parentReference, 'optionalAccess', _8 => _8.siteId]), () => ( "unknown"));
    return driveType === "onedrive" ? `onedrive://${driveId}/${itemId}` : `sharepoint://${siteId}/${driveId}/${itemId}`;
  }
};



exports.OneDriveService = OneDriveService;
//# sourceMappingURL=chunk-AD7FTCR2.cjs.map