import {
  EncryptionModule
} from "../chunk-EK655D66.js";
import "../chunk-SLMXJXNK.js";
import "../chunk-2U6RGUPV.js";
import "../chunk-TBVESBXG.js";
import {
  describe,
  globalExpect,
  it
} from "../chunk-AZYASILH.js";
import "../chunk-G3PMV62Z.js";

// src/encryption/index.spec.ts
import crypto from "crypto";
describe("EncryptionModule", () => {
  const validKey = "12345678901234567890123456789012";
  const data = new Uint8Array(Buffer.from("hello world"));
  describe("aesGcmEncrypt", () => {
    it("should encrypt data correctly and return ciphertext and nonce", async () => {
      const result = await EncryptionModule.encrypt(data, validKey);
      globalExpect(result.ciphertext).toBeDefined();
      globalExpect(typeof result.ciphertext).toBe("string");
      globalExpect(result.nonce).toBeDefined();
      globalExpect(result.nonce).toBeInstanceOf(Uint8Array);
      globalExpect(result.nonce.length).toBe(12);
    });
    it("should use provided nonce if given", async () => {
      const nonce = crypto.randomBytes(12);
      const result = await EncryptionModule.encrypt(data, validKey, nonce);
      globalExpect(result.nonce).toEqual(new Uint8Array(nonce));
    });
    it("should throw error if key length is invalid", async () => {
      await globalExpect(EncryptionModule.encrypt(data, "invalid-length")).rejects.toThrow(
        "Encryption key must be exactly 32 bytes for AES-256"
      );
    });
  });
  describe("aesGcmDecrypt", () => {
    it("should decrypt data correctly", async () => {
      const { ciphertext, nonce } = await EncryptionModule.encrypt(data, validKey);
      const decrypted = await EncryptionModule.decrypt(ciphertext, nonce, validKey);
      globalExpect(decrypted).toEqual(data);
      globalExpect(Buffer.from(decrypted).toString()).toBe("hello world");
    });
    it("should throw error if key length is invalid", async () => {
      const { ciphertext, nonce } = await EncryptionModule.encrypt(data, validKey);
      await globalExpect(EncryptionModule.decrypt(ciphertext, nonce, "invalid-length")).rejects.toThrow(
        "Encryption key must be exactly 32 bytes for AES-256"
      );
    });
    it("should fail to decrypt with wrong key", async () => {
      const { ciphertext, nonce } = await EncryptionModule.encrypt(data, validKey);
      const wrongKey = "12345678901234567890123456789013";
      await globalExpect(EncryptionModule.decrypt(ciphertext, nonce, wrongKey)).rejects.toThrow("Failed to decrypt data");
    });
  });
  describe("generateEncryptionKey", () => {
    it("should generate a 64-character hex key by default (32 bytes)", () => {
      const key = EncryptionModule.generateEncryptionKey();
      globalExpect(typeof key).toBe("string");
      globalExpect(key.length).toBe(64);
      globalExpect(/^[0-9a-fA-F]+$/.test(key)).toBe(true);
    });
    it("should generate a 64-character hex key when specified", () => {
      const key = EncryptionModule.generateEncryptionKey("hex");
      globalExpect(typeof key).toBe("string");
      globalExpect(key.length).toBe(64);
      globalExpect(/^[0-9a-fA-F]+$/.test(key)).toBe(true);
    });
    it("should generate a 44-character base64 key (32 bytes)", () => {
      const key = EncryptionModule.generateEncryptionKey("base64");
      globalExpect(typeof key).toBe("string");
      globalExpect(key.length).toBe(44);
      globalExpect(/^[a-zA-Z0-9+/=]+$/.test(key)).toBe(true);
    });
    it("should generate a 32-character ascii key (32 bytes)", () => {
      const key = EncryptionModule.generateEncryptionKey("ascii");
      globalExpect(typeof key).toBe("string");
      globalExpect(key.length).toBe(32);
    });
    it("should generate a 32-character utf8 key (legacy fallback)", () => {
      const key = EncryptionModule.generateEncryptionKey("utf8");
      globalExpect(typeof key).toBe("string");
      globalExpect(key.length).toBe(32);
    });
    it("should generate different keys on subsequent calls", () => {
      const key1 = EncryptionModule.generateEncryptionKey();
      const key2 = EncryptionModule.generateEncryptionKey();
      globalExpect(key1).not.toBe(key2);
    });
    it.each(["hex", "base64", "ascii", "utf8"])(
      "should generate a key compatible with aesGcmEncrypt (%s)",
      async (encoding) => {
        const key = EncryptionModule.generateEncryptionKey(encoding);
        const data2 = new Uint8Array(Buffer.from("hello world"));
        const result = await EncryptionModule.encrypt(data2, key);
        globalExpect(result.ciphertext).toBeDefined();
        const decrypted = await EncryptionModule.decrypt(result.ciphertext, result.nonce, key);
        globalExpect(decrypted).toEqual(data2);
      }
    );
  });
  describe("Key Formats", () => {
    const hexKey = "6fb64e13eb0ad85478f7e792faf6ac8bf46ddd39483e8aed16a82cc5eaaead55";
    const base64Key = Buffer.from(hexKey, "hex").toString("base64");
    const utf8Key = "12345678901234567890123456789012";
    it("should support hex encoded key (64 chars)", async () => {
      const result = await EncryptionModule.encrypt(data, hexKey);
      globalExpect(result.ciphertext).toBeDefined();
      const decrypted = await EncryptionModule.decrypt(result.ciphertext, result.nonce, hexKey);
      globalExpect(decrypted).toEqual(data);
    });
    it("should support base64 encoded key (44 chars)", async () => {
      const result = await EncryptionModule.encrypt(data, base64Key);
      globalExpect(result.ciphertext).toBeDefined();
      const decrypted = await EncryptionModule.decrypt(result.ciphertext, result.nonce, base64Key);
      globalExpect(decrypted).toEqual(data);
    });
    it("should support utf8 key (32 chars)", async () => {
      const result = await EncryptionModule.encrypt(data, utf8Key);
      globalExpect(result.ciphertext).toBeDefined();
      const decrypted = await EncryptionModule.decrypt(result.ciphertext, result.nonce, utf8Key);
      globalExpect(decrypted).toEqual(data);
    });
  });
});
//# sourceMappingURL=index.spec.js.map