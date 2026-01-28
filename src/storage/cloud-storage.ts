import { pipeline } from "node:stream/promises"

import { SaveData, Storage } from "@google-cloud/storage"

import { PrimitiveValue } from "@/types"

import { NotFoundError, ForbiddenError, SomethingWentWrong, BadRequestError } from "../errors/errors"

type FileUriInfo = {
	bucketName: string
	filePath: string
}

// GCS Error interface
interface CloudStorageError extends Error {
	code?: number
}

// Type guard for GCS errors
function isGCSError(error: unknown): error is CloudStorageError {
	return error != null && typeof error === "object" && "code" in error && typeof error.code === "number"
}

export interface UploadOptions {
	contentType?: string
	metadata?: Record<string, PrimitiveValue>
}

/**
 * GCS Helper class for file operations
 */
export class CloudStorageService {
	constructor(public readonly storage: Storage) {}

	async getFileMetadata(fileUrl: string) {
		try {
			const info = CloudStorageService.extractInfo(fileUrl)
			if (!info) {
				return null
			}

			// Get file metadata from GCS
			// https://cloud.google.com/storage/docs/samples/storage-get-metadata
			const file = this.storage.bucket(info.bucketName).file(info.filePath)
			const [fileExists] = await file.exists()
			if (!fileExists) {
				return null
			}
			const [metadata] = await file.getMetadata()
			if (!metadata.timeCreated) {
				return null
			}

			return {
				bucketName: info.bucketName,
				filePath: info.filePath,
				name: (metadata.name ?? info.filePath).split("/").pop() ?? "",
				contentType: metadata.contentType ?? "application/octet-stream",
				size: Number(metadata.size ?? 0),
				checksumCrc32c: metadata.crc32c,
				checksumMd5: metadata.md5Hash,
				createdAt: new Date(metadata.timeCreated ?? 0),
				modifiedAt: new Date(metadata.updated ?? 0),
				webUrl: metadata.mediaLink,
			}
		} catch (error: unknown) {
			if (isGCSError(error)) {
				if (error.code === 404 || (error instanceof Error && error.message?.toLowerCase().includes("not found"))) {
					return null
				}
			}
			throw new SomethingWentWrong(`Failed to get file info: ${fileUrl}`, {
				cause: error,
			})
		}
	}

	async download(fileUrl: string): Promise<Buffer> {
		// Check if it's a Google Cloud Storage URL
		const info = CloudStorageService.extractInfo(fileUrl)

		if (info) {
			// Download from Cloud Storage
			const bucket = this.storage.bucket(info.bucketName)
			const file = bucket.file(info.filePath)

			try {
				const [content] = await file.download()
				return content
			} catch (error: unknown) {
				if (isGCSError(error)) {
					if (error.code === 404 || (error instanceof Error && error.message?.toLowerCase().includes("not found"))) {
						throw new NotFoundError(`File not found in storage: gs://${info.bucketName}/${info.filePath}`, {
							cause: error,
						})
					}
					if (error.code === 403) {
						throw new ForbiddenError(`Access denied to file: gs://${info.bucketName}/${info.filePath}`, {
							cause: error,
						})
					}
				}
				throw new SomethingWentWrong(`Failed to download from GCS: gs://${info.bucketName}/${info.filePath}`, {
					cause: error,
				})
			}
		} else {
			// Download directly via HTTP
			const response = await fetch(fileUrl)
			if (!response.ok) {
				if (response.status === 404) {
					throw new NotFoundError(`File not found: ${fileUrl}`)
				}
				if (response.status >= 400 && response.status < 500) {
					throw new BadRequestError(
						`Failed to fetch file from ${fileUrl}: Got status code ${response.status} ${response.statusText}`,
					)
				}
				throw new SomethingWentWrong(
					`Failed to fetch file from ${fileUrl}: Got status code ${response.status} ${response.statusText}`,
				)
			}
			const arrayBuffer = await response.arrayBuffer()
			return Buffer.from(arrayBuffer)
		}
	}

