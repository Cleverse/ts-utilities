"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }

var _chunkT6TWWATEcjs = require('./chunk-T6TWWATE.cjs');

// src/kms/client.ts
_chunkT6TWWATEcjs.init_cjs_shims.call(void 0, );
var _crypto = require('crypto'); var _crypto2 = _interopRequireDefault(_crypto);
var _kms = require('@google-cloud/kms');
var _verror = require('verror');
var KMSClient = class {
  constructor(config) {
    this.config = config;
    this.client = new (0, _kms.KeyManagementServiceClient)();
    this.keyName = this.client.cryptoKeyPath(
      this.config.project,
      this.config.location,
      this.config.keyRing,
      this.config.key
    );
  }
  
  
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
          throw new (0, _verror.VError)("Crypto key version is required for asymmetric encryption");
        }
        return await this.encryptAsymmetric(plaintext, cryptoKeyVersion);
      }
      const [encryptResponse] = await this.client.encrypt({
        name: this.keyName,
        plaintext: Buffer.from(plaintext)
      });
      if (!_optionalChain([encryptResponse, 'optionalAccess', _ => _.ciphertext]) || !encryptResponse.name) {
        throw new (0, _verror.VError)("Not all required fields returned from KMS");
      }
      const nameparts = encryptResponse.name.split("/");
      const version = nameparts[nameparts.length - 1];
      if (!version) {
        throw new (0, _verror.VError)("No crypto key version returned from KMS");
      }
      return {
        ciphertext: Buffer.from(encryptResponse.ciphertext).toString("base64"),
        cryptoKeyVersion: version
      };
    } catch (error) {
      if (error instanceof _verror.VError) throw error;
      throw new (0, _verror.VError)(error, "Failed to encrypt with KMS");
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
          throw new (0, _verror.VError)("Public key PEM not found from KMS");
        }
        const algorithm = _optionalChain([publicKey, 'access', _2 => _2.algorithm, 'optionalAccess', _3 => _3.toString, 'call', _4 => _4(), 'access', _5 => _5.toLowerCase, 'call', _6 => _6()]) || "";
        const hash2 = algorithm.includes("sha256") ? "sha256" : algorithm.includes("sha512") ? "sha512" : algorithm.includes("sha1") ? "sha1" : "sha256";
        this.#pubkeys.set(keyVersionName, { pem: publicKey.pem, hash: hash2 });
      }
      const { pem, hash } = this.#pubkeys.get(keyVersionName);
      const ciphertext = _crypto2.default.publicEncrypt(
        {
          key: pem,
          padding: _crypto2.default.constants.RSA_PKCS1_OAEP_PADDING,
          oaepHash: hash
        },
        Buffer.from(plaintext)
      );
      return {
        ciphertext: ciphertext.toString("base64"),
        cryptoKeyVersion
      };
    } catch (error) {
      throw new (0, _verror.VError)(error, "Failed to encrypt asymmetrically with KMS");
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
          throw new (0, _verror.VError)("Crypto key version is required for asymmetric decryption");
        }
        return await this.decryptAsymmetric(ciphertext, cryptoKeyVersion);
      }
      const ciphertextBuffer = Buffer.from(ciphertext, "base64");
      const [decryptResponse] = await this.client.decrypt({
        name: this.keyName,
        ciphertext: ciphertextBuffer
      });
      if (!decryptResponse.plaintext) {
        throw new (0, _verror.VError)("No plaintext returned from KMS");
      }
      return Buffer.from(decryptResponse.plaintext).toString();
    } catch (error) {
      throw new (0, _verror.VError)(error, "Failed to decrypt with KMS");
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
        throw new (0, _verror.VError)("No plaintext returned from KMS");
      }
      return Buffer.from(decryptResponse.plaintext).toString();
    } catch (error) {
      throw new (0, _verror.VError)(error, "Failed to decrypt asymmetrically with KMS");
    }
  }
  /**
   * Closes the KMS client connection
   */
  async close() {
    await this.client.close();
  }
};



exports.KMSClient = KMSClient;
//# sourceMappingURL=chunk-AIZOMPYG.cjs.map