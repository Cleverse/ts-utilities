"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }


var _chunkCSFWGYXDcjs = require('../chunk-CSFWGYXD.cjs');
require('../chunk-NRZ4BV6Q.cjs');
require('../chunk-PJOHUDZ2.cjs');
require('../chunk-CU6GGSDD.cjs');






var _chunkDS2XYV5Gcjs = require('../chunk-DS2XYV5G.cjs');


var _chunkT6TWWATEcjs = require('../chunk-T6TWWATE.cjs');

// src/encryption/encryption.service.spec.ts
_chunkT6TWWATEcjs.init_cjs_shims.call(void 0, );
var _crypto = require('crypto'); var _crypto2 = _interopRequireDefault(_crypto);
_chunkDS2XYV5Gcjs.vi.mock("./index", () => ({
  EncryptionModule: {
    encrypt: _chunkDS2XYV5Gcjs.vi.fn(),
    decrypt: _chunkDS2XYV5Gcjs.vi.fn(),
    generateEncryptionKey: _chunkDS2XYV5Gcjs.vi.fn()
  }
}));
var mockEncrypt = _chunkDS2XYV5Gcjs.vi.mocked(_chunkCSFWGYXDcjs.EncryptionModule.encrypt);
var mockDecrypt = _chunkDS2XYV5Gcjs.vi.mocked(_chunkCSFWGYXDcjs.EncryptionModule.decrypt);
var mockGenerateEncryptionKey = _chunkDS2XYV5Gcjs.vi.mocked(_chunkCSFWGYXDcjs.EncryptionModule.generateEncryptionKey);
var mockKMSEncrypt = _chunkDS2XYV5Gcjs.vi.fn();
var mockKMSDecrypt = _chunkDS2XYV5Gcjs.vi.fn();
var mockKMSClient = {
  encrypt: mockKMSEncrypt,
  decrypt: mockKMSDecrypt
};
var mockSharedDEKDatagateway = {
  getDEK: _chunkDS2XYV5Gcjs.vi.fn(),
  insertNewDEK: _chunkDS2XYV5Gcjs.vi.fn()
};
_chunkDS2XYV5Gcjs.describe.call(void 0, "EnvelopeEncryptionService", () => {
  let service;
  let config;
  _chunkDS2XYV5Gcjs.beforeEach.call(void 0, () => {
    _chunkDS2XYV5Gcjs.vi.clearAllMocks();
    config = {};
    service = new (0, _chunkCSFWGYXDcjs.EnvelopeEncryptionService)(mockKMSClient, mockSharedDEKDatagateway, config);
  });
  _chunkDS2XYV5Gcjs.describe.call(void 0, "encrypt", () => {
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
    _chunkDS2XYV5Gcjs.it.call(void 0, "should encrypt data with specified DEK version", async () => {
      mockSharedDEKDatagateway.getDEK.mockResolvedValue({
        version: 1,
        encryptedDek: "encrypted-dek",
        kekVersion: 1
      });
      mockKMSDecrypt.mockResolvedValue(dek.dek);
      mockEncrypt.mockResolvedValue(encryptedResult);
      const result = await service.encrypt(testData, testNonce, 1);
      _chunkDS2XYV5Gcjs.globalExpect.call(void 0, mockSharedDEKDatagateway.getDEK).toHaveBeenCalledWith(1);
      _chunkDS2XYV5Gcjs.globalExpect.call(void 0, mockKMSDecrypt).toHaveBeenCalledWith("encrypted-dek", "1");
      _chunkDS2XYV5Gcjs.globalExpect.call(void 0, _chunkCSFWGYXDcjs.EncryptionModule.encrypt).toHaveBeenCalledWith(testData, dek.dek, testNonce);
      _chunkDS2XYV5Gcjs.globalExpect.call(void 0, result).toEqual({
        dekVersion: 1,
        nonce: testNonce,
        ciphertext: "encrypted-data"
      });
    });
    _chunkDS2XYV5Gcjs.it.call(void 0, "should encrypt data with default DEK version when not specified", async () => {
      config.defaultVersion = 2;
      mockSharedDEKDatagateway.getDEK.mockResolvedValue({
        version: 2,
        encryptedDek: "encrypted-dek",
        kekVersion: 1
      });
      mockKMSDecrypt.mockResolvedValue(dek.dek);
      mockEncrypt.mockResolvedValue(encryptedResult);
      const result = await service.encrypt(testData, testNonce);
      _chunkDS2XYV5Gcjs.globalExpect.call(void 0, mockSharedDEKDatagateway.getDEK).toHaveBeenCalledWith(2);
      _chunkDS2XYV5Gcjs.globalExpect.call(void 0, result.dekVersion).toBe(2);
    });
    _chunkDS2XYV5Gcjs.it.call(void 0, "should throw error when DEK is not found", async () => {
      mockSharedDEKDatagateway.getDEK.mockResolvedValue(null);
      await _chunkDS2XYV5Gcjs.globalExpect.call(void 0, service.encrypt(testData, testNonce, 1)).rejects.toThrow("Failed to encrypt data, DEK not found");
    });
    _chunkDS2XYV5Gcjs.it.call(void 0, "should use generated nonce when not provided", async () => {
      mockSharedDEKDatagateway.getDEK.mockResolvedValue({
        version: 1,
        encryptedDek: "encrypted-dek",
        kekVersion: 1
      });
      mockKMSDecrypt.mockResolvedValue(dek.dek);
      mockEncrypt.mockResolvedValue(encryptedResult);
      const result = await service.encrypt(testData);
      _chunkDS2XYV5Gcjs.globalExpect.call(void 0, _chunkCSFWGYXDcjs.EncryptionModule.encrypt).toHaveBeenCalledWith(testData, dek.dek, void 0);
      _chunkDS2XYV5Gcjs.globalExpect.call(void 0, result.nonce).toEqual(testNonce);
    });
  });
  _chunkDS2XYV5Gcjs.describe.call(void 0, "decrypt", () => {
    const ciphertext = "encrypted-data";
    const nonce = _crypto2.default.randomBytes(12);
    const decryptedData = new Uint8Array(Buffer.from("hello world"));
    const dek = {
      version: 1,
      dek: "test-dek-key",
      kekVersion: 1
    };
    _chunkDS2XYV5Gcjs.it.call(void 0, "should decrypt data successfully", async () => {
      mockSharedDEKDatagateway.getDEK.mockResolvedValue({
        version: 1,
        encryptedDek: "encrypted-dek",
        kekVersion: 1
      });
      mockKMSDecrypt.mockResolvedValue(dek.dek);
      mockDecrypt.mockResolvedValue(decryptedData);
      const result = await service.decrypt(ciphertext, nonce, 1);
      _chunkDS2XYV5Gcjs.globalExpect.call(void 0, mockSharedDEKDatagateway.getDEK).toHaveBeenCalledWith(1);
      _chunkDS2XYV5Gcjs.globalExpect.call(void 0, mockKMSDecrypt).toHaveBeenCalledWith("encrypted-dek", "1");
      _chunkDS2XYV5Gcjs.globalExpect.call(void 0, _chunkCSFWGYXDcjs.EncryptionModule.decrypt).toHaveBeenCalledWith(ciphertext, nonce, dek.dek);
      _chunkDS2XYV5Gcjs.globalExpect.call(void 0, result).toEqual(decryptedData);
    });
    _chunkDS2XYV5Gcjs.it.call(void 0, "should throw error when DEK is not found", async () => {
      mockSharedDEKDatagateway.getDEK.mockResolvedValue(null);
      await _chunkDS2XYV5Gcjs.globalExpect.call(void 0, service.decrypt(ciphertext, nonce, 1)).rejects.toThrow("Failed to decrypt data, DEK not found");
    });
  });
  _chunkDS2XYV5Gcjs.describe.call(void 0, "rotateDEK", () => {
    const newDek = "new-generated-dek";
    const encryptedDek = "kms-encrypted-dek";
    const cryptoKeyVersion = "1";
    const insertedDek = {
      version: 2,
      encryptedDek,
      kekVersion: 1
    };
    _chunkDS2XYV5Gcjs.it.call(void 0, "should rotate DEK successfully", async () => {
      mockGenerateEncryptionKey.mockReturnValue(newDek);
      mockKMSEncrypt.mockResolvedValue({
        ciphertext: encryptedDek,
        cryptoKeyVersion
      });
      mockSharedDEKDatagateway.insertNewDEK.mockResolvedValue(insertedDek);
      const result = await service.rotateDEK();
      _chunkDS2XYV5Gcjs.globalExpect.call(void 0, _chunkCSFWGYXDcjs.EncryptionModule.generateEncryptionKey).toHaveBeenCalledWith("hex");
      _chunkDS2XYV5Gcjs.globalExpect.call(void 0, mockKMSEncrypt).toHaveBeenCalledWith(newDek, void 0);
      _chunkDS2XYV5Gcjs.globalExpect.call(void 0, mockSharedDEKDatagateway.insertNewDEK).toHaveBeenCalledWith(encryptedDek, 1);
      _chunkDS2XYV5Gcjs.globalExpect.call(void 0, result).toBe(2);
    });
    _chunkDS2XYV5Gcjs.it.call(void 0, "should rotate DEK with specific KEK version", async () => {
      const kekVersion = "2";
      mockGenerateEncryptionKey.mockReturnValue(newDek);
      mockKMSEncrypt.mockResolvedValue({
        ciphertext: encryptedDek,
        cryptoKeyVersion
      });
      mockSharedDEKDatagateway.insertNewDEK.mockResolvedValue(insertedDek);
      const result = await service.rotateDEK(kekVersion);
      _chunkDS2XYV5Gcjs.globalExpect.call(void 0, mockKMSEncrypt).toHaveBeenCalledWith(newDek, kekVersion);
      _chunkDS2XYV5Gcjs.globalExpect.call(void 0, result).toBe(2);
    });
  });
  _chunkDS2XYV5Gcjs.describe.call(void 0, "#getDEK (private method testing via caching behavior)", () => {
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
    _chunkDS2XYV5Gcjs.it.call(void 0, "should cache DEK after first retrieval", async () => {
      mockSharedDEKDatagateway.getDEK.mockResolvedValue(encryptedDek);
      mockKMSDecrypt.mockResolvedValue(dek.dek);
      await service.encrypt(new Uint8Array(Buffer.from("test")), null, 1);
      _chunkDS2XYV5Gcjs.globalExpect.call(void 0, mockSharedDEKDatagateway.getDEK).toHaveBeenCalledTimes(1);
      _chunkDS2XYV5Gcjs.globalExpect.call(void 0, mockKMSDecrypt).toHaveBeenCalledTimes(1);
      await service.encrypt(new Uint8Array(Buffer.from("test")), null, 1);
      _chunkDS2XYV5Gcjs.globalExpect.call(void 0, mockSharedDEKDatagateway.getDEK).toHaveBeenCalledTimes(1);
      _chunkDS2XYV5Gcjs.globalExpect.call(void 0, mockKMSDecrypt).toHaveBeenCalledTimes(1);
    });
    _chunkDS2XYV5Gcjs.it.call(void 0, "should not cache when DEK is not found", async () => {
      mockSharedDEKDatagateway.getDEK.mockResolvedValue(null);
      await _chunkDS2XYV5Gcjs.globalExpect.call(void 0, service.encrypt(new Uint8Array(Buffer.from("test")), null, 1)).rejects.toThrow();
      await _chunkDS2XYV5Gcjs.globalExpect.call(void 0, service.encrypt(new Uint8Array(Buffer.from("test")), null, 1)).rejects.toThrow();
      _chunkDS2XYV5Gcjs.globalExpect.call(void 0, mockSharedDEKDatagateway.getDEK).toHaveBeenCalledTimes(2);
    });
    _chunkDS2XYV5Gcjs.it.call(void 0, "should use default version when no version specified", async () => {
      config.defaultVersion = 5;
      mockSharedDEKDatagateway.getDEK.mockResolvedValue(encryptedDek);
      mockKMSDecrypt.mockResolvedValue(dek.dek);
      await service.encrypt(new Uint8Array(Buffer.from("test")), null);
      _chunkDS2XYV5Gcjs.globalExpect.call(void 0, mockSharedDEKDatagateway.getDEK).toHaveBeenCalledWith(5);
    });
  });
  _chunkDS2XYV5Gcjs.describe.call(void 0, "error handling", () => {
    _chunkDS2XYV5Gcjs.it.call(void 0, "should propagate errors from KMS client", async () => {
      mockSharedDEKDatagateway.getDEK.mockResolvedValue({
        version: 1,
        encryptedDek: "encrypted-dek",
        kekVersion: 1
      });
      mockKMSDecrypt.mockRejectedValue(new Error("KMS error"));
      await _chunkDS2XYV5Gcjs.globalExpect.call(void 0, service.encrypt(new Uint8Array(Buffer.from("test")), null, 1)).rejects.toThrow("KMS error");
    });
    _chunkDS2XYV5Gcjs.it.call(void 0, "should propagate errors from EncryptionModule", async () => {
      mockSharedDEKDatagateway.getDEK.mockResolvedValue({
        version: 1,
        encryptedDek: "encrypted-dek",
        kekVersion: 1
      });
      mockKMSDecrypt.mockResolvedValue("test-dek-key");
      mockEncrypt.mockRejectedValue(new Error("Encryption error"));
      await _chunkDS2XYV5Gcjs.globalExpect.call(void 0, service.encrypt(new Uint8Array(Buffer.from("test")), null, 1)).rejects.toThrow("Encryption error");
    });
    _chunkDS2XYV5Gcjs.it.call(void 0, "should propagate errors from SharedDEKDatagateway", async () => {
      mockSharedDEKDatagateway.getDEK.mockRejectedValue(new Error("Database error"));
      await _chunkDS2XYV5Gcjs.globalExpect.call(void 0, service.encrypt(new Uint8Array(Buffer.from("test")), null, 1)).rejects.toThrow("Database error");
    });
  });
  _chunkDS2XYV5Gcjs.describe.call(void 0, "integration scenarios", () => {
    _chunkDS2XYV5Gcjs.it.call(void 0, "should handle full encrypt/decrypt cycle", async () => {
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
      _chunkDS2XYV5Gcjs.globalExpect.call(void 0, decryptResult).toEqual(originalData);
      _chunkDS2XYV5Gcjs.globalExpect.call(void 0, mockSharedDEKDatagateway.getDEK).toHaveBeenCalledTimes(1);
      _chunkDS2XYV5Gcjs.globalExpect.call(void 0, mockKMSDecrypt).toHaveBeenCalledTimes(1);
    });
  });
});
//# sourceMappingURL=encryption.service.spec.cjs.map