	/**
	 * Upload new file to GCS
	 */
	async upload(bucketName: string, filePath: string, content: SaveData, options?: UploadOptions) {
		const file = this.storage.bucket(bucketName).file(filePath)
		try {
			await file.save(content, options)
		} catch (error) {
			throw new SomethingWentWrong(`Failed to upload file to gs://${bucketName}/${filePath}`, {
				cause: error,
			})
		}
		const [metadata] = await file.getMetadata()
		return {
			uri: file.cloudStorageURI.href,
			fileSize: Number(metadata.size ?? 0),
			checksumCrc32c: metadata.crc32c,
			checksumMd5: metadata.md5Hash,
			contentType: metadata.contentType ?? options?.contentType ?? "application/octet-stream",
			bucketName,
			filePath,
		}
	}

	/**
	 * Upload new file to GCS from the given file URL
	 */
	async uploadFromUrl(bucketName: string, filePath: string, fileDownloadUrl: string, options?: UploadOptions) {
		const response = await fetch(fileDownloadUrl)
		if (!response.ok) {
			if (response.status === 404) {
				throw new NotFoundError(`File not found: ${fileDownloadUrl}`)
			}
			if (response.status >= 400 && response.status < 500) {
				throw new BadRequestError(
					`Failed to fetch file from ${fileDownloadUrl}: Got status code ${response.status} ${response.statusText}`,
				)
			}
			throw new BadRequestError(
				`Failed to fetch file from ${fileDownloadUrl}: ${response.status} ${response.statusText}`,
			)
		}
		const file = this.storage.bucket(bucketName).file(filePath)

		const stream = response.body
		if (!stream) {
			throw new SomethingWentWrong(`Failed to get stream from ${fileDownloadUrl}`, {
				cause: new Error(`Failed to get stream from ${fileDownloadUrl}`),
			})
		}
		try {
			await pipeline(
				stream,
				file.createWriteStream({
					...options,
					resumable: false,
					contentType: response.headers.get("content-type") ?? options?.contentType ?? undefined,
					metadata: {
						...options?.metadata,
						src_url: fileDownloadUrl,
					},
				}),
			)

			const [metadata] = await file.getMetadata()
			return {
				uri: file.cloudStorageURI.href,
				fileSize: Number(metadata.size ?? 0),
				checksumCrc32c: metadata.crc32c,
				checksumMd5: metadata.md5Hash,
				contentType:
					metadata.contentType ??
					response.headers.get("content-type") ??
					options?.contentType ??
					"application/octet-stream",
				bucketName,
				filePath,
			}
		} catch (error) {
			throw new SomethingWentWrong(`Failed to upload file to gs://${bucketName}/${filePath}`, {
				cause: error,
			})
		}
	}

	async getSignedUrl(fileUrl: string, ttl: number = 1000 * 60 * 60 * 1) {
		// Determine bucket name and the bucket base URL from either subdomain or path-style URL
		const info = CloudStorageService.extractInfo(fileUrl)
		if (!info) {
			return fileUrl
		}

		try {
			// Get file reference from GCS bucket
			const bucket = this.storage.bucket(info.bucketName)
			const file = bucket.file(info.filePath)

			const now = new Date()

			// Generate signed URL
			const [signedUrl] = await file.getSignedUrl({
				action: "read",
				accessibleAt: now,
				expires: new Date(now.getTime() + ttl),
			})

			// Replace the canonical https://storage.googleapis.com/<bucket> with the subdomain public URL
			return signedUrl.replace(
				`https://storage.googleapis.com/${info.bucketName}`,
				CloudStorageService.basePublicUrl(info),
			)
		} catch (error: unknown) {
			if (isGCSError(error)) {
				if (error.code === 404 || (error instanceof Error && error.message?.toLowerCase().includes("not found"))) {
					throw new NotFoundError(`File not found for signed URL generation: gs://${info.bucketName}/${info.filePath}`)
				}
				if (error.code === 403) {
					throw new ForbiddenError(`Access denied to generate signed URL for: gs://${info.bucketName}/${info.filePath}`)
				}
			}
			throw new SomethingWentWrong(`Failed to generate signed URL for file: ${fileUrl}`, {
				cause: error,
			})
		}
	}

