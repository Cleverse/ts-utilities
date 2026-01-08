"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _chunkDCHAHK5Wcjs = require('../chunk-DCHAHK5W.cjs');




var _chunkXDMBOPPTcjs = require('../chunk-XDMBOPPT.cjs');


var _chunk5JHPDOVLcjs = require('../chunk-5JHPDOVL.cjs');

// src/encryption/index.spec.ts
_chunk5JHPDOVLcjs.init_cjs_shims.call(void 0, );
var _crypto = require('crypto'); var _crypto2 = _interopRequireDefault(_crypto);
_chunkXDMBOPPTcjs.describe.call(void 0, "EncryptionModule", () => {
  const validKey = "12345678901234567890123456789012";
  const data = new Uint8Array(Buffer.from("hello world"));
  _chunkXDMBOPPTcjs.describe.call(void 0, "aesGcmEncrypt", () => {
    _chunkXDMBOPPTcjs.it.call(void 0, "should encrypt data correctly and return ciphertext and nonce", async () => {
      const result = await _chunkDCHAHK5Wcjs.EncryptionModule.aesGcmEncrypt(data, validKey);
      _chunkXDMBOPPTcjs.globalExpect.call(void 0, result.ciphertext).toBeDefined();
      _chunkXDMBOPPTcjs.globalExpect.call(void 0, typeof result.ciphertext).toBe("string");
      _chunkXDMBOPPTcjs.globalExpect.call(void 0, result.nonce).toBeDefined();
      _chunkXDMBOPPTcjs.globalExpect.call(void 0, result.nonce).toBeInstanceOf(Uint8Array);
      _chunkXDMBOPPTcjs.globalExpect.call(void 0, result.nonce.length).toBe(12);
    });
    _chunkXDMBOPPTcjs.it.call(void 0, "should use provided nonce if given", async () => {
      const nonce = _crypto2.default.randomBytes(12);
      const result = await _chunkDCHAHK5Wcjs.EncryptionModule.aesGcmEncrypt(data, validKey, nonce);
      _chunkXDMBOPPTcjs.globalExpect.call(void 0, result.nonce).toEqual(new Uint8Array(nonce));
    });
    _chunkXDMBOPPTcjs.it.call(void 0, "should throw error if key length is invalid", async () => {
      await _chunkXDMBOPPTcjs.globalExpect.call(void 0, _chunkDCHAHK5Wcjs.EncryptionModule.aesGcmEncrypt(data, "invalid-length")).rejects.toThrow(
        "Encryption key must be exactly 32 bytes for AES-256"
      );
    });
  });
  _chunkXDMBOPPTcjs.describe.call(void 0, "aesGcmDecrypt", () => {
    _chunkXDMBOPPTcjs.it.call(void 0, "should decrypt data correctly", async () => {
      const { ciphertext, nonce } = await _chunkDCHAHK5Wcjs.EncryptionModule.aesGcmEncrypt(data, validKey);
      const decrypted = await _chunkDCHAHK5Wcjs.EncryptionModule.aesGcmDecrypt(ciphertext, nonce, validKey);
      _chunkXDMBOPPTcjs.globalExpect.call(void 0, decrypted).toEqual(data);
      _chunkXDMBOPPTcjs.globalExpect.call(void 0, Buffer.from(decrypted).toString()).toBe("hello world");
    });
    _chunkXDMBOPPTcjs.it.call(void 0, "should throw error if key length is invalid", async () => {
      const { ciphertext, nonce } = await _chunkDCHAHK5Wcjs.EncryptionModule.aesGcmEncrypt(data, validKey);
      await _chunkXDMBOPPTcjs.globalExpect.call(void 0, _chunkDCHAHK5Wcjs.EncryptionModule.aesGcmDecrypt(ciphertext, nonce, "invalid-length")).rejects.toThrow(
        "Encryption key must be exactly 32 bytes for AES-256"
      );
    });
    _chunkXDMBOPPTcjs.it.call(void 0, "should fail to decrypt with wrong key", async () => {
      const { ciphertext, nonce } = await _chunkDCHAHK5Wcjs.EncryptionModule.aesGcmEncrypt(data, validKey);
      const wrongKey = "12345678901234567890123456789013";
      await _chunkXDMBOPPTcjs.globalExpect.call(void 0, _chunkDCHAHK5Wcjs.EncryptionModule.aesGcmDecrypt(ciphertext, nonce, wrongKey)).rejects.toThrow(
        "Failed to decrypt data"
      );
    });
  });
});
//# sourceMappingURL=index.spec.cjs.map