import crypto from "node:crypto"

import { describe, expect, it, vi, beforeEach } from "vitest"

import { KMSClient } from "./client"

// Mock the KeyManagementServiceClient
const {
	mockEncrypt,
	mockDecrypt,
	mockAsymmetricDecrypt,
	mockGetPublicKey,
	mockCryptoKeyPath,
	mockCryptoKeyVersionPath,
	mockClose,
} = vi.hoisted(() => ({
	mockEncrypt: vi.fn(),
	mockDecrypt: vi.fn(),
	mockAsymmetricDecrypt: vi.fn(),
	mockGetPublicKey: vi.fn(),
	mockCryptoKeyPath: vi.fn(),
	mockCryptoKeyVersionPath: vi.fn(),
	mockClose: vi.fn(),
}))

vi.mock("@google-cloud/kms", () => {
	return {
		KeyManagementServiceClient: class {
			encrypt = mockEncrypt
			decrypt = mockDecrypt
			asymmetricDecrypt = mockAsymmetricDecrypt
			getPublicKey = mockGetPublicKey
			cryptoKeyPath = mockCryptoKeyPath
			cryptoKeyVersionPath = mockCryptoKeyVersionPath
			close = mockClose
		},
	}
})

describe("KMSClient", () => {
	const config = {
		project: "test-project",
		location: "global",
		keyRing: "test-key-ring",
		key: "test-key",
	}

	let kmsClient: KMSClient

	beforeEach(() => {
		vi.clearAllMocks()
		mockCryptoKeyPath.mockReturnValue(
			"projects/test-project/locations/global/keyRings/test-key-ring/cryptoKeys/test-key",
		)
		mockCryptoKeyVersionPath.mockImplementation(
			(p, l, r, k, v) => `projects/${p}/locations/${l}/keyRings/${r}/cryptoKeys/${k}/cryptoKeyVersions/${v}`,
		)
		kmsClient = new KMSClient(config)
	})

	describe("encrypt", () => {
		it("should encrypt plaintext correctly (symmetric) and return ciphertext and key version", async () => {
			const plaintext = "hello world"
			const mockCiphertext = Buffer.from("encrypted-data")
			const mockResponse = {
				ciphertext: mockCiphertext,
				name: "projects/test-project/locations/global/keyRings/test-key-ring/cryptoKeys/test-key/cryptoKeyVersions/1",
			}

			mockEncrypt.mockResolvedValue([mockResponse])

			const result = await kmsClient.encrypt(plaintext)

			expect(mockEncrypt).toHaveBeenCalledWith({
				name: "projects/test-project/locations/global/keyRings/test-key-ring/cryptoKeys/test-key",
				plaintext: Buffer.from(plaintext),
			})
			expect(result.ciphertext).toBe(mockCiphertext.toString("base64"))
			expect(result.cryptoKeyVersion).toBe("1")
		})

		it("should encrypt with specific key version (asymmetric) if provided", async () => {
			const plaintext = "hello world"
			const version = "2"
			// Generate a real key pair for testing
			const { publicKey } = crypto.generateKeyPairSync("rsa", {
				modulusLength: 2048,
			})
			const publicKeyPem = publicKey.export({ type: "spki", format: "pem" })

			const mockPublicKeyResponse = {
				pem: publicKeyPem,
				algorithm: "RSA_DECRYPT_OAEP_2048_SHA256",
			}

			mockGetPublicKey.mockResolvedValue([mockPublicKeyResponse])

			const result = await kmsClient.encrypt(plaintext, version)

			expect(mockGetPublicKey).toHaveBeenCalledWith({
				name: `projects/test-project/locations/global/keyRings/test-key-ring/cryptoKeys/test-key/cryptoKeyVersions/${version}`,
			})

			// Verify result format
			expect(result.cryptoKeyVersion).toBe(version)
			expect(typeof result.ciphertext).toBe("string")
		})
	})

	describe("encryptAsymmetric", () => {
		it("should encrypt plaintext using public key from KMS", async () => {
			const plaintext = "hello world"
			const version = "3"
			const { publicKey } = crypto.generateKeyPairSync("rsa", {
				modulusLength: 2048,
			})
			const publicKeyPem = publicKey.export({ type: "spki", format: "pem" })

			const mockPublicKeyResponse = {
				pem: publicKeyPem,
				algorithm: "RSA_DECRYPT_OAEP_2048_SHA256",
			}

			mockGetPublicKey.mockResolvedValue([mockPublicKeyResponse])

			const result = await kmsClient.encryptAsymmetric(plaintext, version)

			expect(mockGetPublicKey).toHaveBeenCalledWith({
				name: `projects/test-project/locations/global/keyRings/test-key-ring/cryptoKeys/test-key/cryptoKeyVersions/${version}`,
			})
			expect(result.cryptoKeyVersion).toBe(version)
			expect(typeof result.ciphertext).toBe("string")
		})

		it("should use SHA512 hash if algorithm specifies it", async () => {
			const plaintext = "hello world"
			const version = "3"
			const { publicKey } = crypto.generateKeyPairSync("rsa", {
				modulusLength: 4096,
			})
			const publicKeyPem = publicKey.export({ type: "spki", format: "pem" })

			const mockPublicKeyResponse = {
				pem: publicKeyPem,
				algorithm: "RSA_DECRYPT_OAEP_4096_SHA512",
			}

			mockGetPublicKey.mockResolvedValue([mockPublicKeyResponse])

			// Spy on crypto.publicEncrypt to verify options
			const publicEncryptSpy = vi.spyOn(crypto, "publicEncrypt")

			await kmsClient.encryptAsymmetric(plaintext, version)

			expect(publicEncryptSpy).toHaveBeenCalledWith(
				expect.objectContaining({
					oaepHash: "sha512",
				}),
				expect.anything(),
			)
		})

		it("should throw error if public key PEM is missing", async () => {
			mockGetPublicKey.mockResolvedValue([{}]) // Empty response

			await expect(kmsClient.encryptAsymmetric("data", "1")).rejects.toThrow(
				"Failed to encrypt asymmetrically with KMS",
			)
		})
	})

	describe("decrypt", () => {
		it("should decrypt ciphertext correctly", async () => {
			const ciphertext = Buffer.from("encrypted-data").toString("base64")
			const mockPlaintext = Buffer.from("hello world")
			const mockResponse = {
				plaintext: mockPlaintext,
			}

			mockDecrypt.mockResolvedValue([mockResponse])

			const result = await kmsClient.decrypt(ciphertext)

			expect(mockDecrypt).toHaveBeenCalledWith({
				name: "projects/test-project/locations/global/keyRings/test-key-ring/cryptoKeys/test-key",
				ciphertext: Buffer.from(ciphertext, "base64"),
			})
			expect(result).toBe("hello world")
		})
	})

	describe("decryptAsymmetric", () => {
		it("should decrypt asymmetric ciphertext correctly", async () => {
			const ciphertext = Buffer.from("encrypted-data-asym").toString("base64")
			const mockPlaintext = Buffer.from("hello world asymmetric")
			const version = "1"
			const mockResponse = {
				plaintext: mockPlaintext,
			}

			mockAsymmetricDecrypt.mockResolvedValue([mockResponse])

			const result = await kmsClient.decryptAsymmetric(ciphertext, version)

			expect(mockAsymmetricDecrypt).toHaveBeenCalledWith({
				name: `projects/test-project/locations/global/keyRings/test-key-ring/cryptoKeys/test-key/cryptoKeyVersions/${version}`,
				ciphertext: Buffer.from(ciphertext, "base64"),
			})
			expect(result).toBe("hello world asymmetric")
		})
	})
})
