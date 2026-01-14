"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } }

var _chunk5JHPDOVLcjs = require('./chunk-5JHPDOVL.cjs');

// src/encryption/index.ts
_chunk5JHPDOVLcjs.init_cjs_shims.call(void 0, );
var _crypto = require('crypto'); var _crypto2 = _interopRequireDefault(_crypto);
var _verror = require('verror'); var _verror2 = _interopRequireDefault(_verror);
var EncryptionModule = class {
  /**
   * Encrypts data using AES-GCM algorithm
   */
  static async aesGcmEncrypt(data, encryptionKey, nonce) {
    try {
      const actualNonce = _nullishCoalesce(nonce, () => ( _crypto2.default.randomBytes(12)));
      const keyBuffer = Buffer.from(encryptionKey, "utf8");
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
  static async aesGcmDecrypt(data, nonce, encryptionKey) {
    try {
      const keyBuffer = Buffer.from(encryptionKey, "utf8");
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
};



exports.EncryptionModule = EncryptionModule;
//# sourceMappingURL=chunk-DCHAHK5W.cjs.map