"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }


var _chunkAQ2YAQ2Ecjs = require('../chunk-AQ2YAQ2E.cjs');
require('../chunk-NRZ4BV6Q.cjs');
require('../chunk-CU6GGSDD.cjs');
require('../chunk-PJOHUDZ2.cjs');






var _chunk5BHWYHGYcjs = require('../chunk-5BHWYHGY.cjs');


var _chunkT6TWWATEcjs = require('../chunk-T6TWWATE.cjs');

// src/encryption/encryption.service.spec.ts
_chunkT6TWWATEcjs.init_cjs_shims.call(void 0, );
var _crypto = require('crypto'); var _crypto2 = _interopRequireDefault(_crypto);
_chunk5BHWYHGYcjs.vi.mock("./index", () => ({
  EncryptionModule: {
    encrypt: _chunk5BHWYHGYcjs.vi.fn(),
    decrypt: _chunk5BHWYHGYcjs.vi.fn(),
    generateEncryptionKey: _chunk5BHWYHGYcjs.vi.fn()
  }
}));
var mockEncrypt = _chunk5BHWYHGYcjs.vi.mocked(_chunkAQ2YAQ2Ecjs.EncryptionModule.encrypt);
var mockDecrypt = _chunk5BHWYHGYcjs.vi.mocked(_chunkAQ2YAQ2Ecjs.EncryptionModule.decrypt);
var mockGenerateEncryptionKey = _chunk5BHWYHGYcjs.vi.mocked(_chunkAQ2YAQ2Ecjs.EncryptionModule.generateEncryptionKey);
var mockKMSEncrypt = _chunk5BHWYHGYcjs.vi.fn();
var mockKMSDecrypt = _chunk5BHWYHGYcjs.vi.fn();
var mockKMSClient = {
  encrypt: mockKMSEncrypt,
  decrypt: mockKMSDecrypt
};
var mockSharedDEKDatagateway = {
  getDEK: _chunk5BHWYHGYcjs.vi.fn(),
  insertNewDEK: _chunk5BHWYHGYcjs.vi.fn()
};
_chunk5BHWYHGYcjs.describe.call(void 0, "EnvelopeEncryptionService", () => {
  let service;
  let config;
  _chunk5BHWYHGYcjs.beforeEach.call(void 0, () => {
    _chunk5BHWYHGYcjs.vi.clearAllMocks();
    config = {};
    service = new (0, _chunkAQ2YAQ2Ecjs.EnvelopeEncryptionService)(mockKMSClient, mockSharedDEKDatagateway, config);
  });
  _chunk5BHWYHGYcjs.describe.call(void 0, "encrypt", () => {
    const testData = new Uint8Array(Buffer.from("hello world"));
    const testNonce = _crypto2.default.randomBytes(12);
    const encryptedResult = {
      ciphertext: "encrypted-data",
      nonce: testNonce
    };
    const dek = {
      version: 1,
      dek: "test-dek-key",
      kekVersion: 1
    };
    _chunk5BHWYHGYcjs.it.call(void 0, "should encrypt data with specified DEK version", async () => {
      mockSharedDEKDatagateway.getDEK.mockResolvedValue({
        version: 1,
        encryptedDek: "encrypted-dek",
        kekVersion: 1
      });
      mockKMSDecrypt.mockResolvedValue(dek.dek);
      mockEncrypt.mockResolvedValue(encryptedResult);
      const result = await service.encrypt(testData, testNonce, 1);
      _chunk5BHWYHGYcjs.globalExpect.call(void 0, mockSharedDEKDatagateway.getDEK).toHaveBeenCalledWith(1);
      _chunk5BHWYHGYcjs.globalExpect.call(void 0, mockKMSDecrypt).toHaveBeenCalledWith("encrypted-dek", "1");
      _chunk5BHWYHGYcjs.globalExpect.call(void 0, _chunkAQ2YAQ2Ecjs.EncryptionModule.encrypt).toHaveBeenCalledWith(testData, dek.dek, testNonce);
      _chunk5BHWYHGYcjs.globalExpect.call(void 0, result).toEqual({
        dekVersion: 1,
        nonce: testNonce,
        ciphertext: "encrypted-data"
      });
    });
    _chunk5BHWYHGYcjs.it.call(void 0, "should encrypt data with default DEK version when not specified", async () => {
      config.defaultVersion = 2;
      mockSharedDEKDatagateway.getDEK.mockResolvedValue({
        version: 2,
        encryptedDek: "encrypted-dek",
        kekVersion: 1
      });
      mockKMSDecrypt.mockResolvedValue(dek.dek);
      mockEncrypt.mockResolvedValue(encryptedResult);
      const result = await service.encrypt(testData, testNonce);
      _chunk5BHWYHGYcjs.globalExpect.call(void 0, mockSharedDEKDatagateway.getDEK).toHaveBeenCalledWith(2);
      _chunk5BHWYHGYcjs.globalExpect.call(void 0, result.dekVersion).toBe(2);
    });
    _chunk5BHWYHGYcjs.it.call(void 0, "should throw error when DEK is not found", async () => {
      mockSharedDEKDatagateway.getDEK.mockResolvedValue(null);
      await _chunk5BHWYHGYcjs.globalExpect.call(void 0, service.encrypt(testData, testNonce, 1)).rejects.toThrow("Failed to encrypt data, DEK not found");
    });
    _chunk5BHWYHGYcjs.it.call(void 0, "should use generated nonce when not provided", async () => {
      mockSharedDEKDatagateway.getDEK.mockResolvedValue({
        version: 1,
        encryptedDek: "encrypted-dek",
        kekVersion: 1
      });
      mockKMSDecrypt.mockResolvedValue(dek.dek);
      mockEncrypt.mockResolvedValue(encryptedResult);
      const result = await service.encrypt(testData);
      _chunk5BHWYHGYcjs.globalExpect.call(void 0, _chunkAQ2YAQ2Ecjs.EncryptionModule.encrypt).toHaveBeenCalledWith(testData, dek.dek, void 0);
      _chunk5BHWYHGYcjs.globalExpect.call(void 0, result.nonce).toEqual(testNonce);
    });
  });
  _chunk5BHWYHGYcjs.describe.call(void 0, "decrypt", () => {
    const ciphertext = "encrypted-data";
    const nonce = _crypto2.default.randomBytes(12);
    const decryptedData = new Uint8Array(Buffer.from("hello world"));
    const dek = {
      version: 1,
      dek: "test-dek-key",
      kekVersion: 1
    };
    _chunk5BHWYHGYcjs.it.call(void 0, "should decrypt data successfully", async () => {
      mockSharedDEKDatagateway.getDEK.mockResolvedValue({
        version: 1,
        encryptedDek: "encrypted-dek",
        kekVersion: 1
      });
      mockKMSDecrypt.mockResolvedValue(dek.dek);
      mockDecrypt.mockResolvedValue(decryptedData);
      const result = await service.decrypt(ciphertext, nonce, 1);
      _chunk5BHWYHGYcjs.globalExpect.call(void 0, mockSharedDEKDatagateway.getDEK).toHaveBeenCalledWith(1);
      _chunk5BHWYHGYcjs.globalExpect.call(void 0, mockKMSDecrypt).toHaveBeenCalledWith("encrypted-dek", "1");
      _chunk5BHWYHGYcjs.globalExpect.call(void 0, _chunkAQ2YAQ2Ecjs.EncryptionModule.decrypt).toHaveBeenCalledWith(ciphertext, nonce, dek.dek);
      _chunk5BHWYHGYcjs.globalExpect.call(void 0, result).toEqual(decryptedData);
    });
    _chunk5BHWYHGYcjs.it.call(void 0, "should throw error when DEK is not found", async () => {
      mockSharedDEKDatagateway.getDEK.mockResolvedValue(null);
      await _chunk5BHWYHGYcjs.globalExpect.call(void 0, service.decrypt(ciphertext, nonce, 1)).rejects.toThrow("Failed to decrypt data, DEK not found");
    });
  });
  _chunk5BHWYHGYcjs.describe.call(void 0, "rotateDEK", () => {
    const newDek = "new-generated-dek";
    const encryptedDek = "kms-encrypted-dek";
    const cryptoKeyVersion = "1";
    const insertedDek = {
      version: 2,
      encryptedDek,
      kekVersion: 1
    };
    _chunk5BHWYHGYcjs.it.call(void 0, "should rotate DEK successfully", async () => {
      mockGenerateEncryptionKey.mockReturnValue(newDek);
      mockKMSEncrypt.mockResolvedValue({
        ciphertext: encryptedDek,
        cryptoKeyVersion
      });
      mockSharedDEKDatagateway.insertNewDEK.mockResolvedValue(insertedDek);
      const result = await service.rotateDEK();
      _chunk5BHWYHGYcjs.globalExpect.call(void 0, _chunkAQ2YAQ2Ecjs.EncryptionModule.generateEncryptionKey).toHaveBeenCalledWith("hex");
      _chunk5BHWYHGYcjs.globalExpect.call(void 0, mockKMSEncrypt).toHaveBeenCalledWith(newDek, void 0);
      _chunk5BHWYHGYcjs.globalExpect.call(void 0, mockSharedDEKDatagateway.insertNewDEK).toHaveBeenCalledWith(encryptedDek, 1);
      _chunk5BHWYHGYcjs.globalExpect.call(void 0, result).toBe(2);
    });
    _chunk5BHWYHGYcjs.it.call(void 0, "should rotate DEK with specific KEK version", async () => {
      const kekVersion = "2";
      mockGenerateEncryptionKey.mockReturnValue(newDek);
      mockKMSEncrypt.mockResolvedValue({
        ciphertext: encryptedDek,
        cryptoKeyVersion
      });
      mockSharedDEKDatagateway.insertNewDEK.mockResolvedValue(insertedDek);
      const result = await service.rotateDEK(kekVersion);
      _chunk5BHWYHGYcjs.globalExpect.call(void 0, mockKMSEncrypt).toHaveBeenCalledWith(newDek, kekVersion);
      _chunk5BHWYHGYcjs.globalExpect.call(void 0, result).toBe(2);
    });
  });
  _chunk5BHWYHGYcjs.describe.call(void 0, "#getDEK (private method testing via caching behavior)", () => {
    const dek = {
      version: 1,
      dek: "test-dek-key",
      kekVersion: 1
    };
    const encryptedDek = {
      version: 1,
      encryptedDek: "encrypted-dek",
      kekVersion: 1
    };
    _chunk5BHWYHGYcjs.it.call(void 0, "should cache DEK after first retrieval", async () => {
      mockSharedDEKDatagateway.getDEK.mockResolvedValue(encryptedDek);
      mockKMSDecrypt.mockResolvedValue(dek.dek);
      await service.encrypt(new Uint8Array(Buffer.from("test")), null, 1);
      _chunk5BHWYHGYcjs.globalExpect.call(void 0, mockSharedDEKDatagateway.getDEK).toHaveBeenCalledTimes(1);
      _chunk5BHWYHGYcjs.globalExpect.call(void 0, mockKMSDecrypt).toHaveBeenCalledTimes(1);
      await service.encrypt(new Uint8Array(Buffer.from("test")), null, 1);
      _chunk5BHWYHGYcjs.globalExpect.call(void 0, mockSharedDEKDatagateway.getDEK).toHaveBeenCalledTimes(1);
      _chunk5BHWYHGYcjs.globalExpect.call(void 0, mockKMSDecrypt).toHaveBeenCalledTimes(1);
    });
    _chunk5BHWYHGYcjs.it.call(void 0, "should not cache when DEK is not found", async () => {
      mockSharedDEKDatagateway.getDEK.mockResolvedValue(null);
      await _chunk5BHWYHGYcjs.globalExpect.call(void 0, service.encrypt(new Uint8Array(Buffer.from("test")), null, 1)).rejects.toThrow();
      await _chunk5BHWYHGYcjs.globalExpect.call(void 0, service.encrypt(new Uint8Array(Buffer.from("test")), null, 1)).rejects.toThrow();
      _chunk5BHWYHGYcjs.globalExpect.call(void 0, mockSharedDEKDatagateway.getDEK).toHaveBeenCalledTimes(2);
    });
    _chunk5BHWYHGYcjs.it.call(void 0, "should use default version when no version specified", async () => {
      config.defaultVersion = 5;
      mockSharedDEKDatagateway.getDEK.mockResolvedValue(encryptedDek);
      mockKMSDecrypt.mockResolvedValue(dek.dek);
      await service.encrypt(new Uint8Array(Buffer.from("test")), null);
      _chunk5BHWYHGYcjs.globalExpect.call(void 0, mockSharedDEKDatagateway.getDEK).toHaveBeenCalledWith(5);
    });
  });
  _chunk5BHWYHGYcjs.describe.call(void 0, "error handling", () => {
    _chunk5BHWYHGYcjs.it.call(void 0, "should propagate errors from KMS client", async () => {
      mockSharedDEKDatagateway.getDEK.mockResolvedValue({
        version: 1,
        encryptedDek: "encrypted-dek",
        kekVersion: 1
      });
      mockKMSDecrypt.mockRejectedValue(new Error("KMS error"));
      await _chunk5BHWYHGYcjs.globalExpect.call(void 0, service.encrypt(new Uint8Array(Buffer.from("test")), null, 1)).rejects.toThrow("KMS error");
    });
    _chunk5BHWYHGYcjs.it.call(void 0, "should propagate errors from EncryptionModule", async () => {
      mockSharedDEKDatagateway.getDEK.mockResolvedValue({
        version: 1,
        encryptedDek: "encrypted-dek",
        kekVersion: 1
      });
      mockKMSDecrypt.mockResolvedValue("test-dek-key");
      mockEncrypt.mockRejectedValue(new Error("Encryption error"));
      await _chunk5BHWYHGYcjs.globalExpect.call(void 0, service.encrypt(new Uint8Array(Buffer.from("test")), null, 1)).rejects.toThrow("Encryption error");
    });
    _chunk5BHWYHGYcjs.it.call(void 0, "should propagate errors from SharedDEKDatagateway", async () => {
      mockSharedDEKDatagateway.getDEK.mockRejectedValue(new Error("Database error"));
      await _chunk5BHWYHGYcjs.globalExpect.call(void 0, service.encrypt(new Uint8Array(Buffer.from("test")), null, 1)).rejects.toThrow("Database error");
    });
  });
  _chunk5BHWYHGYcjs.describe.call(void 0, "integration scenarios", () => {
    _chunk5BHWYHGYcjs.it.call(void 0, "should handle full encrypt/decrypt cycle", async () => {
      const originalData = new Uint8Array(Buffer.from("secret data"));
      const dek = {
        version: 1,
        dek: "test-dek-key",
        kekVersion: 1
      };
      mockSharedDEKDatagateway.getDEK.mockResolvedValue({
        version: 1,
        encryptedDek: "encrypted-dek",
        kekVersion: 1
      });
      mockKMSDecrypt.mockResolvedValue(dek.dek);
      mockEncrypt.mockResolvedValue({
        ciphertext: "encrypted-payload",
        nonce: _crypto2.default.randomBytes(12)
      });
      const encryptResult = await service.encrypt(originalData, null, 1);
      mockDecrypt.mockResolvedValue(originalData);
      const decryptResult = await service.decrypt(
        encryptResult.ciphertext,
        encryptResult.nonce,
        encryptResult.dekVersion
      );
      _chunk5BHWYHGYcjs.globalExpect.call(void 0, decryptResult).toEqual(originalData);
      _chunk5BHWYHGYcjs.globalExpect.call(void 0, mockSharedDEKDatagateway.getDEK).toHaveBeenCalledTimes(1);
      _chunk5BHWYHGYcjs.globalExpect.call(void 0, mockKMSDecrypt).toHaveBeenCalledTimes(1);
    });
  });
});
//# sourceMappingURL=encryption.service.spec.cjs.map