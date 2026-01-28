import { BadRequestError } from "../errors"

import type { DriveItem } from "@microsoft/microsoft-graph-types"

export class OneDriveService {
	/**
	 * Extract driveId and itemId from SharePoint URL
	 *
	 * @param {string} sharePointUrl - `https://{sharePointEndpoint}/drives/{driveId}/items/{itemId}`
	 */
	static extractDriveItemFromURL(sharePointUrl: string): { driveId: string; itemId: string } {
		const url = new URL(sharePointUrl)
		const pathSegments = url.pathname.split("/").filter((segment) => segment.length > 0)

		const drivesIndex = pathSegments.indexOf("drives")
		const itemsIndex = pathSegments.indexOf("items")

		if (drivesIndex === -1 || itemsIndex === -1 || drivesIndex >= itemsIndex) {
			throw new BadRequestError(`OneDriveService: Invalid SharePoint URL format: ${sharePointUrl}`)
		}

		const driveId = pathSegments[drivesIndex + 1]
		const itemId = pathSegments[itemsIndex + 1]

		if (!driveId || !itemId) {
			throw new BadRequestError(`OneDriveService: Could not extract driveId or itemId from URL: ${sharePointUrl}`)
		}

		return {
			driveId: OneDriveService.formatDriveId(driveId),
			itemId: OneDriveService.formatItemId(itemId),
		}
	}

	// Convert itemId to standard format
	static formatItemId(itemId: string): string {
		return itemId // TODO: no need to format itemId yet
	}

	// Convert driveId to standard format
	static formatDriveId(driveId: string): string {
		// b! prefix indicates Organization account (not Hex), leave as-is
		if (driveId.startsWith("b!")) {
			return driveId
		}

		// Otherwise it's likely Hex:
		// 1. Strip leading zeros
		// 2. Convert to UPPERCASE
		return driveId.replace(/^0+/, "").toUpperCase()
	}

	// Format the drive item to the standard format
	static formatDriveItem(item: DriveItem): DriveItem {
		if (item.id) {
			item.id = OneDriveService.formatItemId(item.id)
		}
		if (item.parentReference?.driveId) {
			item.parentReference.driveId = OneDriveService.formatDriveId(item.parentReference.driveId)
		}
		if (item.parentReference?.id) {
			item.parentReference.id = OneDriveService.formatItemId(item.parentReference.id)
		}
		return item
	}

	static encodeOneDriveItemUri(item: DriveItem, driveType: "onedrive" | "sharepoint" = "onedrive"): string {
		const driveId = item.parentReference?.driveId
			? OneDriveService.formatDriveId(item.parentReference.driveId)
			: "unknown"
		const itemId = item.id ? OneDriveService.formatItemId(item.id) : "unknown"
		const siteId = item.parentReference?.siteId ?? "unknown"

		return driveType === "onedrive" ? `onedrive://${driveId}/${itemId}` : `sharepoint://${siteId}/${driveId}/${itemId}`
	}
}
