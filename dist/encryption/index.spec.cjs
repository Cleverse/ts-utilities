"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _chunkYR6R4OPAcjs = require('../chunk-YR6R4OPA.cjs');
require('../chunk-LVRYD6CX.cjs');
require('../chunk-HQ5UCOMY.cjs');
require('../chunk-PVTSJRDB.cjs');




var _chunkBFR6AXPAcjs = require('../chunk-BFR6AXPA.cjs');


var _chunk2X3FSA3Bcjs = require('../chunk-2X3FSA3B.cjs');

// src/encryption/index.spec.ts
_chunk2X3FSA3Bcjs.init_cjs_shims.call(void 0, );
var _crypto = require('crypto'); var _crypto2 = _interopRequireDefault(_crypto);
_chunkBFR6AXPAcjs.describe.call(void 0, "EncryptionModule", () => {
  const validKey = "12345678901234567890123456789012";
  const data = new Uint8Array(Buffer.from("hello world"));
  _chunkBFR6AXPAcjs.describe.call(void 0, "aesGcmEncrypt", () => {
    _chunkBFR6AXPAcjs.it.call(void 0, "should encrypt data correctly and return ciphertext and nonce", async () => {
      const result = await _chunkYR6R4OPAcjs.EncryptionModule.encrypt(data, validKey);
      _chunkBFR6AXPAcjs.globalExpect.call(void 0, result.ciphertext).toBeDefined();
      _chunkBFR6AXPAcjs.globalExpect.call(void 0, typeof result.ciphertext).toBe("string");
      _chunkBFR6AXPAcjs.globalExpect.call(void 0, result.nonce).toBeDefined();
      _chunkBFR6AXPAcjs.globalExpect.call(void 0, result.nonce).toBeInstanceOf(Uint8Array);
      _chunkBFR6AXPAcjs.globalExpect.call(void 0, result.nonce.length).toBe(12);
    });
    _chunkBFR6AXPAcjs.it.call(void 0, "should use provided nonce if given", async () => {
      const nonce = _crypto2.default.randomBytes(12);
      const result = await _chunkYR6R4OPAcjs.EncryptionModule.encrypt(data, validKey, nonce);
      _chunkBFR6AXPAcjs.globalExpect.call(void 0, result.nonce).toEqual(new Uint8Array(nonce));
    });
    _chunkBFR6AXPAcjs.it.call(void 0, "should throw error if key length is invalid", async () => {
      await _chunkBFR6AXPAcjs.globalExpect.call(void 0, _chunkYR6R4OPAcjs.EncryptionModule.encrypt(data, "invalid-length")).rejects.toThrow(
        "Encryption key must be exactly 32 bytes for AES-256"
      );
    });
  });
  _chunkBFR6AXPAcjs.describe.call(void 0, "aesGcmDecrypt", () => {
    _chunkBFR6AXPAcjs.it.call(void 0, "should decrypt data correctly", async () => {
      const { ciphertext, nonce } = await _chunkYR6R4OPAcjs.EncryptionModule.encrypt(data, validKey);
      const decrypted = await _chunkYR6R4OPAcjs.EncryptionModule.decrypt(ciphertext, nonce, validKey);
      _chunkBFR6AXPAcjs.globalExpect.call(void 0, decrypted).toEqual(data);
      _chunkBFR6AXPAcjs.globalExpect.call(void 0, Buffer.from(decrypted).toString()).toBe("hello world");
    });
    _chunkBFR6AXPAcjs.it.call(void 0, "should throw error if key length is invalid", async () => {
      const { ciphertext, nonce } = await _chunkYR6R4OPAcjs.EncryptionModule.encrypt(data, validKey);
      await _chunkBFR6AXPAcjs.globalExpect.call(void 0, _chunkYR6R4OPAcjs.EncryptionModule.decrypt(ciphertext, nonce, "invalid-length")).rejects.toThrow(
        "Encryption key must be exactly 32 bytes for AES-256"
      );
    });
    _chunkBFR6AXPAcjs.it.call(void 0, "should fail to decrypt with wrong key", async () => {
      const { ciphertext, nonce } = await _chunkYR6R4OPAcjs.EncryptionModule.encrypt(data, validKey);
      const wrongKey = "12345678901234567890123456789013";
      await _chunkBFR6AXPAcjs.globalExpect.call(void 0, _chunkYR6R4OPAcjs.EncryptionModule.decrypt(ciphertext, nonce, wrongKey)).rejects.toThrow("Failed to decrypt data");
    });
  });
  _chunkBFR6AXPAcjs.describe.call(void 0, "generateEncryptionKey", () => {
    _chunkBFR6AXPAcjs.it.call(void 0, "should generate a 64-character hex key by default (32 bytes)", () => {
      const key = _chunkYR6R4OPAcjs.EncryptionModule.generateEncryptionKey();
      _chunkBFR6AXPAcjs.globalExpect.call(void 0, typeof key).toBe("string");
      _chunkBFR6AXPAcjs.globalExpect.call(void 0, key.length).toBe(64);
      _chunkBFR6AXPAcjs.globalExpect.call(void 0, /^[0-9a-fA-F]+$/.test(key)).toBe(true);
    });
    _chunkBFR6AXPAcjs.it.call(void 0, "should generate a 64-character hex key when specified", () => {
      const key = _chunkYR6R4OPAcjs.EncryptionModule.generateEncryptionKey("hex");
      _chunkBFR6AXPAcjs.globalExpect.call(void 0, typeof key).toBe("string");
      _chunkBFR6AXPAcjs.globalExpect.call(void 0, key.length).toBe(64);
      _chunkBFR6AXPAcjs.globalExpect.call(void 0, /^[0-9a-fA-F]+$/.test(key)).toBe(true);
    });
    _chunkBFR6AXPAcjs.it.call(void 0, "should generate a 44-character base64 key (32 bytes)", () => {
      const key = _chunkYR6R4OPAcjs.EncryptionModule.generateEncryptionKey("base64");
      _chunkBFR6AXPAcjs.globalExpect.call(void 0, typeof key).toBe("string");
      _chunkBFR6AXPAcjs.globalExpect.call(void 0, key.length).toBe(44);
      _chunkBFR6AXPAcjs.globalExpect.call(void 0, /^[a-zA-Z0-9+/=]+$/.test(key)).toBe(true);
    });
    _chunkBFR6AXPAcjs.it.call(void 0, "should generate a 32-character ascii key (32 bytes)", () => {
      const key = _chunkYR6R4OPAcjs.EncryptionModule.generateEncryptionKey("ascii");
      _chunkBFR6AXPAcjs.globalExpect.call(void 0, typeof key).toBe("string");
      _chunkBFR6AXPAcjs.globalExpect.call(void 0, key.length).toBe(32);
    });
    _chunkBFR6AXPAcjs.it.call(void 0, "should generate a 32-character utf8 key (legacy fallback)", () => {
      const key = _chunkYR6R4OPAcjs.EncryptionModule.generateEncryptionKey("utf8");
      _chunkBFR6AXPAcjs.globalExpect.call(void 0, typeof key).toBe("string");
      _chunkBFR6AXPAcjs.globalExpect.call(void 0, key.length).toBe(32);
    });
    _chunkBFR6AXPAcjs.it.call(void 0, "should generate different keys on subsequent calls", () => {
      const key1 = _chunkYR6R4OPAcjs.EncryptionModule.generateEncryptionKey();
      const key2 = _chunkYR6R4OPAcjs.EncryptionModule.generateEncryptionKey();
      _chunkBFR6AXPAcjs.globalExpect.call(void 0, key1).not.toBe(key2);
    });
    _chunkBFR6AXPAcjs.it.each(["hex", "base64", "ascii", "utf8"])(
      "should generate a key compatible with aesGcmEncrypt (%s)",
      async (encoding) => {
        const key = _chunkYR6R4OPAcjs.EncryptionModule.generateEncryptionKey(encoding);
        const data2 = new Uint8Array(Buffer.from("hello world"));
        const result = await _chunkYR6R4OPAcjs.EncryptionModule.encrypt(data2, key);
        _chunkBFR6AXPAcjs.globalExpect.call(void 0, result.ciphertext).toBeDefined();
        const decrypted = await _chunkYR6R4OPAcjs.EncryptionModule.decrypt(result.ciphertext, result.nonce, key);
        _chunkBFR6AXPAcjs.globalExpect.call(void 0, decrypted).toEqual(data2);
      }
    );
  });
  _chunkBFR6AXPAcjs.describe.call(void 0, "Key Formats", () => {
    const hexKey = "6fb64e13eb0ad85478f7e792faf6ac8bf46ddd39483e8aed16a82cc5eaaead55";
    const base64Key = Buffer.from(hexKey, "hex").toString("base64");
    const utf8Key = "12345678901234567890123456789012";
    _chunkBFR6AXPAcjs.it.call(void 0, "should support hex encoded key (64 chars)", async () => {
      const result = await _chunkYR6R4OPAcjs.EncryptionModule.encrypt(data, hexKey);
      _chunkBFR6AXPAcjs.globalExpect.call(void 0, result.ciphertext).toBeDefined();
      const decrypted = await _chunkYR6R4OPAcjs.EncryptionModule.decrypt(result.ciphertext, result.nonce, hexKey);
      _chunkBFR6AXPAcjs.globalExpect.call(void 0, decrypted).toEqual(data);
    });
    _chunkBFR6AXPAcjs.it.call(void 0, "should support base64 encoded key (44 chars)", async () => {
      const result = await _chunkYR6R4OPAcjs.EncryptionModule.encrypt(data, base64Key);
      _chunkBFR6AXPAcjs.globalExpect.call(void 0, result.ciphertext).toBeDefined();
      const decrypted = await _chunkYR6R4OPAcjs.EncryptionModule.decrypt(result.ciphertext, result.nonce, base64Key);
      _chunkBFR6AXPAcjs.globalExpect.call(void 0, decrypted).toEqual(data);
    });
    _chunkBFR6AXPAcjs.it.call(void 0, "should support utf8 key (32 chars)", async () => {
      const result = await _chunkYR6R4OPAcjs.EncryptionModule.encrypt(data, utf8Key);
      _chunkBFR6AXPAcjs.globalExpect.call(void 0, result.ciphertext).toBeDefined();
      const decrypted = await _chunkYR6R4OPAcjs.EncryptionModule.decrypt(result.ciphertext, result.nonce, utf8Key);
      _chunkBFR6AXPAcjs.globalExpect.call(void 0, decrypted).toEqual(data);
    });
  });
});
//# sourceMappingURL=index.spec.cjs.map