import base64url from "base64url"

export type ChecksumAlgorithm = "md5" | "crc32c" | "sha1" | "sha256" | "sha512" | "quickXorHash"

export class ChecksumUtils {
	/**
	 * Serialize the checksum into a string in the format of `{algorithm}:{hash}`
	 * @param {ChecksumAlgorithm} algorithm - The algorithm to use
	 * @param {string} hash - The hash to stringify
	 * @returns The checksum string in the format of `{algorithm}:{hash}`
	 */
	static serialize(algorithm: ChecksumAlgorithm, hash: string): string {
		return `${algorithm}:${hash}`
	}

	/**
	 * Deserialize the checksum string into algorithm and hash
	 * @param {string} checksum - The checksum string in the format of `{algorithm}:{hash}` or `{hash}` for md5
	 * @returns The algorithm and hash
	 */
	static deserialize(checksum: string): { algorithm: ChecksumAlgorithm; hash: string } {
		const parts = checksum.split(":")
		if (parts.length === 1) {
			return { algorithm: "md5", hash: parts[0] ?? "" }
		}
		return { algorithm: parts[0] as ChecksumAlgorithm, hash: parts[1] ?? "" }
	}

	/**
	 * Check if the checksums can be compared (same algorithm)
	 * @param {string} a - The first checksum
	 * @param {string} b - The second checksum
	 * @returns {boolean} True if the checksums can be compared
	 */
	static canCompare(a: string, b: string): boolean {
		const aParts = this.deserialize(a)
		const bParts = this.deserialize(b)
		return aParts.algorithm === bParts.algorithm
	}

	/**
	 * Compare two checksums
	 * @param {string} a - The first checksum
	 * @param {string} b - The second checksum
	 * @returns {boolean} True if the checksums are the same
	 */
	static compare(a: string, b: string): boolean {
		const aParts = this.deserialize(a)
		const bParts = this.deserialize(b)
		return aParts.algorithm === bParts.algorithm && aParts.hash === bParts.hash
	}
}

/**
 * SafeChecksum is a class that provides methods to encode and decode checksums to base64url.
 * Currently, we only support for base64 input.
 */
export class SafeChecksum {
	static encode(str: string): string {
		return base64url.fromBase64(str)
	}
	static decode(str: string): string {
		return base64url.toBase64(str)
	}
}
