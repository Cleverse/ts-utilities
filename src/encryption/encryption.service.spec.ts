import crypto from "node:crypto"

import { beforeEach, describe, expect, it, vi } from "vitest"

import { KMSClient } from "@/kms"

import { EnvelopeEncryptionService, type DEK, type EncryptedDEK } from "./encryption.service"

import { EncryptionModule } from "./index"

// Mock the EncryptionModule
vi.mock("./index", () => ({
	EncryptionModule: {
		encrypt: vi.fn(),
		decrypt: vi.fn(),
		generateEncryptionKey: vi.fn(),
	},
}))

const mockEncrypt = vi.mocked(EncryptionModule.encrypt)
const mockDecrypt = vi.mocked(EncryptionModule.decrypt)
const mockGenerateEncryptionKey = vi.mocked(EncryptionModule.generateEncryptionKey)

// Mock the KMS client - create a partial implementation
const mockKMSEncrypt = vi.fn<() => Promise<{ ciphertext: string; cryptoKeyVersion: string }>>()
const mockKMSDecrypt = vi.fn<() => Promise<string>>()

const mockKMSClient = {
	encrypt: mockKMSEncrypt,
	decrypt: mockKMSDecrypt,
} as unknown as KMSClient

// Mock the SharedDEKDatagateway
const mockSharedDEKDatagateway = {
	getDEK: vi.fn<() => Promise<EncryptedDEK | null>>(),
	insertNewDEK: vi.fn<() => Promise<EncryptedDEK>>(),
}

