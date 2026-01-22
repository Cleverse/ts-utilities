import crypto from "node:crypto"

import VError from "verror"

/**
 * Encryption usecase implementing AES-GCM encryption/decryption
 */
export class EncryptionModule {
	/**
	 * Encrypts data using AES-GCM algorithm
	 */
	static async encrypt(
		data: Uint8Array,
		encryptionKey: string,
		nonce?: Uint8Array | null,
	): Promise<{
		/** Base64 encoded ciphertext */
		ciphertext: string
		/** Nonce used for encryption */
		nonce: Uint8Array
	}> {
		try {
			if (nonce && nonce.length !== 12) {
				throw new VError("Nonce must be exactly 12 bytes")
			}

			// Generate nonce if not provided
			const actualNonce = nonce ?? crypto.randomBytes(12)

			// Validate encryption key length
			const keyBuffer = EncryptionModule.getKeyBuffer(encryptionKey)
			if (keyBuffer.length !== 32) {
				throw new VError("Encryption key must be exactly 32 bytes for AES-256")
			}

			// Create cipher
			const cipher = crypto.createCipheriv("aes-256-gcm", keyBuffer, actualNonce)

			// Encrypt the data
			const encrypted = Buffer.concat([cipher.update(data), cipher.final()])
			const authTag = cipher.getAuthTag()

			// Combine encrypted data and auth tag
			const ciphertext = Buffer.concat([encrypted, authTag])

			// Convert to base64
			const base64Ciphertext = ciphertext.toString("base64")

			return {
				ciphertext: base64Ciphertext,
				nonce: new Uint8Array(actualNonce),
			}
		} catch (error) {
			throw new VError(error as Error, `Failed to encrypt data`)
		}
	}

	/**
	 * Decrypts data using AES-GCM algorithm
	 */
	static async decrypt(data: string, nonce: Uint8Array, encryptionKey: string): Promise<Uint8Array> {
		try {
			// Validate encryption key length
			const keyBuffer = EncryptionModule.getKeyBuffer(encryptionKey)
			if (keyBuffer.length !== 32) {
				throw new VError("Encryption key must be exactly 32 bytes for AES-256")
			}

			// Decode base64 data
			const decodedData = Buffer.from(data, "base64")

			// Split ciphertext and auth tag (last 16 bytes)
			const authTag = decodedData.subarray(-16)
			const encrypted = decodedData.subarray(0, -16)

			// Create decipher
			const decipher = crypto.createDecipheriv("aes-256-gcm", keyBuffer, Buffer.from(nonce))
			decipher.setAuthTag(authTag)

			// Decrypt the data
			const plaintext = Buffer.concat([decipher.update(encrypted), decipher.final()])

			return new Uint8Array(plaintext)
		} catch (error) {
			throw new VError(error as Error, `Failed to decrypt data`)
		}
	}

	/**
	 * Generates a random 32-character encryption key suitable for use with aesGcmEncrypt
	 */
	static generateEncryptionKey(encoding: "hex" | "base64" | "ascii" | "utf8" = "hex"): string {
		// return crypto.randomBytes(16).toString("hex")
		switch (encoding) {
			case "utf8":
				// NOTE: UTF8 fails with crypto.randomBytes(32) - non-ASCII bytes (>=128)
				// become variable-length multi-byte sequences, yielding unpredictable
				// length (e.g., 58 chars instead of 32). Use hex(16 bytes) instead.
				return crypto.randomBytes(16).toString("hex")
			default:
				return crypto.randomBytes(32).toString(encoding)
		}
	}

	private static getKeyBuffer(key: string): Buffer {
		// Hex: 64 chars
		if (key.length === 64 && /^[0-9a-fA-F]+$/.test(key)) {
			return Buffer.from(key, "hex")
		}
		// Base64: 44 chars (32 bytes = 42.6 chars -> 44 with padding)
		if (key.length === 44 && /^[a-zA-Z0-9+/=]+$/.test(key)) {
			return Buffer.from(key, "base64")
		}
		// UTF-8 Fallback
		return Buffer.from(key, "utf8")
	}
}
