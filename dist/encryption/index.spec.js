import {
  EncryptionModule
} from "../chunk-ED3HDIOU.js";
import {
  describe,
  globalExpect,
  it
} from "../chunk-OKMIIXBO.js";
import "../chunk-G3PMV62Z.js";

// src/encryption/index.spec.ts
import crypto from "crypto";
describe("EncryptionModule", () => {
  const validKey = "12345678901234567890123456789012";
  const data = new Uint8Array(Buffer.from("hello world"));
  describe("aesGcmEncrypt", () => {
    it("should encrypt data correctly and return ciphertext and nonce", async () => {
      const result = await EncryptionModule.aesGcmEncrypt(data, validKey);
      globalExpect(result.ciphertext).toBeDefined();
      globalExpect(typeof result.ciphertext).toBe("string");
      globalExpect(result.nonce).toBeDefined();
      globalExpect(result.nonce).toBeInstanceOf(Uint8Array);
      globalExpect(result.nonce.length).toBe(12);
    });
    it("should use provided nonce if given", async () => {
      const nonce = crypto.randomBytes(12);
      const result = await EncryptionModule.aesGcmEncrypt(data, validKey, nonce);
      globalExpect(result.nonce).toEqual(new Uint8Array(nonce));
    });
    it("should throw error if key length is invalid", async () => {
      await globalExpect(EncryptionModule.aesGcmEncrypt(data, "invalid-length")).rejects.toThrow(
        "Encryption key must be exactly 32 bytes for AES-256"
      );
    });
  });
  describe("aesGcmDecrypt", () => {
    it("should decrypt data correctly", async () => {
      const { ciphertext, nonce } = await EncryptionModule.aesGcmEncrypt(data, validKey);
      const decrypted = await EncryptionModule.aesGcmDecrypt(ciphertext, nonce, validKey);
      globalExpect(decrypted).toEqual(data);
      globalExpect(Buffer.from(decrypted).toString()).toBe("hello world");
    });
    it("should throw error if key length is invalid", async () => {
      const { ciphertext, nonce } = await EncryptionModule.aesGcmEncrypt(data, validKey);
      await globalExpect(EncryptionModule.aesGcmDecrypt(ciphertext, nonce, "invalid-length")).rejects.toThrow(
        "Encryption key must be exactly 32 bytes for AES-256"
      );
    });
    it("should fail to decrypt with wrong key", async () => {
      const { ciphertext, nonce } = await EncryptionModule.aesGcmEncrypt(data, validKey);
      const wrongKey = "12345678901234567890123456789013";
      await globalExpect(EncryptionModule.aesGcmDecrypt(ciphertext, nonce, wrongKey)).rejects.toThrow(
        "Failed to decrypt data"
      );
    });
  });
});
//# sourceMappingURL=index.spec.js.map