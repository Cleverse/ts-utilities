import { describe, expect, it, vi, beforeEach } from "vitest"

import { KMSClient } from "./client"

// Mock the KeyManagementServiceClient
const { mockEncrypt, mockDecrypt, mockAsymmetricDecrypt, mockCryptoKeyPath, mockCryptoKeyVersionPath, mockClose } =
	vi.hoisted(() => ({
		mockEncrypt: vi.fn(),
		mockDecrypt: vi.fn(),
		mockAsymmetricDecrypt: vi.fn(),
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
		it("should encrypt plaintext correctly and return ciphertext and key version", async () => {
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

		it("should encrypt with specific key version if provided", async () => {
			const plaintext = "hello world"
			const version = "2"
			const mockCiphertext = Buffer.from("encrypted-data-v2")
			const mockResponse = {
				ciphertext: mockCiphertext,
				name: `projects/test-project/locations/global/keyRings/test-key-ring/cryptoKeys/test-key/cryptoKeyVersions/${version}`,
			}

			mockEncrypt.mockResolvedValue([mockResponse])

			const result = await kmsClient.encrypt(plaintext, version)

			expect(mockEncrypt).toHaveBeenCalledWith({
				name: `projects/test-project/locations/global/keyRings/test-key-ring/cryptoKeys/test-key/cryptoKeyVersions/${version}`,
				plaintext: Buffer.from(plaintext),
			})
			expect(result.ciphertext).toBe(mockCiphertext.toString("base64"))
			expect(result.cryptoKeyVersion).toBe(version)
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
