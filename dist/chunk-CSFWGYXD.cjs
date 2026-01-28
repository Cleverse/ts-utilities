"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } }

var _chunkCU6GGSDDcjs = require('./chunk-CU6GGSDD.cjs');


var _chunkT6TWWATEcjs = require('./chunk-T6TWWATE.cjs');

// src/encryption/index.ts
_chunkT6TWWATEcjs.init_cjs_shims.call(void 0, );
var _crypto = require('crypto'); var _crypto2 = _interopRequireDefault(_crypto);
var _verror = require('verror'); var _verror2 = _interopRequireDefault(_verror);

// src/encryption/encryption.service.ts
_chunkT6TWWATEcjs.init_cjs_shims.call(void 0, );

var EnvelopeEncryptionService = class {
  constructor(kmsClient, sharedDEKDatagateway, config) {
    this.kmsClient = kmsClient;
    this.sharedDEKDatagateway = sharedDEKDatagateway;
    this.config = config;
  }
  // NOTE: Always use `#` instead of `private` keyword for serious private properties to avoid by-passing the access control
  #deks = /* @__PURE__ */ new Map();
  /**
   * Encrypt the data using the DEK
   */
  async encrypt(data, nonce, dekVersion) {
    const dek = await this.#getDEK(dekVersion);
    if (!dek) {
      throw new (0, _verror.VError)(`Failed to encrypt data, DEK not found`);
    }
    const encrypted = await EncryptionModule.encrypt(data, dek.dek, nonce);
    return {
      dekVersion: dek.version,
      nonce: encrypted.nonce,
      ciphertext: encrypted.ciphertext
    };
  }
  /**
   * Decrypt the data using the DEK
   */
  async decrypt(ciphertext, nonce, dekVersion) {
    const dek = await this.#getDEK(dekVersion);
    if (!dek) {
      throw new (0, _verror.VError)(`Failed to decrypt data, DEK not found`);
    }
    return EncryptionModule.decrypt(ciphertext, nonce, dek.dek);
  }
  /**
   * Rotates the DEK by encrypting a new DEK with the KMS client and inserting it into the database
   *
   * @param kekVersion The version of the KMS key to use for encryption. Required for asymmetric encryption.
   */
  async rotateDEK(kekVersion) {
    const dek = EncryptionModule.generateEncryptionKey("hex");
    const { ciphertext, cryptoKeyVersion } = await this.kmsClient.encrypt(dek, kekVersion);
    const { version } = await this.sharedDEKDatagateway.insertNewDEK(ciphertext, parseInt(cryptoKeyVersion, 10));
    return version;
  }
  async #getDEK(version) {
    const dekVersion = _nullishCoalesce(version, () => ( this.config.defaultVersion));
    return _chunkCU6GGSDDcjs.SingleFlight.withLock(`ts-utilities:encryption:getdek:${_nullishCoalesce(dekVersion, () => ( "latest"))}`, async () => {
      if (dekVersion) {
        const dek2 = this.#deks.get(dekVersion);
        if (dek2) {
          return dek2;
        }
      }
      const encryptedDek = await this.sharedDEKDatagateway.getDEK(dekVersion);
      if (!encryptedDek) {
        return null;
      }
      const dek = await this.kmsClient.decrypt(encryptedDek.encryptedDek, encryptedDek.kekVersion.toString());
      const decryptedDek = {
        version: encryptedDek.version,
        dek,
        kekVersion: encryptedDek.kekVersion
      };
      this.#deks.set(decryptedDek.version, decryptedDek);
      return decryptedDek;
    });
  }
};

// src/encryption/index.ts
var EncryptionModule = class _EncryptionModule {
  /**
   * Encrypts data using AES-GCM algorithm
   */
  static async encrypt(data, encryptionKey, nonce) {
    try {
      if (nonce && nonce.length !== 12) {
        throw new (0, _verror2.default)("Nonce must be exactly 12 bytes");
      }
      const actualNonce = _nullishCoalesce(nonce, () => ( _crypto2.default.randomBytes(12)));
      const keyBuffer = _EncryptionModule.getKeyBuffer(encryptionKey);
      if (keyBuffer.length !== 32) {
        throw new (0, _verror2.default)("Encryption key must be exactly 32 bytes for AES-256");
      }
      const cipher = _crypto2.default.createCipheriv("aes-256-gcm", keyBuffer, actualNonce);
      const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);
      const authTag = cipher.getAuthTag();
      const ciphertext = Buffer.concat([encrypted, authTag]);
      const base64Ciphertext = ciphertext.toString("base64");
      return {
        ciphertext: base64Ciphertext,
        nonce: new Uint8Array(actualNonce)
      };
    } catch (error) {
      throw new (0, _verror2.default)(error, `Failed to encrypt data`);
    }
  }
  /**
   * Decrypts data using AES-GCM algorithm
   */
  static async decrypt(data, nonce, encryptionKey) {
    try {
      const keyBuffer = _EncryptionModule.getKeyBuffer(encryptionKey);
      if (keyBuffer.length !== 32) {
        throw new (0, _verror2.default)("Encryption key must be exactly 32 bytes for AES-256");
      }
      const decodedData = Buffer.from(data, "base64");
      const authTag = decodedData.subarray(-16);
      const encrypted = decodedData.subarray(0, -16);
      const decipher = _crypto2.default.createDecipheriv("aes-256-gcm", keyBuffer, Buffer.from(nonce));
      decipher.setAuthTag(authTag);
      const plaintext = Buffer.concat([decipher.update(encrypted), decipher.final()]);
      return new Uint8Array(plaintext);
    } catch (error) {
      throw new (0, _verror2.default)(error, `Failed to decrypt data`);
    }
  }
  /**
   * Generates a random 32-character encryption key suitable for use with aesGcmEncrypt
   */
  static generateEncryptionKey(encoding = "hex") {
    switch (encoding) {
      case "utf8":
        return _crypto2.default.randomBytes(16).toString("hex");
      default:
        return _crypto2.default.randomBytes(32).toString(encoding);
    }
  }
  static getKeyBuffer(key) {
    if (key.length === 64 && /^[0-9a-fA-F]+$/.test(key)) {
      return Buffer.from(key, "hex");
    }
    if (key.length === 44 && /^[a-zA-Z0-9+/=]+$/.test(key)) {
      return Buffer.from(key, "base64");
    }
    return Buffer.from(key, "utf8");
  }
};




exports.EncryptionModule = EncryptionModule; exports.EnvelopeEncryptionService = EnvelopeEncryptionService;
//# sourceMappingURL=chunk-CSFWGYXD.cjs.map