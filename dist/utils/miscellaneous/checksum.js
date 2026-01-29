import "../../chunk-G3PMV62Z.js";

// src/utils/miscellaneous/checksum.ts
import base64url from "base64url";
var ChecksumUtils = class {
  /**
   * Serialize the checksum into a string in the format of `{algorithm}:{hash}`
   * @param {ChecksumAlgorithm} algorithm - The algorithm to use
   * @param {string} hash - The hash to stringify
   * @returns The checksum string in the format of `{algorithm}:{hash}`
   */
  static serialize(algorithm, hash) {
    return `${algorithm}:${hash}`;
  }
  /**
   * Deserialize the checksum string into algorithm and hash
   * @param {string} checksum - The checksum string in the format of `{algorithm}:{hash}` or `{hash}` for md5
   * @returns The algorithm and hash
   */
  static deserialize(checksum) {
    const parts = checksum.split(":");
    if (parts.length === 1) {
      return { algorithm: "md5", hash: parts[0] ?? "" };
    }
    return { algorithm: parts[0], hash: parts[1] ?? "" };
  }
  /**
   * Check if the checksums can be compared (same algorithm)
   * @param {string} a - The first checksum
   * @param {string} b - The second checksum
   * @returns {boolean} True if the checksums can be compared
   */
  static canCompare(a, b) {
    const aParts = this.deserialize(a);
    const bParts = this.deserialize(b);
    return aParts.algorithm === bParts.algorithm;
  }
  /**
   * Compare two checksums
   * @param {string} a - The first checksum
   * @param {string} b - The second checksum
   * @returns {boolean} True if the checksums are the same
   */
  static compare(a, b) {
    const aParts = this.deserialize(a);
    const bParts = this.deserialize(b);
    return aParts.algorithm === bParts.algorithm && aParts.hash === bParts.hash;
  }
};
var SafeChecksum = class {
  static encode(str) {
    return base64url.fromBase64(str);
  }
  static decode(str) {
    return base64url.toBase64(str);
  }
};
export {
  ChecksumUtils,
  SafeChecksum
};
//# sourceMappingURL=checksum.js.map