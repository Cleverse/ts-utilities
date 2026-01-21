"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _chunkIMEGYM73cjs = require('../chunk-IMEGYM73.cjs');




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
      const result = await _chunkIMEGYM73cjs.EncryptionModule.aesGcmEncrypt(data, validKey);
      _chunkXDMBOPPTcjs.globalExpect.call(void 0, result.ciphertext).toBeDefined();
      _chunkXDMBOPPTcjs.globalExpect.call(void 0, typeof result.ciphertext).toBe("string");
      _chunkXDMBOPPTcjs.globalExpect.call(void 0, result.nonce).toBeDefined();
      _chunkXDMBOPPTcjs.globalExpect.call(void 0, result.nonce).toBeInstanceOf(Uint8Array);
      _chunkXDMBOPPTcjs.globalExpect.call(void 0, result.nonce.length).toBe(12);
    });
    _chunkXDMBOPPTcjs.it.call(void 0, "should use provided nonce if given", async () => {
      const nonce = _crypto2.default.randomBytes(12);
      const result = await _chunkIMEGYM73cjs.EncryptionModule.aesGcmEncrypt(data, validKey, nonce);
      _chunkXDMBOPPTcjs.globalExpect.call(void 0, result.nonce).toEqual(new Uint8Array(nonce));
    });
    _chunkXDMBOPPTcjs.it.call(void 0, "should throw error if key length is invalid", async () => {
      await _chunkXDMBOPPTcjs.globalExpect.call(void 0, _chunkIMEGYM73cjs.EncryptionModule.aesGcmEncrypt(data, "invalid-length")).rejects.toThrow(
        "Encryption key must be exactly 32 bytes for AES-256"
      );
    });
  });
  _chunkXDMBOPPTcjs.describe.call(void 0, "aesGcmDecrypt", () => {
    _chunkXDMBOPPTcjs.it.call(void 0, "should decrypt data correctly", async () => {
      const { ciphertext, nonce } = await _chunkIMEGYM73cjs.EncryptionModule.aesGcmEncrypt(data, validKey);
      const decrypted = await _chunkIMEGYM73cjs.EncryptionModule.aesGcmDecrypt(ciphertext, nonce, validKey);
      _chunkXDMBOPPTcjs.globalExpect.call(void 0, decrypted).toEqual(data);
      _chunkXDMBOPPTcjs.globalExpect.call(void 0, Buffer.from(decrypted).toString()).toBe("hello world");
    });
    _chunkXDMBOPPTcjs.it.call(void 0, "should throw error if key length is invalid", async () => {
      const { ciphertext, nonce } = await _chunkIMEGYM73cjs.EncryptionModule.aesGcmEncrypt(data, validKey);
      await _chunkXDMBOPPTcjs.globalExpect.call(void 0, _chunkIMEGYM73cjs.EncryptionModule.aesGcmDecrypt(ciphertext, nonce, "invalid-length")).rejects.toThrow(
        "Encryption key must be exactly 32 bytes for AES-256"
      );
    });
    _chunkXDMBOPPTcjs.it.call(void 0, "should fail to decrypt with wrong key", async () => {
      const { ciphertext, nonce } = await _chunkIMEGYM73cjs.EncryptionModule.aesGcmEncrypt(data, validKey);
      const wrongKey = "12345678901234567890123456789013";
      await _chunkXDMBOPPTcjs.globalExpect.call(void 0, _chunkIMEGYM73cjs.EncryptionModule.aesGcmDecrypt(ciphertext, nonce, wrongKey)).rejects.toThrow(
        "Failed to decrypt data"
      );
    });
  });
  _chunkXDMBOPPTcjs.describe.call(void 0, "generateEncryptionKey", () => {
    _chunkXDMBOPPTcjs.it.call(void 0, "should generate a 64-character hex key by default (32 bytes)", () => {
      const key = _chunkIMEGYM73cjs.EncryptionModule.generateEncryptionKey();
      _chunkXDMBOPPTcjs.globalExpect.call(void 0, typeof key).toBe("string");
      _chunkXDMBOPPTcjs.globalExpect.call(void 0, key.length).toBe(64);
      _chunkXDMBOPPTcjs.globalExpect.call(void 0, /^[0-9a-fA-F]+$/.test(key)).toBe(true);
    });
    _chunkXDMBOPPTcjs.it.call(void 0, "should generate a 64-character hex key when specified", () => {
      const key = _chunkIMEGYM73cjs.EncryptionModule.generateEncryptionKey("hex");
      _chunkXDMBOPPTcjs.globalExpect.call(void 0, typeof key).toBe("string");
      _chunkXDMBOPPTcjs.globalExpect.call(void 0, key.length).toBe(64);
      _chunkXDMBOPPTcjs.globalExpect.call(void 0, /^[0-9a-fA-F]+$/.test(key)).toBe(true);
    });
    _chunkXDMBOPPTcjs.it.call(void 0, "should generate a 44-character base64 key (32 bytes)", () => {
      const key = _chunkIMEGYM73cjs.EncryptionModule.generateEncryptionKey("base64");
      _chunkXDMBOPPTcjs.globalExpect.call(void 0, typeof key).toBe("string");
      _chunkXDMBOPPTcjs.globalExpect.call(void 0, key.length).toBe(44);
      _chunkXDMBOPPTcjs.globalExpect.call(void 0, /^[a-zA-Z0-9+/=]+$/.test(key)).toBe(true);
    });
    _chunkXDMBOPPTcjs.it.call(void 0, "should generate a 32-character ascii key (32 bytes)", () => {
      const key = _chunkIMEGYM73cjs.EncryptionModule.generateEncryptionKey("ascii");
      _chunkXDMBOPPTcjs.globalExpect.call(void 0, typeof key).toBe("string");
      _chunkXDMBOPPTcjs.globalExpect.call(void 0, key.length).toBe(32);
    });
    _chunkXDMBOPPTcjs.it.call(void 0, "should generate a 32-character utf8 key (legacy fallback)", () => {
      const key = _chunkIMEGYM73cjs.EncryptionModule.generateEncryptionKey("utf8");
      _chunkXDMBOPPTcjs.globalExpect.call(void 0, typeof key).toBe("string");
      _chunkXDMBOPPTcjs.globalExpect.call(void 0, key.length).toBe(32);
    });
    _chunkXDMBOPPTcjs.it.call(void 0, "should generate different keys on subsequent calls", () => {
      const key1 = _chunkIMEGYM73cjs.EncryptionModule.generateEncryptionKey();
      const key2 = _chunkIMEGYM73cjs.EncryptionModule.generateEncryptionKey();
      _chunkXDMBOPPTcjs.globalExpect.call(void 0, key1).not.toBe(key2);
    });
    _chunkXDMBOPPTcjs.it.each(["hex", "base64", "ascii", "utf8"])(
      "should generate a key compatible with aesGcmEncrypt (%s)",
      async (encoding) => {
        const key = _chunkIMEGYM73cjs.EncryptionModule.generateEncryptionKey(encoding);
        const data2 = new Uint8Array(Buffer.from("hello world"));
        const result = await _chunkIMEGYM73cjs.EncryptionModule.aesGcmEncrypt(data2, key);
        _chunkXDMBOPPTcjs.globalExpect.call(void 0, result.ciphertext).toBeDefined();
        const decrypted = await _chunkIMEGYM73cjs.EncryptionModule.aesGcmDecrypt(result.ciphertext, result.nonce, key);
        _chunkXDMBOPPTcjs.globalExpect.call(void 0, decrypted).toEqual(data2);
      }
    );
  });
  _chunkXDMBOPPTcjs.describe.call(void 0, "Key Formats", () => {
    const hexKey = "6fb64e13eb0ad85478f7e792faf6ac8bf46ddd39483e8aed16a82cc5eaaead55";
    const base64Key = Buffer.from(hexKey, "hex").toString("base64");
    const utf8Key = "12345678901234567890123456789012";
    _chunkXDMBOPPTcjs.it.call(void 0, "should support hex encoded key (64 chars)", async () => {
      const result = await _chunkIMEGYM73cjs.EncryptionModule.aesGcmEncrypt(data, hexKey);
      _chunkXDMBOPPTcjs.globalExpect.call(void 0, result.ciphertext).toBeDefined();
      const decrypted = await _chunkIMEGYM73cjs.EncryptionModule.aesGcmDecrypt(result.ciphertext, result.nonce, hexKey);
      _chunkXDMBOPPTcjs.globalExpect.call(void 0, decrypted).toEqual(data);
    });
    _chunkXDMBOPPTcjs.it.call(void 0, "should support base64 encoded key (44 chars)", async () => {
      const result = await _chunkIMEGYM73cjs.EncryptionModule.aesGcmEncrypt(data, base64Key);
      _chunkXDMBOPPTcjs.globalExpect.call(void 0, result.ciphertext).toBeDefined();
      const decrypted = await _chunkIMEGYM73cjs.EncryptionModule.aesGcmDecrypt(result.ciphertext, result.nonce, base64Key);
      _chunkXDMBOPPTcjs.globalExpect.call(void 0, decrypted).toEqual(data);
    });
    _chunkXDMBOPPTcjs.it.call(void 0, "should support utf8 key (32 chars)", async () => {
      const result = await _chunkIMEGYM73cjs.EncryptionModule.aesGcmEncrypt(data, utf8Key);
      _chunkXDMBOPPTcjs.globalExpect.call(void 0, result.ciphertext).toBeDefined();
      const decrypted = await _chunkIMEGYM73cjs.EncryptionModule.aesGcmDecrypt(result.ciphertext, result.nonce, utf8Key);
      _chunkXDMBOPPTcjs.globalExpect.call(void 0, decrypted).toEqual(data);
    });
  });
});
//# sourceMappingURL=index.spec.cjs.map