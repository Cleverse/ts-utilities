type ChecksumAlgorithm = "md5" | "crc32c" | "sha1" | "sha256" | "sha512" | "quickXorHash";
declare class ChecksumUtils {
    /**
     * Serialize the checksum into a string in the format of `{algorithm}:{hash}`
     * @param {ChecksumAlgorithm} algorithm - The algorithm to use
     * @param {string} hash - The hash to stringify
     * @returns The checksum string in the format of `{algorithm}:{hash}`
     */
    static serialize(algorithm: ChecksumAlgorithm, hash: string): string;
    /**
     * Deserialize the checksum string into algorithm and hash
     * @param {string} checksum - The checksum string in the format of `{algorithm}:{hash}` or `{hash}` for md5
     * @returns The algorithm and hash
     */
    static deserialize(checksum: string): {
        algorithm: ChecksumAlgorithm;
        hash: string;
    };
    /**
     * Check if the checksums can be compared (same algorithm)
     * @param {string} a - The first checksum
     * @param {string} b - The second checksum
     * @returns {boolean} True if the checksums can be compared
     */
    static canCompare(a: string, b: string): boolean;
    /**
     * Compare two checksums
     * @param {string} a - The first checksum
     * @param {string} b - The second checksum
     * @returns {boolean} True if the checksums are the same
     */
    static compare(a: string, b: string): boolean;
}
/**
 * SafeChecksum is a class that provides methods to encode and decode checksums to base64url.
 * Currently, we only support for base64 input.
 */
declare class SafeChecksum {
    static encode(str: string): string;
    static decode(str: string): string;
}

export { type ChecksumAlgorithm, ChecksumUtils, SafeChecksum };
