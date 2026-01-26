"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _chunkCSFWGYXDcjs = require('../chunk-CSFWGYXD.cjs');
require('../chunk-NRZ4BV6Q.cjs');
require('../chunk-CU6GGSDD.cjs');
require('../chunk-PJOHUDZ2.cjs');




var _chunk5BHWYHGYcjs = require('../chunk-5BHWYHGY.cjs');


var _chunkT6TWWATEcjs = require('../chunk-T6TWWATE.cjs');

// src/encryption/index.spec.ts
_chunkT6TWWATEcjs.init_cjs_shims.call(void 0, );
var _crypto = require('crypto'); var _crypto2 = _interopRequireDefault(_crypto);
_chunk5BHWYHGYcjs.describe.call(void 0, "EncryptionModule", () => {
  const validKey = "12345678901234567890123456789012";
  const data = new Uint8Array(Buffer.from("hello world"));
  _chunk5BHWYHGYcjs.describe.call(void 0, "aesGcmEncrypt", () => {
    _chunk5BHWYHGYcjs.it.call(void 0, "should encrypt data correctly and return ciphertext and nonce", async () => {
      const result = await _chunkCSFWGYXDcjs.EncryptionModule.encrypt(data, validKey);
      _chunk5BHWYHGYcjs.globalExpect.call(void 0, result.ciphertext).toBeDefined();
      _chunk5BHWYHGYcjs.globalExpect.call(void 0, typeof result.ciphertext).toBe("string");
      _chunk5BHWYHGYcjs.globalExpect.call(void 0, result.nonce).toBeDefined();
      _chunk5BHWYHGYcjs.globalExpect.call(void 0, result.nonce).toBeInstanceOf(Uint8Array);
      _chunk5BHWYHGYcjs.globalExpect.call(void 0, result.nonce.length).toBe(12);
    });
    _chunk5BHWYHGYcjs.it.call(void 0, "should use provided nonce if given", async () => {
      const nonce = _crypto2.default.randomBytes(12);
      const result = await _chunkCSFWGYXDcjs.EncryptionModule.encrypt(data, validKey, nonce);
      _chunk5BHWYHGYcjs.globalExpect.call(void 0, result.nonce).toEqual(new Uint8Array(nonce));
    });
    _chunk5BHWYHGYcjs.it.call(void 0, "should throw error if key length is invalid", async () => {
      await _chunk5BHWYHGYcjs.globalExpect.call(void 0, _chunkCSFWGYXDcjs.EncryptionModule.encrypt(data, "invalid-length")).rejects.toThrow(
        "Encryption key must be exactly 32 bytes for AES-256"
      );
    });
  });
  _chunk5BHWYHGYcjs.describe.call(void 0, "aesGcmDecrypt", () => {
    _chunk5BHWYHGYcjs.it.call(void 0, "should decrypt data correctly", async () => {
      const { ciphertext, nonce } = await _chunkCSFWGYXDcjs.EncryptionModule.encrypt(data, validKey);
      const decrypted = await _chunkCSFWGYXDcjs.EncryptionModule.decrypt(ciphertext, nonce, validKey);
      _chunk5BHWYHGYcjs.globalExpect.call(void 0, decrypted).toEqual(data);
      _chunk5BHWYHGYcjs.globalExpect.call(void 0, Buffer.from(decrypted).toString()).toBe("hello world");
    });
    _chunk5BHWYHGYcjs.it.call(void 0, "should throw error if key length is invalid", async () => {
      const { ciphertext, nonce } = await _chunkCSFWGYXDcjs.EncryptionModule.encrypt(data, validKey);
      await _chunk5BHWYHGYcjs.globalExpect.call(void 0, _chunkCSFWGYXDcjs.EncryptionModule.decrypt(ciphertext, nonce, "invalid-length")).rejects.toThrow(
        "Encryption key must be exactly 32 bytes for AES-256"
      );
    });
    _chunk5BHWYHGYcjs.it.call(void 0, "should fail to decrypt with wrong key", async () => {
      const { ciphertext, nonce } = await _chunkCSFWGYXDcjs.EncryptionModule.encrypt(data, validKey);
      const wrongKey = "12345678901234567890123456789013";
      await _chunk5BHWYHGYcjs.globalExpect.call(void 0, _chunkCSFWGYXDcjs.EncryptionModule.decrypt(ciphertext, nonce, wrongKey)).rejects.toThrow("Failed to decrypt data");
    });
  });
  _chunk5BHWYHGYcjs.describe.call(void 0, "generateEncryptionKey", () => {
    _chunk5BHWYHGYcjs.it.call(void 0, "should generate a 64-character hex key by default (32 bytes)", () => {
      const key = _chunkCSFWGYXDcjs.EncryptionModule.generateEncryptionKey();
      _chunk5BHWYHGYcjs.globalExpect.call(void 0, typeof key).toBe("string");
      _chunk5BHWYHGYcjs.globalExpect.call(void 0, key.length).toBe(64);
      _chunk5BHWYHGYcjs.globalExpect.call(void 0, /^[0-9a-fA-F]+$/.test(key)).toBe(true);
    });
    _chunk5BHWYHGYcjs.it.call(void 0, "should generate a 64-character hex key when specified", () => {
      const key = _chunkCSFWGYXDcjs.EncryptionModule.generateEncryptionKey("hex");
      _chunk5BHWYHGYcjs.globalExpect.call(void 0, typeof key).toBe("string");
      _chunk5BHWYHGYcjs.globalExpect.call(void 0, key.length).toBe(64);
      _chunk5BHWYHGYcjs.globalExpect.call(void 0, /^[0-9a-fA-F]+$/.test(key)).toBe(true);
    });
    _chunk5BHWYHGYcjs.it.call(void 0, "should generate a 44-character base64 key (32 bytes)", () => {
      const key = _chunkCSFWGYXDcjs.EncryptionModule.generateEncryptionKey("base64");
      _chunk5BHWYHGYcjs.globalExpect.call(void 0, typeof key).toBe("string");
      _chunk5BHWYHGYcjs.globalExpect.call(void 0, key.length).toBe(44);
      _chunk5BHWYHGYcjs.globalExpect.call(void 0, /^[a-zA-Z0-9+/=]+$/.test(key)).toBe(true);
    });
    _chunk5BHWYHGYcjs.it.call(void 0, "should generate a 32-character ascii key (32 bytes)", () => {
      const key = _chunkCSFWGYXDcjs.EncryptionModule.generateEncryptionKey("ascii");
      _chunk5BHWYHGYcjs.globalExpect.call(void 0, typeof key).toBe("string");
      _chunk5BHWYHGYcjs.globalExpect.call(void 0, key.length).toBe(32);
    });
    _chunk5BHWYHGYcjs.it.call(void 0, "should generate a 32-character utf8 key (legacy fallback)", () => {
      const key = _chunkCSFWGYXDcjs.EncryptionModule.generateEncryptionKey("utf8");
      _chunk5BHWYHGYcjs.globalExpect.call(void 0, typeof key).toBe("string");
      _chunk5BHWYHGYcjs.globalExpect.call(void 0, key.length).toBe(32);
    });
    _chunk5BHWYHGYcjs.it.call(void 0, "should generate different keys on subsequent calls", () => {
      const key1 = _chunkCSFWGYXDcjs.EncryptionModule.generateEncryptionKey();
      const key2 = _chunkCSFWGYXDcjs.EncryptionModule.generateEncryptionKey();
      _chunk5BHWYHGYcjs.globalExpect.call(void 0, key1).not.toBe(key2);
    });
    _chunk5BHWYHGYcjs.it.each(["hex", "base64", "ascii", "utf8"])(
      "should generate a key compatible with aesGcmEncrypt (%s)",
      async (encoding) => {
        const key = _chunkCSFWGYXDcjs.EncryptionModule.generateEncryptionKey(encoding);
        const data2 = new Uint8Array(Buffer.from("hello world"));
        const result = await _chunkCSFWGYXDcjs.EncryptionModule.encrypt(data2, key);
        _chunk5BHWYHGYcjs.globalExpect.call(void 0, result.ciphertext).toBeDefined();
        const decrypted = await _chunkCSFWGYXDcjs.EncryptionModule.decrypt(result.ciphertext, result.nonce, key);
        _chunk5BHWYHGYcjs.globalExpect.call(void 0, decrypted).toEqual(data2);
      }
    );
  });
  _chunk5BHWYHGYcjs.describe.call(void 0, "Key Formats", () => {
    const hexKey = "6fb64e13eb0ad85478f7e792faf6ac8bf46ddd39483e8aed16a82cc5eaaead55";
    const base64Key = Buffer.from(hexKey, "hex").toString("base64");
    const utf8Key = "12345678901234567890123456789012";
    _chunk5BHWYHGYcjs.it.call(void 0, "should support hex encoded key (64 chars)", async () => {
      const result = await _chunkCSFWGYXDcjs.EncryptionModule.encrypt(data, hexKey);
      _chunk5BHWYHGYcjs.globalExpect.call(void 0, result.ciphertext).toBeDefined();
      const decrypted = await _chunkCSFWGYXDcjs.EncryptionModule.decrypt(result.ciphertext, result.nonce, hexKey);
      _chunk5BHWYHGYcjs.globalExpect.call(void 0, decrypted).toEqual(data);
    });
    _chunk5BHWYHGYcjs.it.call(void 0, "should support base64 encoded key (44 chars)", async () => {
      const result = await _chunkCSFWGYXDcjs.EncryptionModule.encrypt(data, base64Key);
      _chunk5BHWYHGYcjs.globalExpect.call(void 0, result.ciphertext).toBeDefined();
      const decrypted = await _chunkCSFWGYXDcjs.EncryptionModule.decrypt(result.ciphertext, result.nonce, base64Key);
      _chunk5BHWYHGYcjs.globalExpect.call(void 0, decrypted).toEqual(data);
    });
    _chunk5BHWYHGYcjs.it.call(void 0, "should support utf8 key (32 chars)", async () => {
      const result = await _chunkCSFWGYXDcjs.EncryptionModule.encrypt(data, utf8Key);
      _chunk5BHWYHGYcjs.globalExpect.call(void 0, result.ciphertext).toBeDefined();
      const decrypted = await _chunkCSFWGYXDcjs.EncryptionModule.decrypt(result.ciphertext, result.nonce, utf8Key);
      _chunk5BHWYHGYcjs.globalExpect.call(void 0, decrypted).toEqual(data);
    });
  });
});
//# sourceMappingURL=index.spec.cjs.map