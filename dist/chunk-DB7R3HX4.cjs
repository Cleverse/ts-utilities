"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }




var _chunkZBUJ2LFRcjs = require('./chunk-ZBUJ2LFR.cjs');


var _chunkT6TWWATEcjs = require('./chunk-T6TWWATE.cjs');

// src/storage/cloud-storage.ts
_chunkT6TWWATEcjs.init_cjs_shims.call(void 0, );
var _promises = require('stream/promises');
function isGCSError(error) {
  return error != null && typeof error === "object" && "code" in error && typeof error.code === "number";
}
var CloudStorageService = class _CloudStorageService {
  constructor(storage) {
    this.storage = storage;
  }
  async getFileMetadata(fileUrl) {
    try {
      const info = _CloudStorageService.extractInfo(fileUrl);
      if (!info) {
        return null;
      }
      const file = this.storage.bucket(info.bucketName).file(info.filePath);
      const [fileExists] = await file.exists();
      if (!fileExists) {
        return null;
      }
      const [metadata] = await file.getMetadata();
      if (!metadata.timeCreated) {
        return null;
      }
      return {
        bucketName: info.bucketName,
        filePath: info.filePath,
        name: _nullishCoalesce((_nullishCoalesce(metadata.name, () => ( info.filePath))).split("/").pop(), () => ( "")),
        contentType: _nullishCoalesce(metadata.contentType, () => ( "application/octet-stream")),
        size: Number(_nullishCoalesce(metadata.size, () => ( 0))),
        checksumCrc32c: metadata.crc32c,
        checksumMd5: metadata.md5Hash,
        createdAt: new Date(_nullishCoalesce(metadata.timeCreated, () => ( 0))),
        modifiedAt: new Date(_nullishCoalesce(metadata.updated, () => ( 0))),
        webUrl: metadata.mediaLink
      };
    } catch (error) {
      if (isGCSError(error)) {
        if (error.code === 404 || error instanceof Error && _optionalChain([error, 'access', _ => _.message, 'optionalAccess', _2 => _2.toLowerCase, 'call', _3 => _3(), 'access', _4 => _4.includes, 'call', _5 => _5("not found")])) {
          return null;
        }
      }
      throw new (0, _chunkZBUJ2LFRcjs.SomethingWentWrong)(`Failed to get file info: ${fileUrl}`, {
        cause: error
      });
    }
  }
  async download(fileUrl) {
    const info = _CloudStorageService.extractInfo(fileUrl);
    if (info) {
      const bucket = this.storage.bucket(info.bucketName);
      const file = bucket.file(info.filePath);
      try {
        const [content] = await file.download();
        return content;
      } catch (error) {
        if (isGCSError(error)) {
          if (error.code === 404 || error instanceof Error && _optionalChain([error, 'access', _6 => _6.message, 'optionalAccess', _7 => _7.toLowerCase, 'call', _8 => _8(), 'access', _9 => _9.includes, 'call', _10 => _10("not found")])) {
            throw new (0, _chunkZBUJ2LFRcjs.NotFoundError)(`File not found in storage: gs://${info.bucketName}/${info.filePath}`, {
              cause: error
            });
          }
          if (error.code === 403) {
            throw new (0, _chunkZBUJ2LFRcjs.ForbiddenError)(`Access denied to file: gs://${info.bucketName}/${info.filePath}`, {
              cause: error
            });
          }
        }
        throw new (0, _chunkZBUJ2LFRcjs.SomethingWentWrong)(`Failed to download from GCS: gs://${info.bucketName}/${info.filePath}`, {
          cause: error
        });
      }
    } else {
      const response = await fetch(fileUrl);
      if (!response.ok) {
        if (response.status === 404) {
          throw new (0, _chunkZBUJ2LFRcjs.NotFoundError)(`File not found: ${fileUrl}`);
        }
        if (response.status >= 400 && response.status < 500) {
          throw new (0, _chunkZBUJ2LFRcjs.BadRequestError)(
            `Failed to fetch file from ${fileUrl}: Got status code ${response.status} ${response.statusText}`
          );
        }
        throw new (0, _chunkZBUJ2LFRcjs.SomethingWentWrong)(
          `Failed to fetch file from ${fileUrl}: Got status code ${response.status} ${response.statusText}`
        );
      }
      const arrayBuffer = await response.arrayBuffer();
      return Buffer.from(arrayBuffer);
    }
  }
  /**
   * Upload new file to GCS
   */
  async upload(bucketName, filePath, content, options) {
    const file = this.storage.bucket(bucketName).file(filePath);
    try {
      await file.save(content, options);
    } catch (error) {
      throw new (0, _chunkZBUJ2LFRcjs.SomethingWentWrong)(`Failed to upload file to gs://${bucketName}/${filePath}`, {
        cause: error
      });
    }
    const [metadata] = await file.getMetadata();
    return {
      uri: file.cloudStorageURI.href,
      fileSize: Number(_nullishCoalesce(metadata.size, () => ( 0))),
      checksumCrc32c: metadata.crc32c,
      checksumMd5: metadata.md5Hash,
      contentType: _nullishCoalesce(_nullishCoalesce(metadata.contentType, () => ( _optionalChain([options, 'optionalAccess', _11 => _11.contentType]))), () => ( "application/octet-stream")),
      bucketName,
      filePath
    };
  }
  /**
   * Upload new file to GCS from the given file URL
   */
  async uploadFromUrl(bucketName, filePath, fileDownloadUrl, options) {
    const response = await fetch(fileDownloadUrl);
    if (!response.ok) {
      if (response.status === 404) {
        throw new (0, _chunkZBUJ2LFRcjs.NotFoundError)(`File not found: ${fileDownloadUrl}`);
      }
      if (response.status >= 400 && response.status < 500) {
        throw new (0, _chunkZBUJ2LFRcjs.BadRequestError)(
          `Failed to fetch file from ${fileDownloadUrl}: Got status code ${response.status} ${response.statusText}`
        );
      }
      throw new (0, _chunkZBUJ2LFRcjs.BadRequestError)(
        `Failed to fetch file from ${fileDownloadUrl}: ${response.status} ${response.statusText}`
      );
    }
    const file = this.storage.bucket(bucketName).file(filePath);
    const stream = response.body;
    if (!stream) {
      throw new (0, _chunkZBUJ2LFRcjs.SomethingWentWrong)(`Failed to get stream from ${fileDownloadUrl}`, {
        cause: new Error(`Failed to get stream from ${fileDownloadUrl}`)
      });
    }
    try {
      await _promises.pipeline.call(void 0, 
        stream,
        file.createWriteStream({
          ...options,
          resumable: false,
          contentType: _nullishCoalesce(_nullishCoalesce(response.headers.get("content-type"), () => ( _optionalChain([options, 'optionalAccess', _12 => _12.contentType]))), () => ( void 0)),
          metadata: {
            ..._optionalChain([options, 'optionalAccess', _13 => _13.metadata]),
            src_url: fileDownloadUrl
          }
        })
      );
      const [metadata] = await file.getMetadata();
      return {
        uri: file.cloudStorageURI.href,
        fileSize: Number(_nullishCoalesce(metadata.size, () => ( 0))),
        checksumCrc32c: metadata.crc32c,
        checksumMd5: metadata.md5Hash,
        contentType: _nullishCoalesce(_nullishCoalesce(_nullishCoalesce(metadata.contentType, () => ( response.headers.get("content-type"))), () => ( _optionalChain([options, 'optionalAccess', _14 => _14.contentType]))), () => ( "application/octet-stream")),
        bucketName,
        filePath
      };
    } catch (error) {
      throw new (0, _chunkZBUJ2LFRcjs.SomethingWentWrong)(`Failed to upload file to gs://${bucketName}/${filePath}`, {
        cause: error
      });
    }
  }
  async getSignedUrl(fileUrl, ttl = 1e3 * 60 * 60 * 1) {
    const info = _CloudStorageService.extractInfo(fileUrl);
    if (!info) {
      return fileUrl;
    }
    try {
      const bucket = this.storage.bucket(info.bucketName);
      const file = bucket.file(info.filePath);
      const now = /* @__PURE__ */ new Date();
      const [signedUrl] = await file.getSignedUrl({
        action: "read",
        accessibleAt: now,
        expires: new Date(now.getTime() + ttl)
      });
      return signedUrl.replace(
        `https://storage.googleapis.com/${info.bucketName}`,
        _CloudStorageService.basePublicUrl(info)
      );
    } catch (error) {
      if (isGCSError(error)) {
        if (error.code === 404 || error instanceof Error && _optionalChain([error, 'access', _15 => _15.message, 'optionalAccess', _16 => _16.toLowerCase, 'call', _17 => _17(), 'access', _18 => _18.includes, 'call', _19 => _19("not found")])) {
          throw new (0, _chunkZBUJ2LFRcjs.NotFoundError)(`File not found for signed URL generation: gs://${info.bucketName}/${info.filePath}`);
        }
        if (error.code === 403) {
          throw new (0, _chunkZBUJ2LFRcjs.ForbiddenError)(`Access denied to generate signed URL for: gs://${info.bucketName}/${info.filePath}`);
        }
      }
      throw new (0, _chunkZBUJ2LFRcjs.SomethingWentWrong)(`Failed to generate signed URL for file: ${fileUrl}`, {
        cause: error
      });
    }
  }
  async checkResourceType(resourceUrl) {
    const info = _CloudStorageService.extractInfo(resourceUrl);
    if (!info) {
      return null;
    }
    try {
      const bucket = this.storage.bucket(info.bucketName);
      const file = bucket.file(info.filePath);
      const [fileExists] = await file.exists();
      if (fileExists) {
        return "file";
      }
      const [files] = await bucket.getFiles({
        prefix: resourceUrl.endsWith("/") ? resourceUrl : resourceUrl + "/",
        maxResults: 1
      });
      if (files.length > 0) {
        return "folder";
      }
      return null;
    } catch (error) {
      if (isGCSError(error)) {
        if (error.code === 404 || error instanceof Error && _optionalChain([error, 'access', _20 => _20.message, 'optionalAccess', _21 => _21.toLowerCase, 'call', _22 => _22(), 'access', _23 => _23.includes, 'call', _24 => _24("not found")])) {
          throw new (0, _chunkZBUJ2LFRcjs.NotFoundError)(`File not found for signed URL generation: gs://${info.bucketName}/${info.filePath}`);
        }
        if (error.code === 403) {
          throw new (0, _chunkZBUJ2LFRcjs.ForbiddenError)(`Access denied to generate signed URL for: gs://${info.bucketName}/${info.filePath}`);
        }
      }
      throw new (0, _chunkZBUJ2LFRcjs.SomethingWentWrong)(`Failed to check item type: ${resourceUrl}`, {
        cause: error
      });
    }
  }
  /**
   * Check if a URL is a GCS URL
   * @param fileUrl - The URL of the file.
   * @returns True if the URL is a GCS URL, false otherwise.
   */
  static isGCSUrl(fileUrl) {
    if (fileUrl.startsWith("gs://")) {
      return true;
    }
    const url = new URL(fileUrl);
    return url.hostname.endsWith(".storage.googleapis.com") || url.hostname === "storage.googleapis.com";
  }
  /**
   * Extract GCS File info from a URL
   * @param baseMediaUrl - The URL of the file.
   * e.g.
   *   - `gs://{bucketName}/{objectPath}`
   *   - `https://{bucketName}.storage.googleapis.com/{objectPath}`
   *   - `https://storage.googleapis.com/{bucketName}/{objectPath}`
   */
  static extractInfo(baseMediaUrl) {
    const url = new URL(baseMediaUrl);
    let bucketName = null;
    let objectPath = "";
    if (baseMediaUrl.startsWith("gs://")) {
      const [, path] = baseMediaUrl.split("gs://");
      if (!path) {
        return null;
      }
      const [bucket, ...objectParts] = path.split("/");
      if (!bucket) {
        return null;
      }
      return {
        bucketName: bucket,
        filePath: objectParts.join("/")
      };
    }
    if (url.hostname.endsWith(".storage.googleapis.com")) {
      bucketName = url.hostname.replace(".storage.googleapis.com", "");
      objectPath = url.pathname.replace(/^\/+/, "");
    } else if (url.hostname === "storage.googleapis.com") {
      const segments = url.pathname.split("/").filter(Boolean);
      if (!segments[0]) {
        return null;
      }
      bucketName = segments[0];
      objectPath = segments.slice(1).join("/");
    } else {
      return null;
    }
    let decodedObjectPath = objectPath;
    try {
      decodedObjectPath = decodeURIComponent(objectPath);
    } catch (e) {
      decodedObjectPath = objectPath;
    }
    return {
      bucketName,
      filePath: decodedObjectPath
    };
  }
  static basePublicUrl(fileInfo) {
    return `https://${fileInfo.bucketName}.storage.googleapis.com`;
  }
  static toPublicUrl(fileInfo) {
    return `https://${fileInfo.bucketName}.storage.googleapis.com/${fileInfo.filePath}`;
  }
  static toGCSUri(fileInfo) {
    return `gs://${fileInfo.bucketName}/${fileInfo.filePath}`;
  }
};



exports.CloudStorageService = CloudStorageService;
//# sourceMappingURL=chunk-DB7R3HX4.cjs.map