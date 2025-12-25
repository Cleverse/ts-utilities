"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var import_crypto = __toESM(require("crypto"), 1);
var import_vitest = require("vitest");
var import_index = require("./index");
(0, import_vitest.describe)("EncryptionModule", () => {
  const validKey = "12345678901234567890123456789012";
  const data = new Uint8Array(Buffer.from("hello world"));
  (0, import_vitest.describe)("aesGcmEncrypt", () => {
    (0, import_vitest.it)("should encrypt data correctly and return ciphertext and nonce", async () => {
      const result = await import_index.EncryptionModule.aesGcmEncrypt(data, validKey);
      (0, import_vitest.expect)(result.ciphertext).toBeDefined();
      (0, import_vitest.expect)(typeof result.ciphertext).toBe("string");
      (0, import_vitest.expect)(result.nonce).toBeDefined();
      (0, import_vitest.expect)(result.nonce).toBeInstanceOf(Uint8Array);
      (0, import_vitest.expect)(result.nonce.length).toBe(12);
    });
    (0, import_vitest.it)("should use provided nonce if given", async () => {
      const nonce = import_crypto.default.randomBytes(12);
      const result = await import_index.EncryptionModule.aesGcmEncrypt(data, validKey, nonce);
      (0, import_vitest.expect)(result.nonce).toEqual(new Uint8Array(nonce));
    });
    (0, import_vitest.it)("should throw error if key length is invalid", async () => {
      await (0, import_vitest.expect)(import_index.EncryptionModule.aesGcmEncrypt(data, "invalid-length")).rejects.toThrow(
        "Encryption key must be exactly 32 bytes for AES-256"
      );
    });
  });
  (0, import_vitest.describe)("aesGcmDecrypt", () => {
    (0, import_vitest.it)("should decrypt data correctly", async () => {
      const { ciphertext, nonce } = await import_index.EncryptionModule.aesGcmEncrypt(data, validKey);
      const decrypted = await import_index.EncryptionModule.aesGcmDecrypt(ciphertext, nonce, validKey);
      (0, import_vitest.expect)(decrypted).toEqual(data);
      (0, import_vitest.expect)(Buffer.from(decrypted).toString()).toBe("hello world");
    });
    (0, import_vitest.it)("should throw error if key length is invalid", async () => {
      const { ciphertext, nonce } = await import_index.EncryptionModule.aesGcmEncrypt(data, validKey);
      await (0, import_vitest.expect)(import_index.EncryptionModule.aesGcmDecrypt(ciphertext, nonce, "invalid-length")).rejects.toThrow(
        "Encryption key must be exactly 32 bytes for AES-256"
      );
    });
    (0, import_vitest.it)("should fail to decrypt with wrong key", async () => {
      const { ciphertext, nonce } = await import_index.EncryptionModule.aesGcmEncrypt(data, validKey);
      const wrongKey = "12345678901234567890123456789013";
      await (0, import_vitest.expect)(import_index.EncryptionModule.aesGcmDecrypt(ciphertext, nonce, wrongKey)).rejects.toThrow(
        "Failed to decrypt data"
      );
    });
  });
});
//# sourceMappingURL=index.spec.cjs.map