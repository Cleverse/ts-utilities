export interface KMSClientConfig {
	// KMS config
	project: string
	location: string
	keyRing: string
	key: string
}

export interface EncryptionResult {
	/** Base64 encoded ciphertext */
	ciphertext: string
	/** Crypto key version used for encryption */
	cryptoKeyVersion: string
}

export interface KMSClientInterface {
	/**
	 * Encrypts plaintext using Google Cloud KMS.
	 *
	 * The encrypt() method automatically detects key type and uses the appropriate method for encryption
	 * - `CryptoKey`: Symmetric encryption with the primary key version
	 * - `CryptoKeyVersion`: Asymmetric encryption with public key of the specified version
	 *
	 * @param plaintext The text to encrypt
	 * @param cryptoKeyVersion Optional specific key version to use for asymmetric encryption
	 * @returns Promise containing base64 encoded ciphertext and crypto key version
	 */
	encrypt(plaintext: string, cryptoKeyVersion?: string): Promise<EncryptionResult>

	/**
	 * Decrypts ciphertext using Google Cloud KMS
	 * @param ciphertext Base64 encoded ciphertext
	 * @returns Promise containing decrypted plaintext
	 */
	decrypt(ciphertext: string): Promise<string>

	/**
	 * Decrypts ciphertext using Google Cloud KMS with asymmetric key
	 * @param ciphertext Base64 encoded ciphertext
	 * @param cryptoKeyVersion The specific key version used for encryption
	 * @returns Promise containing decrypted plaintext
	 */
	decryptAsymmetric(ciphertext: string, cryptoKeyVersion: string): Promise<string>

	/**
	 * Closes the KMS client connection
	 */
	close(): Promise<void>
}
