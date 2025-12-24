import crypto from "crypto"

import VError from "verror"

/**
 * Encryption usecase implementing AES-GCM encryption/decryption
 */
export class EncryptionModule {
	/**
	 * Encrypts data using AES-GCM algorithm
	 */
	static async aesGcmEncrypt(
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
			// Generate nonce if not provided
			const actualNonce = nonce ?? crypto.randomBytes(12)

			// Validate encryption key length
			const keyBuffer = Buffer.from(encryptionKey, "utf8")
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
	static async aesGcmDecrypt(data: string, nonce: Uint8Array, encryptionKey: string): Promise<Uint8Array> {
		try {
			// Validate encryption key length
			const keyBuffer = Buffer.from(encryptionKey, "utf8")
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
}
