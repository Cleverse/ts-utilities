import crypto from "crypto";
import VError from "verror";
class EncryptionModule {
  /**
   * Encrypts data using AES-GCM algorithm
   */
  static async aesGcmEncrypt(data, encryptionKey, nonce) {
    try {
      const actualNonce = nonce ?? crypto.randomBytes(12);
      const keyBuffer = Buffer.from(encryptionKey, "utf8");
      if (keyBuffer.length !== 32) {
        throw new VError("Encryption key must be exactly 32 bytes for AES-256");
      }
      const cipher = crypto.createCipheriv("aes-256-gcm", keyBuffer, actualNonce);
      const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);
      const authTag = cipher.getAuthTag();
      const ciphertext = Buffer.concat([encrypted, authTag]);
      const base64Ciphertext = ciphertext.toString("base64");
      return {
        ciphertext: base64Ciphertext,
        nonce: new Uint8Array(actualNonce)
      };
    } catch (error) {
      throw new VError(error, `Failed to encrypt data`);
    }
  }
  /**
   * Decrypts data using AES-GCM algorithm
   */
  static async aesGcmDecrypt(data, nonce, encryptionKey) {
    try {
      const keyBuffer = Buffer.from(encryptionKey, "utf8");
      if (keyBuffer.length !== 32) {
        throw new VError("Encryption key must be exactly 32 bytes for AES-256");
      }
      const decodedData = Buffer.from(data, "base64");
      const authTag = decodedData.subarray(-16);
      const encrypted = decodedData.subarray(0, -16);
      const decipher = crypto.createDecipheriv("aes-256-gcm", keyBuffer, Buffer.from(nonce));
      decipher.setAuthTag(authTag);
      const plaintext = Buffer.concat([decipher.update(encrypted), decipher.final()]);
      return new Uint8Array(plaintext);
    } catch (error) {
      throw new VError(error, `Failed to decrypt data`);
    }
  }
}
export {
  EncryptionModule
};
//# sourceMappingURL=index.js.map