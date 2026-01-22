import { VError } from "verror"

import { EncryptionModule } from "@/encryption"
import { KMSClient } from "@/kms"
import { SingleFlight } from "@/utils/sync"

export interface EncryptionConfig {
	defaultVersion?: number // if not provided, will use the latest version from database
}

/**
 * Shared-DEK Envelope Encryption service for PII and sensitive Data
 */
export class EnvelopeEncryptionService {
	// NOTE: Always use `#` instead of `private` keyword for serious private properties to avoid by-passing the access control
	readonly #deks = new Map<number, DEK>()

	constructor(
		private readonly kmsClient: KMSClient,
		private readonly sharedDEKDatagateway: SharedDEKDatagateway,
		private readonly config: EncryptionConfig,
	) {}

	/**
	 * Encrypt the data using the DEK
	 */
	async encrypt(
		data: Uint8Array,
		nonce?: Uint8Array | null,
		dekVersion?: number,
	): Promise<{
		dekVersion: number
		nonce: Uint8Array
		ciphertext: string
	}> {
		const dek = await this.#getDEK(dekVersion)
		if (!dek) {
			throw new VError(`Failed to encrypt data, DEK not found`)
		}
		const encrypted = await EncryptionModule.encrypt(data, dek.dek, nonce)
		return {
			dekVersion: dek.version,
			nonce: encrypted.nonce,
			ciphertext: encrypted.ciphertext,
		}
	}

	/**
	 * Decrypt the data using the DEK
	 */
	async decrypt(ciphertext: string, nonce: Uint8Array, dekVersion: number): Promise<Uint8Array> {
		const dek = await this.#getDEK(dekVersion)
		if (!dek) {
			throw new VError(`Failed to decrypt data, DEK not found`)
		}
		return EncryptionModule.decrypt(ciphertext, nonce, dek.dek)
	}

	/**
	 * Rotates the DEK by encrypting a new DEK with the KMS client and inserting it into the database
	 *
	 * @param kekVersion The version of the KMS key to use for encryption. Required for asymmetric encryption.
	 */
	async rotateDEK(kekVersion?: string): Promise<number> {
		const dek = EncryptionModule.generateEncryptionKey("hex")
		const { ciphertext, cryptoKeyVersion } = await this.kmsClient.encrypt(dek, kekVersion)
		const { version } = await this.sharedDEKDatagateway.insertNewDEK(ciphertext, parseInt(cryptoKeyVersion, 10))
		return version
	}

	async #getDEK(version?: number): Promise<DEK | null> {
		return SingleFlight.withLock("ts-utilities:encryption:getdek", async () => {
			const dekVersion = version ?? this.config.defaultVersion
			if (dekVersion) {
				const dek = this.#deks.get(dekVersion)
				if (dek) {
					return dek
				}
			}

			const encryptedDek = await this.sharedDEKDatagateway.getDEK(version ?? this.config.defaultVersion)
			if (!encryptedDek) {
				return null
			}

			const dek = await this.kmsClient.decrypt(encryptedDek.encryptedDek, encryptedDek.kekVersion.toString())
			const decryptedDek = {
				version: encryptedDek.version,
				dek,
				kekVersion: encryptedDek.kekVersion,
			}

			// Caching DEKs
			this.#deks.set(decryptedDek.version, decryptedDek)

			return decryptedDek
		})
	}
}

/**
 * DEK with version and KMS key version (Decrypted DEK)
 */
export type DEK = {
	version: number
	dek: string
	kekVersion: number
	kekType?: "symmetric" | "asymmetric"
}

/**
 * Encrypted DEK with KMS key version
 */
export interface EncryptedDEK {
	version: number
	encryptedDek: string
	kekVersion: number
}

/**
 * Datagateway for Shared DEKs
 */
export interface SharedDEKDatagateway {
	getDEK(version?: number): Promise<EncryptedDEK | null>
	insertNewDEK(encryptedDek: string, kekVersion: number): Promise<EncryptedDEK>
}
