"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var encryption_exports = {};
__export(encryption_exports, {
  EncryptionModule: () => EncryptionModule
});
module.exports = __toCommonJS(encryption_exports);
var import_crypto = __toESM(require("crypto"), 1);
var import_verror = __toESM(require("verror"), 1);
class EncryptionModule {
  /**
   * Encrypts data using AES-GCM algorithm
   */
  static async aesGcmEncrypt(data, encryptionKey, nonce) {
    try {
      const actualNonce = nonce ?? import_crypto.default.randomBytes(12);
      const keyBuffer = Buffer.from(encryptionKey, "utf8");
      if (keyBuffer.length !== 32) {
        throw new import_verror.default("Encryption key must be exactly 32 bytes for AES-256");
      }
      const cipher = import_crypto.default.createCipheriv("aes-256-gcm", keyBuffer, actualNonce);
      const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);
      const authTag = cipher.getAuthTag();
      const ciphertext = Buffer.concat([encrypted, authTag]);
      const base64Ciphertext = ciphertext.toString("base64");
      return {
        ciphertext: base64Ciphertext,
        nonce: new Uint8Array(actualNonce)
      };
    } catch (error) {
      throw new import_verror.default(error, `Failed to encrypt data`);
    }
  }
  /**
   * Decrypts data using AES-GCM algorithm
   */
  static async aesGcmDecrypt(data, nonce, encryptionKey) {
    try {
      const keyBuffer = Buffer.from(encryptionKey, "utf8");
      if (keyBuffer.length !== 32) {
        throw new import_verror.default("Encryption key must be exactly 32 bytes for AES-256");
      }
      const decodedData = Buffer.from(data, "base64");
      const authTag = decodedData.subarray(-16);
      const encrypted = decodedData.subarray(0, -16);
      const decipher = import_crypto.default.createDecipheriv("aes-256-gcm", keyBuffer, Buffer.from(nonce));
      decipher.setAuthTag(authTag);
      const plaintext = Buffer.concat([decipher.update(encrypted), decipher.final()]);
      return new Uint8Array(plaintext);
    } catch (error) {
      throw new import_verror.default(error, `Failed to decrypt data`);
    }
  }
}
//# sourceMappingURL=index.cjs.map