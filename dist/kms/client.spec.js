import {
  KMSClient
} from "../chunk-YUJAA2L3.js";
import {
  beforeEach,
  describe,
  globalExpect,
  it,
  vi
} from "../chunk-AZYASILH.js";
import "../chunk-G3PMV62Z.js";

// src/kms/client.spec.ts
import crypto from "crypto";
var {
  mockEncrypt,
  mockDecrypt,
  mockAsymmetricDecrypt,
  mockGetPublicKey,
  mockCryptoKeyPath,
  mockCryptoKeyVersionPath,
  mockClose
} = vi.hoisted(() => ({
  mockEncrypt: vi.fn(),
  mockDecrypt: vi.fn(),
  mockAsymmetricDecrypt: vi.fn(),
  mockGetPublicKey: vi.fn(),
  mockCryptoKeyPath: vi.fn(),
  mockCryptoKeyVersionPath: vi.fn(),
  mockClose: vi.fn()
}));
vi.mock("@google-cloud/kms", () => {
  return {
    KeyManagementServiceClient: class {
      encrypt = mockEncrypt;
      decrypt = mockDecrypt;
      asymmetricDecrypt = mockAsymmetricDecrypt;
      getPublicKey = mockGetPublicKey;
      cryptoKeyPath = mockCryptoKeyPath;
      cryptoKeyVersionPath = mockCryptoKeyVersionPath;
      close = mockClose;
    }
  };
});
describe("KMSClient", () => {
  const config = {
    project: "test-project",
    location: "global",
    keyRing: "test-key-ring",
    key: "test-key"
  };
  let kmsClient;
  let asymmetricKmsClient;
  beforeEach(() => {
    vi.clearAllMocks();
    mockCryptoKeyPath.mockReturnValue(
      "projects/test-project/locations/global/keyRings/test-key-ring/cryptoKeys/test-key"
    );
    mockCryptoKeyVersionPath.mockImplementation(
      (p, l, r, k, v) => `projects/${p}/locations/${l}/keyRings/${r}/cryptoKeys/${k}/cryptoKeyVersions/${v}`
    );
    kmsClient = new KMSClient({ ...config, keyBased: "symmetric" });
    asymmetricKmsClient = new KMSClient({ ...config, keyBased: "asymmetric" });
  });
  describe("encrypt", () => {
    it("should encrypt plaintext correctly (symmetric) and return ciphertext and key version", async () => {
      const plaintext = "hello world";
      const mockCiphertext = Buffer.from("encrypted-data");
      const mockResponse = {
        ciphertext: mockCiphertext,
        name: "projects/test-project/locations/global/keyRings/test-key-ring/cryptoKeys/test-key/cryptoKeyVersions/1"
      };
      mockEncrypt.mockResolvedValue([mockResponse]);
      const result = await kmsClient.encrypt(plaintext);
      globalExpect(mockEncrypt).toHaveBeenCalledWith({
        name: "projects/test-project/locations/global/keyRings/test-key-ring/cryptoKeys/test-key",
        plaintext: Buffer.from(plaintext)
      });
      globalExpect(result.ciphertext).toBe(mockCiphertext.toString("base64"));
      globalExpect(result.cryptoKeyVersion).toBe("1");
    });
    it("should encrypt with specific key version (asymmetric) if provided", async () => {
      const plaintext = "hello world";
      const version = "2";
      const { publicKey } = crypto.generateKeyPairSync("rsa", {
        modulusLength: 2048
      });
      const publicKeyPem = publicKey.export({ type: "spki", format: "pem" });
      const mockPublicKeyResponse = {
        pem: publicKeyPem,
        algorithm: "RSA_DECRYPT_OAEP_2048_SHA256"
      };
      mockGetPublicKey.mockResolvedValue([mockPublicKeyResponse]);
      const result = await asymmetricKmsClient.encrypt(plaintext, version);
      globalExpect(mockGetPublicKey).toHaveBeenCalledWith({
        name: `projects/test-project/locations/global/keyRings/test-key-ring/cryptoKeys/test-key/cryptoKeyVersions/${version}`
      });
      globalExpect(result.cryptoKeyVersion).toBe(version);
      globalExpect(typeof result.ciphertext).toBe("string");
    });
  });
  describe("encryptAsymmetric", () => {
    it("should encrypt plaintext using public key from KMS", async () => {
      const plaintext = "hello world";
      const version = "3";
      const { publicKey } = crypto.generateKeyPairSync("rsa", {
        modulusLength: 2048
      });
      const publicKeyPem = publicKey.export({ type: "spki", format: "pem" });
      const mockPublicKeyResponse = {
        pem: publicKeyPem,
        algorithm: "RSA_DECRYPT_OAEP_2048_SHA256"
      };
      mockGetPublicKey.mockResolvedValue([mockPublicKeyResponse]);
      const result = await asymmetricKmsClient.encryptAsymmetric(plaintext, version);
      globalExpect(mockGetPublicKey).toHaveBeenCalledWith({
        name: `projects/test-project/locations/global/keyRings/test-key-ring/cryptoKeys/test-key/cryptoKeyVersions/${version}`
      });
      globalExpect(result.cryptoKeyVersion).toBe(version);
      globalExpect(typeof result.ciphertext).toBe("string");
    });
    it("should use SHA512 hash if algorithm specifies it", async () => {
      const plaintext = "hello world";
      const version = "3";
      const { publicKey } = crypto.generateKeyPairSync("rsa", {
        modulusLength: 4096
      });
      const publicKeyPem = publicKey.export({ type: "spki", format: "pem" });
      const mockPublicKeyResponse = {
        pem: publicKeyPem,
        algorithm: "RSA_DECRYPT_OAEP_4096_SHA512"
      };
      mockGetPublicKey.mockResolvedValue([mockPublicKeyResponse]);
      const publicEncryptSpy = vi.spyOn(crypto, "publicEncrypt");
      await asymmetricKmsClient.encryptAsymmetric(plaintext, version);
      globalExpect(publicEncryptSpy).toHaveBeenCalledWith(
        globalExpect.objectContaining({
          oaepHash: "sha512"
        }),
        globalExpect.anything()
      );
    });
    it("should throw error if public key PEM is missing", async () => {
      mockGetPublicKey.mockResolvedValue([{}]);
      await globalExpect(asymmetricKmsClient.encryptAsymmetric("data", "1")).rejects.toThrow(
        "Failed to encrypt asymmetrically with KMS"
      );
    });
  });
  describe("decrypt", () => {
    it("should decrypt ciphertext correctly", async () => {
      const ciphertext = Buffer.from("encrypted-data").toString("base64");
      const mockPlaintext = Buffer.from("hello world");
      const mockResponse = {
        plaintext: mockPlaintext
      };
      mockDecrypt.mockResolvedValue([mockResponse]);
      const result = await kmsClient.decrypt(ciphertext);
      globalExpect(mockDecrypt).toHaveBeenCalledWith({
        name: "projects/test-project/locations/global/keyRings/test-key-ring/cryptoKeys/test-key",
        ciphertext: Buffer.from(ciphertext, "base64")
      });
      globalExpect(result).toBe("hello world");
    });
  });
  describe("decryptAsymmetric", () => {
    it("should decrypt asymmetric ciphertext correctly", async () => {
      const ciphertext = Buffer.from("encrypted-data-asym").toString("base64");
      const mockPlaintext = Buffer.from("hello world asymmetric");
      const version = "1";
      const mockResponse = {
        plaintext: mockPlaintext
      };
      mockAsymmetricDecrypt.mockResolvedValue([mockResponse]);
      const result = await asymmetricKmsClient.decryptAsymmetric(ciphertext, version);
      globalExpect(mockAsymmetricDecrypt).toHaveBeenCalledWith({
        name: `projects/test-project/locations/global/keyRings/test-key-ring/cryptoKeys/test-key/cryptoKeyVersions/${version}`,
        ciphertext: Buffer.from(ciphertext, "base64")
      });
      globalExpect(result).toBe("hello world asymmetric");
    });
  });
});
//# sourceMappingURL=client.spec.js.map