// src/kms/client.ts
import crypto from "crypto";
import { KeyManagementServiceClient } from "@google-cloud/kms";
import { VError } from "verror";
var KMSClient = class {
  constructor(config) {
    this.config = config;
    this.client = new KeyManagementServiceClient();
    this.keyName = this.client.cryptoKeyPath(
      this.config.project,
      this.config.location,
      this.config.keyRing,
      this.config.key
    );
  }
  client;
  keyName;
  #pubkeys = /* @__PURE__ */ new Map();
  /**
   * Encrypts plaintext using Google Cloud KMS.
   * Ref: https://docs.cloud.google.com/kms/docs/encrypt-decrypt#kms-encrypt-symmetric-nodejs
   *
   * The encrypt() method automatically detects key type (CryptoKey or CryptoKeyVersion) and uses the appropriate method for encryption
   * - `CryptoKey`: Symmetric encryption with the primary key version
   * - `CryptoKeyVersion`: Asymmetric encryption with public key of the specified version
   */
  async encrypt(plaintext, cryptoKeyVersion) {
    try {
      if (this.config.keyBased === "asymmetric") {
        if (!cryptoKeyVersion) {
          throw new VError("Crypto key version is required for asymmetric encryption");
        }
        return await this.encryptAsymmetric(plaintext, cryptoKeyVersion);
      }
      const [encryptResponse] = await this.client.encrypt({
        name: this.keyName,
        plaintext: Buffer.from(plaintext)
      });
      if (!encryptResponse?.ciphertext || !encryptResponse.name) {
        throw new VError("Not all required fields returned from KMS");
      }
      const nameparts = encryptResponse.name.split("/");
      const version = nameparts[nameparts.length - 1];
      if (!version) {
        throw new VError("No crypto key version returned from KMS");
      }
      return {
        ciphertext: Buffer.from(encryptResponse.ciphertext).toString("base64"),
        cryptoKeyVersion: version
      };
    } catch (error) {
      if (error instanceof VError) throw error;
      throw new VError(error, "Failed to encrypt with KMS");
    }
  }
  /**
   * Encrypts plaintext using Google Cloud KMS with asymmetric key (public key).
   * Ref: https://docs.cloud.google.com/kms/docs/encrypt-decrypt-rsa#kms-encrypt-asymmetric-nodejs
   */
  async encryptAsymmetric(plaintext, cryptoKeyVersion) {
    try {
      const keyVersionName = this.client.cryptoKeyVersionPath(
        this.config.project,
        this.config.location,
        this.config.keyRing,
        this.config.key,
        cryptoKeyVersion
      );
      if (!this.#pubkeys.has(keyVersionName)) {
        const [publicKey] = await this.client.getPublicKey({ name: keyVersionName });
        if (!publicKey.pem) {
          throw new VError("Public key PEM not found from KMS");
        }
        const algorithm = publicKey.algorithm?.toString().toLowerCase() || "";
        const hash2 = algorithm.includes("sha256") ? "sha256" : algorithm.includes("sha512") ? "sha512" : algorithm.includes("sha1") ? "sha1" : "sha256";
        this.#pubkeys.set(keyVersionName, { pem: publicKey.pem, hash: hash2 });
      }
      const { pem, hash } = this.#pubkeys.get(keyVersionName);
      const ciphertext = crypto.publicEncrypt(
        {
          key: pem,
          padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
          oaepHash: hash
        },
        Buffer.from(plaintext)
      );
      return {
        ciphertext: ciphertext.toString("base64"),
        cryptoKeyVersion
      };
    } catch (error) {
      throw new VError(error, "Failed to encrypt asymmetrically with KMS");
    }
  }
  /**
   * Decrypts ciphertext using Google Cloud KMS
   * Ref: https://docs.cloud.google.com/kms/docs/encrypt-decrypt#kms-decrypt-symmetric-nodejs
   *
   * The decrypt() method automatically detects key type (CryptoKey or CryptoKeyVersion) and uses the appropriate method for decryption
   * - `CryptoKey`: Symmetric decryption with the primary key version
   * - `CryptoKeyVersion`: Asymmetric decryption with public key of the specified version
   */
  async decrypt(ciphertext, cryptoKeyVersion) {
    try {
      if (this.config.keyBased === "asymmetric") {
        if (!cryptoKeyVersion) {
          throw new VError("Crypto key version is required for asymmetric decryption");
        }
        return await this.decryptAsymmetric(ciphertext, cryptoKeyVersion);
      }
      const ciphertextBuffer = Buffer.from(ciphertext, "base64");
      const [decryptResponse] = await this.client.decrypt({
        name: this.keyName,
        ciphertext: ciphertextBuffer
      });
      if (!decryptResponse.plaintext) {
        throw new VError("No plaintext returned from KMS");
      }
      return Buffer.from(decryptResponse.plaintext).toString();
    } catch (error) {
      throw new VError(error, "Failed to decrypt with KMS");
    }
  }
  /**
   * Decrypts ciphertext using Google Cloud KMS with asymmetric key
   * Note: Asymmetric decryption requires specifying the exact key version used for encryption
   * Ref: https://docs.cloud.google.com/kms/docs/encrypt-decrypt-rsa#kms-decrypt-asymmetric-nodejs
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
        throw new VError("No plaintext returned from KMS");
      }
      return Buffer.from(decryptResponse.plaintext).toString();
    } catch (error) {
      throw new VError(error, "Failed to decrypt asymmetrically with KMS");
    }
  }
  /**
   * Closes the KMS client connection
   */
  async close() {
    await this.client.close();
  }
};

export {
  KMSClient
};
//# sourceMappingURL=chunk-YUJAA2L3.js.map