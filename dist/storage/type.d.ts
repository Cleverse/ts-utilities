type FileUri = PublicFileUri | CloudStorageFileUri | OneDriveFileUri | SharePointFileUri;
type PublicFileUri = {
    type: "public";
    /**
     * `https://{publicUrl}` | `http://{publicUrl}`
     */
    uri: string;
};
type CloudStorageFileUri = {
    type: "gcs";
    uri: string;
    bucketName: string;
    filePath: string;
};
type OneDriveFileUri = {
    type: "onedrive";
    uri: string;
    driveId: string;
    itemId: string;
};
type SharePointFileUri = {
    type: "sharepoint";
    uri: string;
    siteId: string;
    driveId: string;
    itemId: string;
};

export type { CloudStorageFileUri, FileUri, OneDriveFileUri, PublicFileUri, SharePointFileUri };
