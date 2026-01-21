import crypto from "node:crypto"

import { describe, expect, it } from "vitest"

import { EncryptionModule } from "./index"

describe("EncryptionModule", () => {
	const validKey = "12345678901234567890123456789012" // ascii string 32 bytes
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

	describe("generateEncryptionKey", () => {
		it("should generate a 64-character hex key by default (32 bytes)", () => {
			const key = EncryptionModule.generateEncryptionKey()
			expect(typeof key).toBe("string")
			expect(key.length).toBe(64) // 32 bytes * 2 hex chars
			expect(/^[0-9a-fA-F]+$/.test(key)).toBe(true)
		})

		it("should generate a 64-character hex key when specified", () => {
			const key = EncryptionModule.generateEncryptionKey("hex")
			expect(typeof key).toBe("string")
			expect(key.length).toBe(64)
			expect(/^[0-9a-fA-F]+$/.test(key)).toBe(true)
		})

		it("should generate a 44-character base64 key (32 bytes)", () => {
			const key = EncryptionModule.generateEncryptionKey("base64")
			expect(typeof key).toBe("string")
			expect(key.length).toBe(44) // 32 bytes in base64
			expect(/^[a-zA-Z0-9+/=]+$/.test(key)).toBe(true)
		})

		it("should generate a 32-character ascii key (32 bytes)", () => {
			const key = EncryptionModule.generateEncryptionKey("ascii")
			expect(typeof key).toBe("string")
			expect(key.length).toBe(32)
		})

		it("should generate a 32-character utf8 key (legacy fallback)", () => {
			const key = EncryptionModule.generateEncryptionKey("utf8")
			expect(typeof key).toBe("string")
			expect(key.length).toBe(32) // 16 bytes hex -> 32 chars
		})

		it("should generate different keys on subsequent calls", () => {
			const key1 = EncryptionModule.generateEncryptionKey()
			const key2 = EncryptionModule.generateEncryptionKey()
			expect(key1).not.toBe(key2)
		})

		it.each(["hex", "base64", "ascii", "utf8"] as const)(
			"should generate a key compatible with aesGcmEncrypt (%s)",
			async (encoding) => {
				const key = EncryptionModule.generateEncryptionKey(encoding)
				const data = new Uint8Array(Buffer.from("hello world"))
				const result = await EncryptionModule.aesGcmEncrypt(data, key)
				expect(result.ciphertext).toBeDefined()

				const decrypted = await EncryptionModule.aesGcmDecrypt(result.ciphertext, result.nonce, key)
				expect(decrypted).toEqual(data)
			},
		)
	})

	describe("Key Formats", () => {
		const hexKey = "6fb64e13eb0ad85478f7e792faf6ac8bf46ddd39483e8aed16a82cc5eaaead55" // 64 chars hex
		const base64Key = Buffer.from(hexKey, "hex").toString("base64") // 44 chars base64
		const utf8Key = "12345678901234567890123456789012" // 32 chars utf8

		it("should support hex encoded key (64 chars)", async () => {
			const result = await EncryptionModule.aesGcmEncrypt(data, hexKey)
			expect(result.ciphertext).toBeDefined()
			const decrypted = await EncryptionModule.aesGcmDecrypt(result.ciphertext, result.nonce, hexKey)
			expect(decrypted).toEqual(data)
		})

		it("should support base64 encoded key (44 chars)", async () => {
			const result = await EncryptionModule.aesGcmEncrypt(data, base64Key)
			expect(result.ciphertext).toBeDefined()
			const decrypted = await EncryptionModule.aesGcmDecrypt(result.ciphertext, result.nonce, base64Key)
			expect(decrypted).toEqual(data)
		})

		it("should support utf8 key (32 chars)", async () => {
			const result = await EncryptionModule.aesGcmEncrypt(data, utf8Key)
			expect(result.ciphertext).toBeDefined()
			const decrypted = await EncryptionModule.aesGcmDecrypt(result.ciphertext, result.nonce, utf8Key)
			expect(decrypted).toEqual(data)
		})
	})
})
