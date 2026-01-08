import crypto from "node:crypto"

import { describe, expect, it } from "vitest"

import { EncryptionModule } from "./index"

describe("EncryptionModule", () => {
	const validKey = "12345678901234567890123456789012" // 32 bytes
	const data = new Uint8Array(Buffer.from("hello world"))

	describe("aesGcmEncrypt", () => {
		it("should encrypt data correctly and return ciphertext and nonce", async () => {
			const result = await EncryptionModule.aesGcmEncrypt(data, validKey)

			expect(result.ciphertext).toBeDefined()
			expect(typeof result.ciphertext).toBe("string")
			expect(result.nonce).toBeDefined()
			expect(result.nonce).toBeInstanceOf(Uint8Array)
			expect(result.nonce.length).toBe(12)
		})

		it("should use provided nonce if given", async () => {
			const nonce = crypto.randomBytes(12)
			const result = await EncryptionModule.aesGcmEncrypt(data, validKey, nonce)

			expect(result.nonce).toEqual(new Uint8Array(nonce))
		})

		it("should throw error if key length is invalid", async () => {
			await expect(EncryptionModule.aesGcmEncrypt(data, "invalid-length")).rejects.toThrow(
				"Encryption key must be exactly 32 bytes for AES-256",
			)
		})
	})

	describe("aesGcmDecrypt", () => {
		it("should decrypt data correctly", async () => {
			const { ciphertext, nonce } = await EncryptionModule.aesGcmEncrypt(data, validKey)

			const decrypted = await EncryptionModule.aesGcmDecrypt(ciphertext, nonce, validKey)

			expect(decrypted).toEqual(data)
			expect(Buffer.from(decrypted).toString()).toBe("hello world")
		})

		it("should throw error if key length is invalid", async () => {
			const { ciphertext, nonce } = await EncryptionModule.aesGcmEncrypt(data, validKey)

			await expect(EncryptionModule.aesGcmDecrypt(ciphertext, nonce, "invalid-length")).rejects.toThrow(
				"Encryption key must be exactly 32 bytes for AES-256",
			)
		})

		it("should fail to decrypt with wrong key", async () => {
			const { ciphertext, nonce } = await EncryptionModule.aesGcmEncrypt(data, validKey)
			const wrongKey = "12345678901234567890123456789013" // 32 bytes different key

			await expect(EncryptionModule.aesGcmDecrypt(ciphertext, nonce, wrongKey)).rejects.toThrow(
				"Failed to decrypt data",
			)
		})
	})
})
