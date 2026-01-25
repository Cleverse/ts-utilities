import {
  EncryptionModule,
  EnvelopeEncryptionService
} from "../chunk-I5JF2RGP.js";
import "../chunk-SLMXJXNK.js";
import "../chunk-TBVESBXG.js";
import "../chunk-2U6RGUPV.js";
import {
  beforeEach,
  describe,
  globalExpect,
  it,
  vi
} from "../chunk-AZYASILH.js";
import "../chunk-G3PMV62Z.js";

// src/encryption/encryption.service.spec.ts
import crypto from "crypto";
vi.mock("./index", () => ({
  EncryptionModule: {
    encrypt: vi.fn(),
    decrypt: vi.fn(),
    generateEncryptionKey: vi.fn()
  }
}));
var mockEncrypt = vi.mocked(EncryptionModule.encrypt);
var mockDecrypt = vi.mocked(EncryptionModule.decrypt);
var mockGenerateEncryptionKey = vi.mocked(EncryptionModule.generateEncryptionKey);
var mockKMSEncrypt = vi.fn();
var mockKMSDecrypt = vi.fn();
var mockKMSClient = {
  encrypt: mockKMSEncrypt,
  decrypt: mockKMSDecrypt
};
var mockSharedDEKDatagateway = {
  getDEK: vi.fn(),
  insertNewDEK: vi.fn()
};
describe("EnvelopeEncryptionService", () => {
  let service;
  let config;
  beforeEach(() => {
    vi.clearAllMocks();
    config = {};
    service = new EnvelopeEncryptionService(mockKMSClient, mockSharedDEKDatagateway, config);
  });
  describe("encrypt", () => {
    const testData = new Uint8Array(Buffer.from("hello world"));
    const testNonce = crypto.randomBytes(12);
    const encryptedResult = {
      ciphertext: "encrypted-data",
      nonce: testNonce
    };
    const dek = {
      version: 1,
      dek: "test-dek-key",
      kekVersion: 1
    };
    it("should encrypt data with specified DEK version", async () => {
      mockSharedDEKDatagateway.getDEK.mockResolvedValue({
        version: 1,
        encryptedDek: "encrypted-dek",
        kekVersion: 1
      });
      mockKMSDecrypt.mockResolvedValue(dek.dek);
      mockEncrypt.mockResolvedValue(encryptedResult);
      const result = await service.encrypt(testData, testNonce, 1);
      globalExpect(mockSharedDEKDatagateway.getDEK).toHaveBeenCalledWith(1);
      globalExpect(mockKMSDecrypt).toHaveBeenCalledWith("encrypted-dek", "1");
      globalExpect(EncryptionModule.encrypt).toHaveBeenCalledWith(testData, dek.dek, testNonce);
      globalExpect(result).toEqual({
        dekVersion: 1,
        nonce: testNonce,
        ciphertext: "encrypted-data"
      });
    });
    it("should encrypt data with default DEK version when not specified", async () => {
      config.defaultVersion = 2;
      mockSharedDEKDatagateway.getDEK.mockResolvedValue({
        version: 2,
        encryptedDek: "encrypted-dek",
        kekVersion: 1
      });
      mockKMSDecrypt.mockResolvedValue(dek.dek);
      mockEncrypt.mockResolvedValue(encryptedResult);
      const result = await service.encrypt(testData, testNonce);
      globalExpect(mockSharedDEKDatagateway.getDEK).toHaveBeenCalledWith(2);
      globalExpect(result.dekVersion).toBe(2);
    });
    it("should throw error when DEK is not found", async () => {
      mockSharedDEKDatagateway.getDEK.mockResolvedValue(null);
      await globalExpect(service.encrypt(testData, testNonce, 1)).rejects.toThrow("Failed to encrypt data, DEK not found");
    });
    it("should use generated nonce when not provided", async () => {
      mockSharedDEKDatagateway.getDEK.mockResolvedValue({
        version: 1,
        encryptedDek: "encrypted-dek",
        kekVersion: 1
      });
      mockKMSDecrypt.mockResolvedValue(dek.dek);
      mockEncrypt.mockResolvedValue(encryptedResult);
      const result = await service.encrypt(testData);
      globalExpect(EncryptionModule.encrypt).toHaveBeenCalledWith(testData, dek.dek, void 0);
      globalExpect(result.nonce).toEqual(testNonce);
    });
  });
  describe("decrypt", () => {
    const ciphertext = "encrypted-data";
    const nonce = crypto.randomBytes(12);
    const decryptedData = new Uint8Array(Buffer.from("hello world"));
    const dek = {
      version: 1,
      dek: "test-dek-key",
      kekVersion: 1
    };
    it("should decrypt data successfully", async () => {
      mockSharedDEKDatagateway.getDEK.mockResolvedValue({
        version: 1,
        encryptedDek: "encrypted-dek",
        kekVersion: 1
      });
      mockKMSDecrypt.mockResolvedValue(dek.dek);
      mockDecrypt.mockResolvedValue(decryptedData);
      const result = await service.decrypt(ciphertext, nonce, 1);
      globalExpect(mockSharedDEKDatagateway.getDEK).toHaveBeenCalledWith(1);
      globalExpect(mockKMSDecrypt).toHaveBeenCalledWith("encrypted-dek", "1");
      globalExpect(EncryptionModule.decrypt).toHaveBeenCalledWith(ciphertext, nonce, dek.dek);
      globalExpect(result).toEqual(decryptedData);
    });
    it("should throw error when DEK is not found", async () => {
      mockSharedDEKDatagateway.getDEK.mockResolvedValue(null);
      await globalExpect(service.decrypt(ciphertext, nonce, 1)).rejects.toThrow("Failed to decrypt data, DEK not found");
    });
  });
  describe("rotateDEK", () => {
    const newDek = "new-generated-dek";
    const encryptedDek = "kms-encrypted-dek";
    const cryptoKeyVersion = "1";
    const insertedDek = {
      version: 2,
      encryptedDek,
      kekVersion: 1
    };
    it("should rotate DEK successfully", async () => {
      mockGenerateEncryptionKey.mockReturnValue(newDek);
      mockKMSEncrypt.mockResolvedValue({
        ciphertext: encryptedDek,
        cryptoKeyVersion
      });
      mockSharedDEKDatagateway.insertNewDEK.mockResolvedValue(insertedDek);
      const result = await service.rotateDEK();
      globalExpect(EncryptionModule.generateEncryptionKey).toHaveBeenCalledWith("hex");
      globalExpect(mockKMSEncrypt).toHaveBeenCalledWith(newDek, void 0);
      globalExpect(mockSharedDEKDatagateway.insertNewDEK).toHaveBeenCalledWith(encryptedDek, 1);
      globalExpect(result).toBe(2);
    });
    it("should rotate DEK with specific KEK version", async () => {
      const kekVersion = "2";
      mockGenerateEncryptionKey.mockReturnValue(newDek);
      mockKMSEncrypt.mockResolvedValue({
        ciphertext: encryptedDek,
        cryptoKeyVersion
      });
      mockSharedDEKDatagateway.insertNewDEK.mockResolvedValue(insertedDek);
      const result = await service.rotateDEK(kekVersion);
      globalExpect(mockKMSEncrypt).toHaveBeenCalledWith(newDek, kekVersion);
      globalExpect(result).toBe(2);
    });
  });
  describe("#getDEK (private method testing via caching behavior)", () => {
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
    it("should cache DEK after first retrieval", async () => {
      mockSharedDEKDatagateway.getDEK.mockResolvedValue(encryptedDek);
      mockKMSDecrypt.mockResolvedValue(dek.dek);
      await service.encrypt(new Uint8Array(Buffer.from("test")), null, 1);
      globalExpect(mockSharedDEKDatagateway.getDEK).toHaveBeenCalledTimes(1);
      globalExpect(mockKMSDecrypt).toHaveBeenCalledTimes(1);
      await service.encrypt(new Uint8Array(Buffer.from("test")), null, 1);
      globalExpect(mockSharedDEKDatagateway.getDEK).toHaveBeenCalledTimes(1);
      globalExpect(mockKMSDecrypt).toHaveBeenCalledTimes(1);
    });
    it("should not cache when DEK is not found", async () => {
      mockSharedDEKDatagateway.getDEK.mockResolvedValue(null);
      await globalExpect(service.encrypt(new Uint8Array(Buffer.from("test")), null, 1)).rejects.toThrow();
      await globalExpect(service.encrypt(new Uint8Array(Buffer.from("test")), null, 1)).rejects.toThrow();
      globalExpect(mockSharedDEKDatagateway.getDEK).toHaveBeenCalledTimes(2);
    });
    it("should use default version when no version specified", async () => {
      config.defaultVersion = 5;
      mockSharedDEKDatagateway.getDEK.mockResolvedValue(encryptedDek);
      mockKMSDecrypt.mockResolvedValue(dek.dek);
      await service.encrypt(new Uint8Array(Buffer.from("test")), null);
      globalExpect(mockSharedDEKDatagateway.getDEK).toHaveBeenCalledWith(5);
    });
  });
  describe("error handling", () => {
    it("should propagate errors from KMS client", async () => {
      mockSharedDEKDatagateway.getDEK.mockResolvedValue({
        version: 1,
        encryptedDek: "encrypted-dek",
        kekVersion: 1
      });
      mockKMSDecrypt.mockRejectedValue(new Error("KMS error"));
      await globalExpect(service.encrypt(new Uint8Array(Buffer.from("test")), null, 1)).rejects.toThrow("KMS error");
    });
    it("should propagate errors from EncryptionModule", async () => {
      mockSharedDEKDatagateway.getDEK.mockResolvedValue({
        version: 1,
        encryptedDek: "encrypted-dek",
        kekVersion: 1
      });
      mockKMSDecrypt.mockResolvedValue("test-dek-key");
      mockEncrypt.mockRejectedValue(new Error("Encryption error"));
      await globalExpect(service.encrypt(new Uint8Array(Buffer.from("test")), null, 1)).rejects.toThrow("Encryption error");
    });
    it("should propagate errors from SharedDEKDatagateway", async () => {
      mockSharedDEKDatagateway.getDEK.mockRejectedValue(new Error("Database error"));
      await globalExpect(service.encrypt(new Uint8Array(Buffer.from("test")), null, 1)).rejects.toThrow("Database error");
    });
  });
  describe("integration scenarios", () => {
    it("should handle full encrypt/decrypt cycle", async () => {
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
        nonce: crypto.randomBytes(12)
      });
      const encryptResult = await service.encrypt(originalData, null, 1);
      mockDecrypt.mockResolvedValue(originalData);
      const decryptResult = await service.decrypt(
        encryptResult.ciphertext,
        encryptResult.nonce,
        encryptResult.dekVersion
      );
      globalExpect(decryptResult).toEqual(originalData);
      globalExpect(mockSharedDEKDatagateway.getDEK).toHaveBeenCalledTimes(1);
      globalExpect(mockKMSDecrypt).toHaveBeenCalledTimes(1);
    });
  });
});
//# sourceMappingURL=encryption.service.spec.js.map