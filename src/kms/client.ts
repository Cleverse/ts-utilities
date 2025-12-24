import { KeyManagementServiceClient } from "@google-cloud/kms"
import { VError } from "verror"

import type { EncryptionResult, KMSClientConfig, KMSClientInterface } from "./interfaces"

/**
 * Google Cloud KMS client for encryption and decryption operations
 */
export class KMSClient implements KMSClientInterface {
	private readonly client: KeyManagementServiceClient
	private readonly keyName: string

	constructor(private readonly config: KMSClientConfig) {
		this.client = new KeyManagementServiceClient()
		this.keyName = this.client.cryptoKeyPath(
			this.config.project,
			this.config.location,
			this.config.keyRing,
			this.config.key,
		)
	}

	/**
	 * Encrypts plaintext using Google Cloud KMS.
	 *
	 * The encrypt() method automatically detects key type (CryptoKey or CryptoKeyVersion) and uses the appropriate method for encryption
	 * - `CryptoKey`: Symmetric encryption with the primary key version
	 * - `CryptoKeyVersion`: Asymmetric encryption with public key of the specified version
	 */
	async encrypt(plaintext: string, cryptoKeyVersion?: string): Promise<EncryptionResult> {
		try {
			const keyName = cryptoKeyVersion
				? this.client.cryptoKeyVersionPath(
						this.config.project,
						this.config.location,
						this.config.keyRing,
						this.config.key,
						cryptoKeyVersion,
					)
				: this.keyName

			const [encryptResponse] = await this.client.encrypt({
				name: keyName,
				plaintext: Buffer.from(plaintext),
			})

			if (!encryptResponse?.ciphertext || !encryptResponse.name) {
				throw new VError("Not all required fields returned from KMS")
			}

			// Extract crypto key version from the response name
			const nameparts = encryptResponse.name.split("/")
			cryptoKeyVersion = nameparts[nameparts.length - 1]

			if (!cryptoKeyVersion) {
				throw new VError("No crypto key version returned from KMS")
			}

			return {
				ciphertext: Buffer.from(encryptResponse.ciphertext).toString("base64"),
				cryptoKeyVersion,
			}
		} catch (error) {
			throw new VError(error as Error, "Failed to encrypt with KMS")
		}
	}

	/**
	 * Decrypts ciphertext using Google Cloud KMS
	 */
	async decrypt(ciphertext: string): Promise<string> {
		try {
			const ciphertextBuffer = Buffer.from(ciphertext, "base64")
			const [decryptResponse] = await this.client.decrypt({
				name: this.keyName,
				ciphertext: ciphertextBuffer,
			})

			if (!decryptResponse.plaintext) {
				throw new VError("No plaintext returned from KMS")
			}

			return Buffer.from(decryptResponse.plaintext).toString()
		} catch (error) {
			throw new VError(error as Error, "Failed to decrypt with KMS")
		}
	}

	/**
	 * Decrypts ciphertext using Google Cloud KMS with asymmetric key
	 * Note: Asymmetric decryption requires specifying the exact key version used for encryption
	 */
	async decryptAsymmetric(ciphertext: string, cryptoKeyVersion: string): Promise<string> {
		try {
			const ciphertextBuffer = Buffer.from(ciphertext, "base64")

			const keyName = this.client.cryptoKeyVersionPath(
				this.config.project,
				this.config.location,
				this.config.keyRing,
				this.config.key,
				cryptoKeyVersion,
			)

			const [decryptResponse] = await this.client.asymmetricDecrypt({
				name: keyName,
				ciphertext: ciphertextBuffer,
			})

			if (!decryptResponse.plaintext) {
				throw new VError("No plaintext returned from KMS")
			}

			return Buffer.from(decryptResponse.plaintext).toString()
		} catch (error) {
			throw new VError(error as Error, "Failed to decrypt asymmetrically with KMS")
		}
	}

	/**
	 * Closes the KMS client connection
	 */
	async close(): Promise<void> {
		await this.client.close()
	}
}
