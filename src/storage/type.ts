export type FileUri = PublicFileUri | CloudStorageFileUri | OneDriveFileUri | SharePointFileUri

export type PublicFileUri = {
	type: "public"

	/**
	 * `https://{publicUrl}` | `http://{publicUrl}`
	 */
	uri: string
}

export type CloudStorageFileUri = {
	type: "gcs"
	uri: string
	bucketName: string
	filePath: string
}

export type OneDriveFileUri = {
	type: "onedrive"
	uri: string
	driveId: string
	itemId: string
}

export type SharePointFileUri = {
	type: "sharepoint"
	uri: string
	siteId: string
	driveId: string
	itemId: string
}
