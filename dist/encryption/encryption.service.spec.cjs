"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }


var _chunkYR6R4OPAcjs = require('../chunk-YR6R4OPA.cjs');
require('../chunk-LVRYD6CX.cjs');
require('../chunk-HQ5UCOMY.cjs');
require('../chunk-PVTSJRDB.cjs');






var _chunkBFR6AXPAcjs = require('../chunk-BFR6AXPA.cjs');


var _chunk2X3FSA3Bcjs = require('../chunk-2X3FSA3B.cjs');

// src/encryption/encryption.service.spec.ts
_chunk2X3FSA3Bcjs.init_cjs_shims.call(void 0, );
var _crypto = require('crypto'); var _crypto2 = _interopRequireDefault(_crypto);
_chunkBFR6AXPAcjs.vi.mock("./index", () => ({
  EncryptionModule: {
    encrypt: _chunkBFR6AXPAcjs.vi.fn(),
    decrypt: _chunkBFR6AXPAcjs.vi.fn(),
    generateEncryptionKey: _chunkBFR6AXPAcjs.vi.fn()
  }
}));
var mockEncrypt = _chunkBFR6AXPAcjs.vi.mocked(_chunkYR6R4OPAcjs.EncryptionModule.encrypt);
var mockDecrypt = _chunkBFR6AXPAcjs.vi.mocked(_chunkYR6R4OPAcjs.EncryptionModule.decrypt);
var mockGenerateEncryptionKey = _chunkBFR6AXPAcjs.vi.mocked(_chunkYR6R4OPAcjs.EncryptionModule.generateEncryptionKey);
var mockKMSEncrypt = _chunkBFR6AXPAcjs.vi.fn();
var mockKMSDecrypt = _chunkBFR6AXPAcjs.vi.fn();
var mockKMSClient = {
  encrypt: mockKMSEncrypt,
  decrypt: mockKMSDecrypt
};
var mockSharedDEKDatagateway = {
  getDEK: _chunkBFR6AXPAcjs.vi.fn(),
  insertNewDEK: _chunkBFR6AXPAcjs.vi.fn()
};
_chunkBFR6AXPAcjs.describe.call(void 0, "EnvelopeEncryptionService", () => {
  let service;
  let config;
  _chunkBFR6AXPAcjs.beforeEach.call(void 0, () => {
    _chunkBFR6AXPAcjs.vi.clearAllMocks();
    config = {};
    service = new (0, _chunkYR6R4OPAcjs.EnvelopeEncryptionService)(mockKMSClient, mockSharedDEKDatagateway, config);
  });
  _chunkBFR6AXPAcjs.describe.call(void 0, "encrypt", () => {
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
    _chunkBFR6AXPAcjs.it.call(void 0, "should encrypt data with specified DEK version", async () => {
      mockSharedDEKDatagateway.getDEK.mockResolvedValue({
        version: 1,
        encryptedDek: "encrypted-dek",
        kekVersion: 1
      });
      mockKMSDecrypt.mockResolvedValue(dek.dek);
      mockEncrypt.mockResolvedValue(encryptedResult);
      const result = await service.encrypt(testData, testNonce, 1);
      _chunkBFR6AXPAcjs.globalExpect.call(void 0, mockSharedDEKDatagateway.getDEK).toHaveBeenCalledWith(1);
      _chunkBFR6AXPAcjs.globalExpect.call(void 0, mockKMSDecrypt).toHaveBeenCalledWith("encrypted-dek", "1");
      _chunkBFR6AXPAcjs.globalExpect.call(void 0, _chunkYR6R4OPAcjs.EncryptionModule.encrypt).toHaveBeenCalledWith(testData, dek.dek, testNonce);
      _chunkBFR6AXPAcjs.globalExpect.call(void 0, result).toEqual({
        dekVersion: 1,
        nonce: testNonce,
        ciphertext: "encrypted-data"
      });
    });
    _chunkBFR6AXPAcjs.it.call(void 0, "should encrypt data with default DEK version when not specified", async () => {
      config.defaultVersion = 2;
      mockSharedDEKDatagateway.getDEK.mockResolvedValue({
        version: 2,
        encryptedDek: "encrypted-dek",
        kekVersion: 1
      });
      mockKMSDecrypt.mockResolvedValue(dek.dek);
      mockEncrypt.mockResolvedValue(encryptedResult);
      const result = await service.encrypt(testData, testNonce);
      _chunkBFR6AXPAcjs.globalExpect.call(void 0, mockSharedDEKDatagateway.getDEK).toHaveBeenCalledWith(2);
      _chunkBFR6AXPAcjs.globalExpect.call(void 0, result.dekVersion).toBe(2);
    });
    _chunkBFR6AXPAcjs.it.call(void 0, "should throw error when DEK is not found", async () => {
      mockSharedDEKDatagateway.getDEK.mockResolvedValue(null);
      await _chunkBFR6AXPAcjs.globalExpect.call(void 0, service.encrypt(testData, testNonce, 1)).rejects.toThrow("Failed to encrypt data, DEK not found");
    });
    _chunkBFR6AXPAcjs.it.call(void 0, "should use generated nonce when not provided", async () => {
      mockSharedDEKDatagateway.getDEK.mockResolvedValue({
        version: 1,
        encryptedDek: "encrypted-dek",
        kekVersion: 1
      });
      mockKMSDecrypt.mockResolvedValue(dek.dek);
      mockEncrypt.mockResolvedValue(encryptedResult);
      const result = await service.encrypt(testData);
      _chunkBFR6AXPAcjs.globalExpect.call(void 0, _chunkYR6R4OPAcjs.EncryptionModule.encrypt).toHaveBeenCalledWith(testData, dek.dek, void 0);
      _chunkBFR6AXPAcjs.globalExpect.call(void 0, result.nonce).toEqual(testNonce);
    });
  });
  _chunkBFR6AXPAcjs.describe.call(void 0, "decrypt", () => {
    const ciphertext = "encrypted-data";
    const nonce = _crypto2.default.randomBytes(12);
    const decryptedData = new Uint8Array(Buffer.from("hello world"));
    const dek = {
      version: 1,
      dek: "test-dek-key",
      kekVersion: 1
    };
    _chunkBFR6AXPAcjs.it.call(void 0, "should decrypt data successfully", async () => {
      mockSharedDEKDatagateway.getDEK.mockResolvedValue({
        version: 1,
        encryptedDek: "encrypted-dek",
        kekVersion: 1
      });
      mockKMSDecrypt.mockResolvedValue(dek.dek);
      mockDecrypt.mockResolvedValue(decryptedData);
      const result = await service.decrypt(ciphertext, nonce, 1);
      _chunkBFR6AXPAcjs.globalExpect.call(void 0, mockSharedDEKDatagateway.getDEK).toHaveBeenCalledWith(1);
      _chunkBFR6AXPAcjs.globalExpect.call(void 0, mockKMSDecrypt).toHaveBeenCalledWith("encrypted-dek", "1");
      _chunkBFR6AXPAcjs.globalExpect.call(void 0, _chunkYR6R4OPAcjs.EncryptionModule.decrypt).toHaveBeenCalledWith(ciphertext, nonce, dek.dek);
      _chunkBFR6AXPAcjs.globalExpect.call(void 0, result).toEqual(decryptedData);
    });
    _chunkBFR6AXPAcjs.it.call(void 0, "should throw error when DEK is not found", async () => {
      mockSharedDEKDatagateway.getDEK.mockResolvedValue(null);
      await _chunkBFR6AXPAcjs.globalExpect.call(void 0, service.decrypt(ciphertext, nonce, 1)).rejects.toThrow("Failed to decrypt data, DEK not found");
    });
  });
  _chunkBFR6AXPAcjs.describe.call(void 0, "rotateDEK", () => {
    const newDek = "new-generated-dek";
    const encryptedDek = "kms-encrypted-dek";
    const cryptoKeyVersion = "1";
    const insertedDek = {
      version: 2,
      encryptedDek,
      kekVersion: 1
    };
    _chunkBFR6AXPAcjs.it.call(void 0, "should rotate DEK successfully", async () => {
      mockGenerateEncryptionKey.mockReturnValue(newDek);
      mockKMSEncrypt.mockResolvedValue({
        ciphertext: encryptedDek,
        cryptoKeyVersion
      });
      mockSharedDEKDatagateway.insertNewDEK.mockResolvedValue(insertedDek);
      const result = await service.rotateDEK();
      _chunkBFR6AXPAcjs.globalExpect.call(void 0, _chunkYR6R4OPAcjs.EncryptionModule.generateEncryptionKey).toHaveBeenCalledWith("hex");
      _chunkBFR6AXPAcjs.globalExpect.call(void 0, mockKMSEncrypt).toHaveBeenCalledWith(newDek, void 0);
      _chunkBFR6AXPAcjs.globalExpect.call(void 0, mockSharedDEKDatagateway.insertNewDEK).toHaveBeenCalledWith(encryptedDek, 1);
      _chunkBFR6AXPAcjs.globalExpect.call(void 0, result).toBe(2);
    });
    _chunkBFR6AXPAcjs.it.call(void 0, "should rotate DEK with specific KEK version", async () => {
      const kekVersion = "2";
      mockGenerateEncryptionKey.mockReturnValue(newDek);
      mockKMSEncrypt.mockResolvedValue({
        ciphertext: encryptedDek,
        cryptoKeyVersion
      });
      mockSharedDEKDatagateway.insertNewDEK.mockResolvedValue(insertedDek);
      const result = await service.rotateDEK(kekVersion);
      _chunkBFR6AXPAcjs.globalExpect.call(void 0, mockKMSEncrypt).toHaveBeenCalledWith(newDek, kekVersion);
      _chunkBFR6AXPAcjs.globalExpect.call(void 0, result).toBe(2);
    });
  });
  _chunkBFR6AXPAcjs.describe.call(void 0, "#getDEK (private method testing via caching behavior)", () => {
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
    _chunkBFR6AXPAcjs.it.call(void 0, "should cache DEK after first retrieval", async () => {
      mockSharedDEKDatagateway.getDEK.mockResolvedValue(encryptedDek);
      mockKMSDecrypt.mockResolvedValue(dek.dek);
      await service.encrypt(new Uint8Array(Buffer.from("test")), null, 1);
      _chunkBFR6AXPAcjs.globalExpect.call(void 0, mockSharedDEKDatagateway.getDEK).toHaveBeenCalledTimes(1);
      _chunkBFR6AXPAcjs.globalExpect.call(void 0, mockKMSDecrypt).toHaveBeenCalledTimes(1);
      await service.encrypt(new Uint8Array(Buffer.from("test")), null, 1);
      _chunkBFR6AXPAcjs.globalExpect.call(void 0, mockSharedDEKDatagateway.getDEK).toHaveBeenCalledTimes(1);
      _chunkBFR6AXPAcjs.globalExpect.call(void 0, mockKMSDecrypt).toHaveBeenCalledTimes(1);
    });
    _chunkBFR6AXPAcjs.it.call(void 0, "should not cache when DEK is not found", async () => {
      mockSharedDEKDatagateway.getDEK.mockResolvedValue(null);
      await _chunkBFR6AXPAcjs.globalExpect.call(void 0, service.encrypt(new Uint8Array(Buffer.from("test")), null, 1)).rejects.toThrow();
      await _chunkBFR6AXPAcjs.globalExpect.call(void 0, service.encrypt(new Uint8Array(Buffer.from("test")), null, 1)).rejects.toThrow();
      _chunkBFR6AXPAcjs.globalExpect.call(void 0, mockSharedDEKDatagateway.getDEK).toHaveBeenCalledTimes(2);
    });
    _chunkBFR6AXPAcjs.it.call(void 0, "should use default version when no version specified", async () => {
      config.defaultVersion = 5;
      mockSharedDEKDatagateway.getDEK.mockResolvedValue(encryptedDek);
      mockKMSDecrypt.mockResolvedValue(dek.dek);
      await service.encrypt(new Uint8Array(Buffer.from("test")), null);
      _chunkBFR6AXPAcjs.globalExpect.call(void 0, mockSharedDEKDatagateway.getDEK).toHaveBeenCalledWith(5);
    });
  });
  _chunkBFR6AXPAcjs.describe.call(void 0, "error handling", () => {
    _chunkBFR6AXPAcjs.it.call(void 0, "should propagate errors from KMS client", async () => {
      mockSharedDEKDatagateway.getDEK.mockResolvedValue({
        version: 1,
        encryptedDek: "encrypted-dek",
        kekVersion: 1
      });
      mockKMSDecrypt.mockRejectedValue(new Error("KMS error"));
      await _chunkBFR6AXPAcjs.globalExpect.call(void 0, service.encrypt(new Uint8Array(Buffer.from("test")), null, 1)).rejects.toThrow("KMS error");
    });
    _chunkBFR6AXPAcjs.it.call(void 0, "should propagate errors from EncryptionModule", async () => {
      mockSharedDEKDatagateway.getDEK.mockResolvedValue({
        version: 1,
        encryptedDek: "encrypted-dek",
        kekVersion: 1
      });
      mockKMSDecrypt.mockResolvedValue("test-dek-key");
      mockEncrypt.mockRejectedValue(new Error("Encryption error"));
      await _chunkBFR6AXPAcjs.globalExpect.call(void 0, service.encrypt(new Uint8Array(Buffer.from("test")), null, 1)).rejects.toThrow("Encryption error");
    });
    _chunkBFR6AXPAcjs.it.call(void 0, "should propagate errors from SharedDEKDatagateway", async () => {
      mockSharedDEKDatagateway.getDEK.mockRejectedValue(new Error("Database error"));
      await _chunkBFR6AXPAcjs.globalExpect.call(void 0, service.encrypt(new Uint8Array(Buffer.from("test")), null, 1)).rejects.toThrow("Database error");
    });
  });
  _chunkBFR6AXPAcjs.describe.call(void 0, "integration scenarios", () => {
    _chunkBFR6AXPAcjs.it.call(void 0, "should handle full encrypt/decrypt cycle", async () => {
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
      _chunkBFR6AXPAcjs.globalExpect.call(void 0, decryptResult).toEqual(originalData);
      _chunkBFR6AXPAcjs.globalExpect.call(void 0, mockSharedDEKDatagateway.getDEK).toHaveBeenCalledTimes(1);
      _chunkBFR6AXPAcjs.globalExpect.call(void 0, mockKMSDecrypt).toHaveBeenCalledTimes(1);
    });
  });
});
//# sourceMappingURL=encryption.service.spec.cjs.map