	async checkResourceType(resourceUrl: string): Promise<"file" | "folder" | null> {
		const info = CloudStorageService.extractInfo(resourceUrl)
		if (!info) {
			return null
		}
		try {
			const bucket = this.storage.bucket(info.bucketName)
			const file = bucket.file(info.filePath)
			const [fileExists] = await file.exists()
			if (fileExists) {
				return "file"
			}

			// Check if folder by listing files with prefix
			const [files] = await bucket.getFiles({
				prefix: resourceUrl.endsWith("/") ? resourceUrl : resourceUrl + "/",
				maxResults: 1,
			})
			if (files.length > 0) {
				return "folder"
			}
			return null
		} catch (error) {
			if (isGCSError(error)) {
				if (error.code === 404 || (error instanceof Error && error.message?.toLowerCase().includes("not found"))) {
					throw new NotFoundError(`File not found for signed URL generation: gs://${info.bucketName}/${info.filePath}`)
				}
				if (error.code === 403) {
					throw new ForbiddenError(`Access denied to generate signed URL for: gs://${info.bucketName}/${info.filePath}`)
				}
			}
			throw new SomethingWentWrong(`Failed to check item type: ${resourceUrl}`, {
				cause: error,
			})
		}
	}

	/**
	 * Check if a URL is a GCS URL
	 * @param fileUrl - The URL of the file.
	 * @returns True if the URL is a GCS URL, false otherwise.
	 */
	static isGCSUrl(fileUrl: string): boolean {
		if (fileUrl.startsWith("gs://")) {
			return true
		}
		const url = new URL(fileUrl)
		return url.hostname.endsWith(".storage.googleapis.com") || url.hostname === "storage.googleapis.com"
	}

	/**
	 * Extract GCS File info from a URL
	 * @param baseMediaUrl - The URL of the file.
	 * e.g.
	 *   - `gs://{bucketName}/{objectPath}`
	 *   - `https://{bucketName}.storage.googleapis.com/{objectPath}`
	 *   - `https://storage.googleapis.com/{bucketName}/{objectPath}`
	 */
	static extractInfo(baseMediaUrl: string): FileUriInfo | null {
		const url = new URL(baseMediaUrl)
		let bucketName: string | null = null
		let objectPath = ""

		// Handle gs:// format
		if (baseMediaUrl.startsWith("gs://")) {
			const [, path] = baseMediaUrl.split("gs://")
			if (!path) {
				return null
			}
			const [bucket, ...objectParts] = path.split("/")
			if (!bucket) {
				return null
			}
			return {
				bucketName: bucket,
				filePath: objectParts.join("/"),
			}
		}

		// Handle public URL format
		if (url.hostname.endsWith(".storage.googleapis.com")) {
			// Subdomain style: https://<bucket>.storage.googleapis.com/<object>
			bucketName = url.hostname.replace(".storage.googleapis.com", "")
			objectPath = url.pathname.replace(/^\/+/, "")
		} else if (url.hostname === "storage.googleapis.com") {
			// Path style: https://storage.googleapis.com/<bucket>/<object>
			const segments = url.pathname.split("/").filter(Boolean)
			if (!segments[0]) {
				return null
			}
			bucketName = segments[0]
			objectPath = segments.slice(1).join("/")
		} else {
			return null
		}
		let decodedObjectPath = objectPath
		try {
			decodedObjectPath = decodeURIComponent(objectPath)
		} catch {
			decodedObjectPath = objectPath
		}
		return {
			bucketName: bucketName,
			filePath: decodedObjectPath,
		}
	}

	static basePublicUrl(fileInfo: FileUriInfo): string {
		return `https://${fileInfo.bucketName}.storage.googleapis.com`
	}

	static toPublicUrl(fileInfo: FileUriInfo): string {
		return `https://${fileInfo.bucketName}.storage.googleapis.com/${fileInfo.filePath}`
	}

	static toGCSUri(fileInfo: FileUriInfo): string {
		return `gs://${fileInfo.bucketName}/${fileInfo.filePath}`
	}
}
