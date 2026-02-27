"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } }

var _chunkIQFNQLPCcjs = require('./chunk-IQFNQLPC.cjs');


var _chunkSZPGJFJAcjs = require('./chunk-SZPGJFJA.cjs');


var _chunkT6TWWATEcjs = require('./chunk-T6TWWATE.cjs');

// src/storage/helper.ts
_chunkT6TWWATEcjs.init_cjs_shims.call(void 0, );
var _mime = require('mime'); var _mime2 = _interopRequireDefault(_mime);
var _verror = require('verror');
var FileHelper = class _FileHelper {
  /**
   * Extract file URI information from the given URI.
   * alias for `decodeUri`
   */
  static extractFileUri(fileUrl) {
    return _FileHelper.decodeUri(fileUrl);
  }
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
  static decodeUri(fileUrl) {
    try {
      const url = new URL(fileUrl);
      switch (url.protocol) {
        case "gs:": {
          const bucketName = url.hostname;
          const filePath = url.pathname.startsWith("/") ? url.pathname.slice(1) : url.pathname;
          if (!bucketName || !filePath) {
            throw new (0, _verror.VError)(`Invalid GCS URL format, expecting 'gs://{bucketName}/{filePath}'`);
          }
          return {
            type: "gcs",
            uri: `gs://${bucketName}/${decodeURIComponent(filePath)}`,
            bucketName,
            filePath
          };
        }
        case "onedrive:": {
          let driveId = url.hostname;
          let itemId = url.pathname.startsWith("/") ? url.pathname.slice(1) : url.pathname;
          if (!driveId || !itemId) {
            throw new (0, _verror.VError)(`Invalid OneDrive URL format, expecting 'onedrive://{driveId}/{itemId}'`);
          }
          driveId = _chunkIQFNQLPCcjs.OneDriveService.formatDriveId(driveId);
          itemId = _chunkIQFNQLPCcjs.OneDriveService.formatItemId(itemId);
          return {
            type: "onedrive",
            uri: `onedrive://${driveId}/${itemId}`,
            driveId,
            itemId
          };
        }
        case "sharepoint:": {
          const siteId = url.hostname;
          const pathParts = (url.pathname.startsWith("/") ? url.pathname.slice(1) : url.pathname).split("/");
          if (pathParts.length < 2) {
            throw new (0, _verror.VError)(`Invalid SharePoint URL format, expecting 'sharepoint://{siteId}/{driveId}/{itemId}'`);
          }
          const driveId = _chunkIQFNQLPCcjs.OneDriveService.formatDriveId(_nullishCoalesce(pathParts[0], () => ( "")));
          const itemId = _chunkIQFNQLPCcjs.OneDriveService.formatItemId(_nullishCoalesce(pathParts[1], () => ( "")));
          return {
            type: "sharepoint",
            uri: `sharepoint://${siteId}/${driveId}/${itemId}`,
            siteId,
            driveId,
            itemId
          };
        }
        case "http:":
        case "https:": {
          if (_chunkSZPGJFJAcjs.CloudStorageService.isGCSUrl(fileUrl)) {
            const info = _chunkSZPGJFJAcjs.CloudStorageService.extractInfo(fileUrl);
            if (!info) {
              throw new (0, _verror.VError)(`Invalid GCS URL format, expecting 'gs://{bucketName}/{filePath}'`);
            }
            return {
              type: "gcs",
              uri: _chunkSZPGJFJAcjs.CloudStorageService.toGCSUri(info),
              bucketName: info.bucketName,
              filePath: info.filePath
            };
          }
          return {
            type: "public",
            uri: fileUrl
          };
        }
        default:
          throw new (0, _verror.VError)(`Unsupported file URL scheme: ${url.protocol}`);
      }
    } catch (error) {
      if (error instanceof _verror.VError) {
        throw error;
      }
      throw new (0, _verror.VError)({ cause: error }, `Invalid file URL: ${fileUrl}`);
    }
  }
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
  static encodeUri(fileUri) {
    switch (fileUri.type) {
      case "gcs":
        return `gs://${fileUri.bucketName}/${fileUri.filePath}`;
      case "onedrive":
        return `onedrive://${_chunkIQFNQLPCcjs.OneDriveService.formatDriveId(fileUri.driveId)}/${_chunkIQFNQLPCcjs.OneDriveService.formatItemId(fileUri.itemId)}`;
      case "sharepoint":
        return `sharepoint://${fileUri.siteId}/${_chunkIQFNQLPCcjs.OneDriveService.formatDriveId(fileUri.driveId)}/${_chunkIQFNQLPCcjs.OneDriveService.formatItemId(fileUri.itemId)}`;
      case "public":
        return fileUri.uri;
      default:
        throw new (0, _verror.VError)(`Unsupported file URI type: ${fileUri}`);
    }
  }
  /**
   * Get the file extension from the MIME type
   */
  static mimeFileExtension(mimeType) {
    const extension = _mime2.default.getExtension(mimeType);
    if (!extension) {
      return fallbackMimeToExt[mimeType] || null;
    }
    return extension;
  }
};
var fallbackMimeToExt = {
  "application/pdf": "pdf",
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
  "application/vnd.ms-excel": "xls",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
  "application/vnd.ms-powerpoint": "ppt",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": "pptx",
  "application/json": "json",
  "application/xml": "xml",
  "application/yaml": "yaml",
  "application/toml": "toml",
  "application/html": "html",
  "application/css": "css",
  "application/javascript": "js",
  "application/typescript": "ts"
};



exports.FileHelper = FileHelper;
//# sourceMappingURL=chunk-675Y7THY.cjs.map