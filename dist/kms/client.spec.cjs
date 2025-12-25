"use strict";
var import_vitest = require("vitest");
var import_client = require("./client");
const { mockEncrypt, mockDecrypt, mockAsymmetricDecrypt, mockCryptoKeyPath, mockCryptoKeyVersionPath, mockClose } = import_vitest.vi.hoisted(() => ({
  mockEncrypt: import_vitest.vi.fn(),
  mockDecrypt: import_vitest.vi.fn(),
  mockAsymmetricDecrypt: import_vitest.vi.fn(),
  mockCryptoKeyPath: import_vitest.vi.fn(),
  mockCryptoKeyVersionPath: import_vitest.vi.fn(),
  mockClose: import_vitest.vi.fn()
}));
import_vitest.vi.mock("@google-cloud/kms", () => {
  return {
    KeyManagementServiceClient: class {
      encrypt = mockEncrypt;
      decrypt = mockDecrypt;
      asymmetricDecrypt = mockAsymmetricDecrypt;
      cryptoKeyPath = mockCryptoKeyPath;
      cryptoKeyVersionPath = mockCryptoKeyVersionPath;
      close = mockClose;
    }
  };
});
(0, import_vitest.describe)("KMSClient", () => {
  const config = {
    project: "test-project",
    location: "global",
    keyRing: "test-key-ring",
    key: "test-key"
  };
  let kmsClient;
  (0, import_vitest.beforeEach)(() => {
    import_vitest.vi.clearAllMocks();
    mockCryptoKeyPath.mockReturnValue(
      "projects/test-project/locations/global/keyRings/test-key-ring/cryptoKeys/test-key"
    );
    mockCryptoKeyVersionPath.mockImplementation(
      (p, l, r, k, v) => `projects/${p}/locations/${l}/keyRings/${r}/cryptoKeys/${k}/cryptoKeyVersions/${v}`
    );
    kmsClient = new import_client.KMSClient(config);
  });
  (0, import_vitest.describe)("encrypt", () => {
    (0, import_vitest.it)("should encrypt plaintext correctly and return ciphertext and key version", async () => {
      const plaintext = "hello world";
      const mockCiphertext = Buffer.from("encrypted-data");
      const mockResponse = {
        ciphertext: mockCiphertext,
        name: "projects/test-project/locations/global/keyRings/test-key-ring/cryptoKeys/test-key/cryptoKeyVersions/1"
      };
      mockEncrypt.mockResolvedValue([mockResponse]);
      const result = await kmsClient.encrypt(plaintext);
      (0, import_vitest.expect)(mockEncrypt).toHaveBeenCalledWith({
        name: "projects/test-project/locations/global/keyRings/test-key-ring/cryptoKeys/test-key",
        plaintext: Buffer.from(plaintext)
      });
      (0, import_vitest.expect)(result.ciphertext).toBe(mockCiphertext.toString("base64"));
      (0, import_vitest.expect)(result.cryptoKeyVersion).toBe("1");
    });
    (0, import_vitest.it)("should encrypt with specific key version if provided", async () => {
      const plaintext = "hello world";
      const version = "2";
      const mockCiphertext = Buffer.from("encrypted-data-v2");
      const mockResponse = {
        ciphertext: mockCiphertext,
        name: `projects/test-project/locations/global/keyRings/test-key-ring/cryptoKeys/test-key/cryptoKeyVersions/${version}`
      };
      mockEncrypt.mockResolvedValue([mockResponse]);
      const result = await kmsClient.encrypt(plaintext, version);
      (0, import_vitest.expect)(mockEncrypt).toHaveBeenCalledWith({
        name: `projects/test-project/locations/global/keyRings/test-key-ring/cryptoKeys/test-key/cryptoKeyVersions/${version}`,
        plaintext: Buffer.from(plaintext)
      });
      (0, import_vitest.expect)(result.ciphertext).toBe(mockCiphertext.toString("base64"));
      (0, import_vitest.expect)(result.cryptoKeyVersion).toBe(version);
    });
  });
  (0, import_vitest.describe)("decrypt", () => {
    (0, import_vitest.it)("should decrypt ciphertext correctly", async () => {
      const ciphertext = Buffer.from("encrypted-data").toString("base64");
      const mockPlaintext = Buffer.from("hello world");
      const mockResponse = {
        plaintext: mockPlaintext
      };
      mockDecrypt.mockResolvedValue([mockResponse]);
      const result = await kmsClient.decrypt(ciphertext);
      (0, import_vitest.expect)(mockDecrypt).toHaveBeenCalledWith({
        name: "projects/test-project/locations/global/keyRings/test-key-ring/cryptoKeys/test-key",
        ciphertext: Buffer.from(ciphertext, "base64")
      });
      (0, import_vitest.expect)(result).toBe("hello world");
    });
  });
  (0, import_vitest.describe)("decryptAsymmetric", () => {
    (0, import_vitest.it)("should decrypt asymmetric ciphertext correctly", async () => {
      const ciphertext = Buffer.from("encrypted-data-asym").toString("base64");
      const mockPlaintext = Buffer.from("hello world asymmetric");
      const version = "1";
      const mockResponse = {
        plaintext: mockPlaintext
      };
      mockAsymmetricDecrypt.mockResolvedValue([mockResponse]);
      const result = await kmsClient.decryptAsymmetric(ciphertext, version);
      (0, import_vitest.expect)(mockAsymmetricDecrypt).toHaveBeenCalledWith({
        name: `projects/test-project/locations/global/keyRings/test-key-ring/cryptoKeys/test-key/cryptoKeyVersions/${version}`,
        ciphertext: Buffer.from(ciphertext, "base64")
      });
      (0, import_vitest.expect)(result).toBe("hello world asymmetric");
    });
  });
});
//# sourceMappingURL=client.spec.cjs.map