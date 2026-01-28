import mime from "mime"
import { VError } from "verror"

import { CloudStorageService } from "./cloud-storage"
import { OneDriveService } from "./onedrive"
import { FileUri } from "./type"

/**
 * Facade layer for file operations (GCS/OneDrive/SharePoint/Public)
 */
export class FileHelper {
	/**
	 * Extract file URI information from the given URI.
	 * alias for `decodeUri`
	 */
	static extractFileUri(fileUrl: string): FileUri {
		return FileHelper.decodeUri(fileUrl)
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
	static decodeUri(fileUrl: string): FileUri {
		try {
			const url = new URL(fileUrl)

			switch (url.protocol) {
				case "gs:": {
					const bucketName = url.hostname
					const filePath = url.pathname.startsWith("/") ? url.pathname.slice(1) : url.pathname
					if (!bucketName || !filePath) {
						throw new VError(`Invalid GCS URL format, expecting 'gs://{bucketName}/{filePath}'`)
					}
					return {
						type: "gcs",
						uri: `gs://${bucketName}/${decodeURIComponent(filePath)}`,
						bucketName,
						filePath,
					}
				}
				case "onedrive:": {
					let driveId = url.hostname
					let itemId = url.pathname.startsWith("/") ? url.pathname.slice(1) : url.pathname
					if (!driveId || !itemId) {
						throw new VError(`Invalid OneDrive URL format, expecting 'onedrive://{driveId}/{itemId}'`)
					}

					driveId = OneDriveService.formatDriveId(driveId)
					itemId = OneDriveService.formatItemId(itemId)

					return {
						type: "onedrive",
						uri: `onedrive://${driveId}/${itemId}`,
						driveId,
						itemId,
					}
				}
				case "sharepoint:": {
					const siteId = url.hostname
					const pathParts = (url.pathname.startsWith("/") ? url.pathname.slice(1) : url.pathname).split("/")
					if (pathParts.length < 2) {
						throw new VError(`Invalid SharePoint URL format, expecting 'sharepoint://{siteId}/{driveId}/{itemId}'`)
					}

					const driveId = OneDriveService.formatDriveId(pathParts[0] ?? "")
					const itemId = OneDriveService.formatItemId(pathParts[1] ?? "")

					return {
						type: "sharepoint",
						uri: `sharepoint://${siteId}/${driveId}/${itemId}`,
						siteId,
						driveId,
						itemId,
					}
				}
				case "http:":
				case "https:": {
					if (CloudStorageService.isGCSUrl(fileUrl)) {
						const info = CloudStorageService.extractInfo(fileUrl)
						if (!info) {
							throw new VError(`Invalid GCS URL format, expecting 'gs://{bucketName}/{filePath}'`)
						}
						return {
							type: "gcs",
							uri: CloudStorageService.toGCSUri(info),
							bucketName: info.bucketName,
							filePath: info.filePath,
						}
					}
					return {
						type: "public",
						uri: fileUrl,
					}
				}
				default:
					throw new VError(`Unsupported file URL scheme: ${url.protocol}`)
			}
		} catch (error) {
			if (error instanceof VError) {
				throw error
			}
			throw new VError({ cause: error as Error }, `Invalid file URL: ${fileUrl}`)
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
	static encodeUri(fileUri: FileUri): string {
		switch (fileUri.type) {
			case "gcs":
				return `gs://${fileUri.bucketName}/${fileUri.filePath}`
			case "onedrive":
				return `onedrive://${OneDriveService.formatDriveId(fileUri.driveId)}/${OneDriveService.formatItemId(fileUri.itemId)}`
			case "sharepoint":
				return `sharepoint://${fileUri.siteId}/${OneDriveService.formatDriveId(fileUri.driveId)}/${OneDriveService.formatItemId(fileUri.itemId)}`
			case "public":
				return fileUri.uri
			default:
				throw new VError(`Unsupported file URI type: ${fileUri}`)
		}
	}

	static mimeFileExtension(mimeType: string): string | null {
		const extension = mime.getExtension(mimeType)
		if (!extension) {
			return fallbackMimeToExt[mimeType] || null
		}
		return extension
	}
}

const fallbackMimeToExt: Record<string, string> = {
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
	"application/typescript": "ts",
}
