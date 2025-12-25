"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var client_exports = {};
__export(client_exports, {
  KMSClient: () => KMSClient
});
module.exports = __toCommonJS(client_exports);
var import_kms = require("@google-cloud/kms");
var import_verror = require("verror");
class KMSClient {
  constructor(config) {
    this.config = config;
    this.client = new import_kms.KeyManagementServiceClient();
    this.keyName = this.client.cryptoKeyPath(
      this.config.project,
      this.config.location,
      this.config.keyRing,
      this.config.key
    );
  }
  client;
  keyName;
  /**
   * Encrypts plaintext using Google Cloud KMS.
   *
   * The encrypt() method automatically detects key type (CryptoKey or CryptoKeyVersion) and uses the appropriate method for encryption
   * - `CryptoKey`: Symmetric encryption with the primary key version
   * - `CryptoKeyVersion`: Asymmetric encryption with public key of the specified version
   */
  async encrypt(plaintext, cryptoKeyVersion) {
    try {
      const keyName = cryptoKeyVersion ? this.client.cryptoKeyVersionPath(
        this.config.project,
        this.config.location,
        this.config.keyRing,
        this.config.key,
        cryptoKeyVersion
      ) : this.keyName;
      const [encryptResponse] = await this.client.encrypt({
        name: keyName,
        plaintext: Buffer.from(plaintext)
      });
      if (!encryptResponse?.ciphertext || !encryptResponse.name) {
        throw new import_verror.VError("Not all required fields returned from KMS");
      }
      const nameparts = encryptResponse.name.split("/");
      cryptoKeyVersion = nameparts[nameparts.length - 1];
      if (!cryptoKeyVersion) {
        throw new import_verror.VError("No crypto key version returned from KMS");
      }
      return {
        ciphertext: Buffer.from(encryptResponse.ciphertext).toString("base64"),
        cryptoKeyVersion
      };
    } catch (error) {
      throw new import_verror.VError(error, "Failed to encrypt with KMS");
    }
  }
  /**
   * Decrypts ciphertext using Google Cloud KMS
   */
  async decrypt(ciphertext) {
    try {
      const ciphertextBuffer = Buffer.from(ciphertext, "base64");
      const [decryptResponse] = await this.client.decrypt({
        name: this.keyName,
        ciphertext: ciphertextBuffer
      });
      if (!decryptResponse.plaintext) {
        throw new import_verror.VError("No plaintext returned from KMS");
      }
      return Buffer.from(decryptResponse.plaintext).toString();
    } catch (error) {
      throw new import_verror.VError(error, "Failed to decrypt with KMS");
    }
  }
  /**
   * Decrypts ciphertext using Google Cloud KMS with asymmetric key
   * Note: Asymmetric decryption requires specifying the exact key version used for encryption
   */
  async decryptAsymmetric(ciphertext, cryptoKeyVersion) {
    try {
      const ciphertextBuffer = Buffer.from(ciphertext, "base64");
      const keyName = this.client.cryptoKeyVersionPath(
        this.config.project,
        this.config.location,
        this.config.keyRing,
        this.config.key,
        cryptoKeyVersion
      );
      const [decryptResponse] = await this.client.asymmetricDecrypt({
        name: keyName,
        ciphertext: ciphertextBuffer
      });
      if (!decryptResponse.plaintext) {
        throw new import_verror.VError("No plaintext returned from KMS");
      }
      return Buffer.from(decryptResponse.plaintext).toString();
    } catch (error) {
      throw new import_verror.VError(error, "Failed to decrypt asymmetrically with KMS");
    }
  }
  /**
   * Closes the KMS client connection
   */
  async close() {
    await this.client.close();
  }
}
//# sourceMappingURL=client.cjs.map