describe("EnvelopeEncryptionService", () => {
	let service: EnvelopeEncryptionService
	let config: { defaultVersion?: number }

	beforeEach(() => {
		vi.clearAllMocks()
		config = {}
		service = new EnvelopeEncryptionService(mockKMSClient, mockSharedDEKDatagateway, config)
	})

	describe("encrypt", () => {
		const testData = new Uint8Array(Buffer.from("hello world"))
		const testNonce = crypto.randomBytes(12)
		const encryptedResult = {
			ciphertext: "encrypted-data",
			nonce: testNonce,
		}
		const dek: DEK = {
			version: 1,
			dek: "test-dek-key",
			kekVersion: 1,
		}

		it("should encrypt data with specified DEK version", async () => {
			mockSharedDEKDatagateway.getDEK.mockResolvedValue({
				version: 1,
				encryptedDek: "encrypted-dek",
				kekVersion: 1,
			})
			mockKMSDecrypt.mockResolvedValue(dek.dek)
			mockEncrypt.mockResolvedValue(encryptedResult)

			const result = await service.encrypt(testData, testNonce, 1)

			expect(mockSharedDEKDatagateway.getDEK).toHaveBeenCalledWith(1)
			expect(mockKMSDecrypt).toHaveBeenCalledWith("encrypted-dek", "1")
			expect(EncryptionModule.encrypt).toHaveBeenCalledWith(testData, dek.dek, testNonce)
			expect(result).toEqual({
				dekVersion: 1,
				nonce: testNonce,
				ciphertext: "encrypted-data",
			})
		})

		it("should encrypt data with default DEK version when not specified", async () => {
			config.defaultVersion = 2
			mockSharedDEKDatagateway.getDEK.mockResolvedValue({
				version: 2,
				encryptedDek: "encrypted-dek",
				kekVersion: 1,
			})
			mockKMSDecrypt.mockResolvedValue(dek.dek)
			mockEncrypt.mockResolvedValue(encryptedResult)

			const result = await service.encrypt(testData, testNonce)

			expect(mockSharedDEKDatagateway.getDEK).toHaveBeenCalledWith(2)
			expect(result.dekVersion).toBe(2)
		})

		it("should throw error when DEK is not found", async () => {
			mockSharedDEKDatagateway.getDEK.mockResolvedValue(null)

			await expect(service.encrypt(testData, testNonce, 1)).rejects.toThrow("Failed to encrypt data, DEK not found")
		})

		it("should use generated nonce when not provided", async () => {
			mockSharedDEKDatagateway.getDEK.mockResolvedValue({
				version: 1,
				encryptedDek: "encrypted-dek",
				kekVersion: 1,
			})
			mockKMSDecrypt.mockResolvedValue(dek.dek)
			mockEncrypt.mockResolvedValue(encryptedResult)

			const result = await service.encrypt(testData)

			expect(EncryptionModule.encrypt).toHaveBeenCalledWith(testData, dek.dek, undefined)
			expect(result.nonce).toEqual(testNonce)
		})
	})

	describe("decrypt", () => {
		const ciphertext = "encrypted-data"
		const nonce = crypto.randomBytes(12)
		const decryptedData = new Uint8Array(Buffer.from("hello world"))
		const dek: DEK = {
			version: 1,
			dek: "test-dek-key",
			kekVersion: 1,
		}

		it("should decrypt data successfully", async () => {
			mockSharedDEKDatagateway.getDEK.mockResolvedValue({
				version: 1,
				encryptedDek: "encrypted-dek",
				kekVersion: 1,
			})
			mockKMSDecrypt.mockResolvedValue(dek.dek)
			mockDecrypt.mockResolvedValue(decryptedData)

			const result = await service.decrypt(ciphertext, nonce, 1)

			expect(mockSharedDEKDatagateway.getDEK).toHaveBeenCalledWith(1)
			expect(mockKMSDecrypt).toHaveBeenCalledWith("encrypted-dek", "1")
			expect(EncryptionModule.decrypt).toHaveBeenCalledWith(ciphertext, nonce, dek.dek)
			expect(result).toEqual(decryptedData)
		})

		it("should throw error when DEK is not found", async () => {
			mockSharedDEKDatagateway.getDEK.mockResolvedValue(null)

			await expect(service.decrypt(ciphertext, nonce, 1)).rejects.toThrow("Failed to decrypt data, DEK not found")
		})
	})

	describe("rotateDEK", () => {
		const newDek = "new-generated-dek"
		const encryptedDek = "kms-encrypted-dek"
		const cryptoKeyVersion = "1"
		const insertedDek: EncryptedDEK = {
			version: 2,
			encryptedDek,
			kekVersion: 1,
		}

		it("should rotate DEK successfully", async () => {
			mockGenerateEncryptionKey.mockReturnValue(newDek)
			mockKMSEncrypt.mockResolvedValue({
				ciphertext: encryptedDek,
				cryptoKeyVersion,
			})
			mockSharedDEKDatagateway.insertNewDEK.mockResolvedValue(insertedDek)

			const result = await service.rotateDEK()

			expect(EncryptionModule.generateEncryptionKey).toHaveBeenCalledWith("hex")
			expect(mockKMSEncrypt).toHaveBeenCalledWith(newDek, undefined)
			expect(mockSharedDEKDatagateway.insertNewDEK).toHaveBeenCalledWith(encryptedDek, 1)
			expect(result).toBe(2)
		})

		it("should rotate DEK with specific KEK version", async () => {
			const kekVersion = "2"
			mockGenerateEncryptionKey.mockReturnValue(newDek)
			mockKMSEncrypt.mockResolvedValue({
				ciphertext: encryptedDek,
				cryptoKeyVersion,
			})
			mockSharedDEKDatagateway.insertNewDEK.mockResolvedValue(insertedDek)

			const result = await service.rotateDEK(kekVersion)

			expect(mockKMSEncrypt).toHaveBeenCalledWith(newDek, kekVersion)
			expect(result).toBe(2)
		})
	})

	describe("#getDEK (private method testing via caching behavior)", () => {
		const dek: DEK = {
			version: 1,
			dek: "test-dek-key",
			kekVersion: 1,
		}
		const encryptedDek: EncryptedDEK = {
			version: 1,
			encryptedDek: "encrypted-dek",
			kekVersion: 1,
		}

		it("should cache DEK after first retrieval", async () => {
			mockSharedDEKDatagateway.getDEK.mockResolvedValue(encryptedDek)
			mockKMSDecrypt.mockResolvedValue(dek.dek)

			// First call should fetch from database and decrypt
			await service.encrypt(new Uint8Array(Buffer.from("test")), null, 1)
			expect(mockSharedDEKDatagateway.getDEK).toHaveBeenCalledTimes(1)
			expect(mockKMSDecrypt).toHaveBeenCalledTimes(1)

			// Second call should use cache
			await service.encrypt(new Uint8Array(Buffer.from("test")), null, 1)
			expect(mockSharedDEKDatagateway.getDEK).toHaveBeenCalledTimes(1)
			expect(mockKMSDecrypt).toHaveBeenCalledTimes(1)
		})

		it("should not cache when DEK is not found", async () => {
			mockSharedDEKDatagateway.getDEK.mockResolvedValue(null)

			await expect(service.encrypt(new Uint8Array(Buffer.from("test")), null, 1)).rejects.toThrow()

			// Should still try to fetch on next call
			await expect(service.encrypt(new Uint8Array(Buffer.from("test")), null, 1)).rejects.toThrow()
			expect(mockSharedDEKDatagateway.getDEK).toHaveBeenCalledTimes(2)
		})

		it("should use default version when no version specified", async () => {
			config.defaultVersion = 5
			mockSharedDEKDatagateway.getDEK.mockResolvedValue(encryptedDek)
			mockKMSDecrypt.mockResolvedValue(dek.dek)

			await service.encrypt(new Uint8Array(Buffer.from("test")), null)

			expect(mockSharedDEKDatagateway.getDEK).toHaveBeenCalledWith(5)
		})
	})

	describe("error handling", () => {
		it("should propagate errors from KMS client", async () => {
			mockSharedDEKDatagateway.getDEK.mockResolvedValue({
				version: 1,
				encryptedDek: "encrypted-dek",
				kekVersion: 1,
			})
			mockKMSDecrypt.mockRejectedValue(new Error("KMS error"))

			await expect(service.encrypt(new Uint8Array(Buffer.from("test")), null, 1)).rejects.toThrow("KMS error")
		})

		it("should propagate errors from EncryptionModule", async () => {
			mockSharedDEKDatagateway.getDEK.mockResolvedValue({
				version: 1,
				encryptedDek: "encrypted-dek",
				kekVersion: 1,
			})
			mockKMSDecrypt.mockResolvedValue("test-dek-key")
			mockEncrypt.mockRejectedValue(new Error("Encryption error"))

			await expect(service.encrypt(new Uint8Array(Buffer.from("test")), null, 1)).rejects.toThrow("Encryption error")
		})

		it("should propagate errors from SharedDEKDatagateway", async () => {
			mockSharedDEKDatagateway.getDEK.mockRejectedValue(new Error("Database error"))

			await expect(service.encrypt(new Uint8Array(Buffer.from("test")), null, 1)).rejects.toThrow("Database error")
		})
	})

	describe("integration scenarios", () => {
		it("should handle full encrypt/decrypt cycle", async () => {
			const originalData = new Uint8Array(Buffer.from("secret data"))
			const dek: DEK = {
				version: 1,
				dek: "test-dek-key",
				kekVersion: 1,
			}

			// Setup mocks for encrypt
			mockSharedDEKDatagateway.getDEK.mockResolvedValue({
				version: 1,
				encryptedDek: "encrypted-dek",
				kekVersion: 1,
			})
			mockKMSDecrypt.mockResolvedValue(dek.dek)
			mockEncrypt.mockResolvedValue({
				ciphertext: "encrypted-payload",
				nonce: crypto.randomBytes(12),
			})

			// Encrypt
			const encryptResult = await service.encrypt(originalData, null, 1)

			// Setup mocks for decrypt (same DEK should be cached)
			mockDecrypt.mockResolvedValue(originalData)

			// Decrypt
			const decryptResult = await service.decrypt(
				encryptResult.ciphertext,
				encryptResult.nonce,
				encryptResult.dekVersion,
			)

			expect(decryptResult).toEqual(originalData)
			// Should use cached DEK
			expect(mockSharedDEKDatagateway.getDEK).toHaveBeenCalledTimes(1)
			expect(mockKMSDecrypt).toHaveBeenCalledTimes(1)
		})
	})
})
