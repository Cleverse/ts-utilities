"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }

var _chunk5JHPDOVLcjs = require('./chunk-5JHPDOVL.cjs');

// src/kms/client.ts
_chunk5JHPDOVLcjs.init_cjs_shims.call(void 0, );
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
      if (!_optionalChain([encryptResponse, 'optionalAccess', _ => _.ciphertext]) || !encryptResponse.name) {
        throw new (0, _verror.VError)("Not all required fields returned from KMS");
      }
      const nameparts = encryptResponse.name.split("/");
      cryptoKeyVersion = nameparts[nameparts.length - 1];
      if (!cryptoKeyVersion) {
        throw new (0, _verror.VError)("No crypto key version returned from KMS");
      }
      return {
        ciphertext: Buffer.from(encryptResponse.ciphertext).toString("base64"),
        cryptoKeyVersion
      };
    } catch (error) {
      throw new (0, _verror.VError)(error, "Failed to encrypt with KMS");
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
//# sourceMappingURL=chunk-O6SZ4EAA.cjs.map