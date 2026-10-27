"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } var _class;





var _chunkBFR6AXPAcjs = require('../chunk-BFR6AXPA.cjs');


var _chunk3JLTCFKKcjs = require('../chunk-3JLTCFKK.cjs');


var _chunk2X3FSA3Bcjs = require('../chunk-2X3FSA3B.cjs');

// src/kms/client.spec.ts
_chunk2X3FSA3Bcjs.init_cjs_shims.call(void 0, );
var _crypto = require('crypto'); var _crypto2 = _interopRequireDefault(_crypto);
var {
  mockEncrypt,
  mockDecrypt,
  mockAsymmetricDecrypt,
  mockGetPublicKey,
  mockCryptoKeyPath,
  mockCryptoKeyVersionPath,
  mockClose
} = _chunkBFR6AXPAcjs.vi.hoisted(() => ({
  mockEncrypt: _chunkBFR6AXPAcjs.vi.fn(),
  mockDecrypt: _chunkBFR6AXPAcjs.vi.fn(),
  mockAsymmetricDecrypt: _chunkBFR6AXPAcjs.vi.fn(),
  mockGetPublicKey: _chunkBFR6AXPAcjs.vi.fn(),
  mockCryptoKeyPath: _chunkBFR6AXPAcjs.vi.fn(),
  mockCryptoKeyVersionPath: _chunkBFR6AXPAcjs.vi.fn(),
  mockClose: _chunkBFR6AXPAcjs.vi.fn()
}));
_chunkBFR6AXPAcjs.vi.mock("@google-cloud/kms", () => {
  return {
    KeyManagementServiceClient: (_class = class {constructor() { _class.prototype.__init.call(this);_class.prototype.__init2.call(this);_class.prototype.__init3.call(this);_class.prototype.__init4.call(this);_class.prototype.__init5.call(this);_class.prototype.__init6.call(this);_class.prototype.__init7.call(this); }
      __init() {this.encrypt = mockEncrypt}
      __init2() {this.decrypt = mockDecrypt}
      __init3() {this.asymmetricDecrypt = mockAsymmetricDecrypt}
      __init4() {this.getPublicKey = mockGetPublicKey}
      __init5() {this.cryptoKeyPath = mockCryptoKeyPath}
      __init6() {this.cryptoKeyVersionPath = mockCryptoKeyVersionPath}
      __init7() {this.close = mockClose}
    }, _class)
  };
});
_chunkBFR6AXPAcjs.describe.call(void 0, "KMSClient", () => {
  const config = {
    project: "test-project",
    location: "global",
    keyRing: "test-key-ring",
    key: "test-key"
  };
  let kmsClient;
  let asymmetricKmsClient;
  _chunkBFR6AXPAcjs.beforeEach.call(void 0, () => {
    _chunkBFR6AXPAcjs.vi.clearAllMocks();
    mockCryptoKeyPath.mockReturnValue(
      "projects/test-project/locations/global/keyRings/test-key-ring/cryptoKeys/test-key"
    );
    mockCryptoKeyVersionPath.mockImplementation(
      (p, l, r, k, v) => `projects/${p}/locations/${l}/keyRings/${r}/cryptoKeys/${k}/cryptoKeyVersions/${v}`
    );
    kmsClient = new (0, _chunk3JLTCFKKcjs.KMSClient)({ ...config, keyBased: "symmetric" });
    asymmetricKmsClient = new (0, _chunk3JLTCFKKcjs.KMSClient)({ ...config, keyBased: "asymmetric" });
  });
  _chunkBFR6AXPAcjs.describe.call(void 0, "encrypt", () => {
    _chunkBFR6AXPAcjs.it.call(void 0, "should encrypt plaintext correctly (symmetric) and return ciphertext and key version", async () => {
      const plaintext = "hello world";
      const mockCiphertext = Buffer.from("encrypted-data");
      const mockResponse = {
        ciphertext: mockCiphertext,
        name: "projects/test-project/locations/global/keyRings/test-key-ring/cryptoKeys/test-key/cryptoKeyVersions/1"
      };
      mockEncrypt.mockResolvedValue([mockResponse]);
      const result = await kmsClient.encrypt(plaintext);
      _chunkBFR6AXPAcjs.globalExpect.call(void 0, mockEncrypt).toHaveBeenCalledWith({
        name: "projects/test-project/locations/global/keyRings/test-key-ring/cryptoKeys/test-key",
        plaintext: Buffer.from(plaintext)
      });
      _chunkBFR6AXPAcjs.globalExpect.call(void 0, result.ciphertext).toBe(mockCiphertext.toString("base64"));
      _chunkBFR6AXPAcjs.globalExpect.call(void 0, result.cryptoKeyVersion).toBe("1");
    });
    _chunkBFR6AXPAcjs.it.call(void 0, "should encrypt with specific key version (asymmetric) if provided", async () => {
      const plaintext = "hello world";
      const version = "2";
      const { publicKey } = _crypto2.default.generateKeyPairSync("rsa", {
        modulusLength: 2048
      });
      const publicKeyPem = publicKey.export({ type: "spki", format: "pem" });
      const mockPublicKeyResponse = {
        pem: publicKeyPem,
        algorithm: "RSA_DECRYPT_OAEP_2048_SHA256"
      };
      mockGetPublicKey.mockResolvedValue([mockPublicKeyResponse]);
      const result = await asymmetricKmsClient.encrypt(plaintext, version);
      _chunkBFR6AXPAcjs.globalExpect.call(void 0, mockGetPublicKey).toHaveBeenCalledWith({
        name: `projects/test-project/locations/global/keyRings/test-key-ring/cryptoKeys/test-key/cryptoKeyVersions/${version}`
      });
      _chunkBFR6AXPAcjs.globalExpect.call(void 0, result.cryptoKeyVersion).toBe(version);
      _chunkBFR6AXPAcjs.globalExpect.call(void 0, typeof result.ciphertext).toBe("string");
    });
  });
  _chunkBFR6AXPAcjs.describe.call(void 0, "encryptAsymmetric", () => {
    _chunkBFR6AXPAcjs.it.call(void 0, "should encrypt plaintext using public key from KMS", async () => {
      const plaintext = "hello world";
      const version = "3";
      const { publicKey } = _crypto2.default.generateKeyPairSync("rsa", {
        modulusLength: 2048
      });
      const publicKeyPem = publicKey.export({ type: "spki", format: "pem" });
      const mockPublicKeyResponse = {
        pem: publicKeyPem,
        algorithm: "RSA_DECRYPT_OAEP_2048_SHA256"
      };
      mockGetPublicKey.mockResolvedValue([mockPublicKeyResponse]);
      const result = await asymmetricKmsClient.encryptAsymmetric(plaintext, version);
      _chunkBFR6AXPAcjs.globalExpect.call(void 0, mockGetPublicKey).toHaveBeenCalledWith({
        name: `projects/test-project/locations/global/keyRings/test-key-ring/cryptoKeys/test-key/cryptoKeyVersions/${version}`
      });
      _chunkBFR6AXPAcjs.globalExpect.call(void 0, result.cryptoKeyVersion).toBe(version);
      _chunkBFR6AXPAcjs.globalExpect.call(void 0, typeof result.ciphertext).toBe("string");
    });
    _chunkBFR6AXPAcjs.it.call(void 0, "should use SHA512 hash if algorithm specifies it", async () => {
      const plaintext = "hello world";
      const version = "3";
      const { publicKey } = _crypto2.default.generateKeyPairSync("rsa", {
        modulusLength: 4096
      });
      const publicKeyPem = publicKey.export({ type: "spki", format: "pem" });
      const mockPublicKeyResponse = {
        pem: publicKeyPem,
        algorithm: "RSA_DECRYPT_OAEP_4096_SHA512"
      };
      mockGetPublicKey.mockResolvedValue([mockPublicKeyResponse]);
      const publicEncryptSpy = _chunkBFR6AXPAcjs.vi.spyOn(_crypto2.default, "publicEncrypt");
      await asymmetricKmsClient.encryptAsymmetric(plaintext, version);
      _chunkBFR6AXPAcjs.globalExpect.call(void 0, publicEncryptSpy).toHaveBeenCalledWith(
        _chunkBFR6AXPAcjs.globalExpect.objectContaining({
          oaepHash: "sha512"
        }),
        _chunkBFR6AXPAcjs.globalExpect.anything()
      );
    });
    _chunkBFR6AXPAcjs.it.call(void 0, "should throw error if public key PEM is missing", async () => {
      mockGetPublicKey.mockResolvedValue([{}]);
      await _chunkBFR6AXPAcjs.globalExpect.call(void 0, asymmetricKmsClient.encryptAsymmetric("data", "1")).rejects.toThrow(
        "Failed to encrypt asymmetrically with KMS"
      );
    });
  });
  _chunkBFR6AXPAcjs.describe.call(void 0, "decrypt", () => {
    _chunkBFR6AXPAcjs.it.call(void 0, "should decrypt ciphertext correctly", async () => {
      const ciphertext = Buffer.from("encrypted-data").toString("base64");
      const mockPlaintext = Buffer.from("hello world");
      const mockResponse = {
        plaintext: mockPlaintext
      };
      mockDecrypt.mockResolvedValue([mockResponse]);
      const result = await kmsClient.decrypt(ciphertext);
      _chunkBFR6AXPAcjs.globalExpect.call(void 0, mockDecrypt).toHaveBeenCalledWith({
        name: "projects/test-project/locations/global/keyRings/test-key-ring/cryptoKeys/test-key",
        ciphertext: Buffer.from(ciphertext, "base64")
      });
      _chunkBFR6AXPAcjs.globalExpect.call(void 0, result).toBe("hello world");
    });
  });
  _chunkBFR6AXPAcjs.describe.call(void 0, "decryptAsymmetric", () => {
    _chunkBFR6AXPAcjs.it.call(void 0, "should decrypt asymmetric ciphertext correctly", async () => {
      const ciphertext = Buffer.from("encrypted-data-asym").toString("base64");
      const mockPlaintext = Buffer.from("hello world asymmetric");
      const version = "1";
      const mockResponse = {
        plaintext: mockPlaintext
      };
      mockAsymmetricDecrypt.mockResolvedValue([mockResponse]);
      const result = await asymmetricKmsClient.decryptAsymmetric(ciphertext, version);
      _chunkBFR6AXPAcjs.globalExpect.call(void 0, mockAsymmetricDecrypt).toHaveBeenCalledWith({
        name: `projects/test-project/locations/global/keyRings/test-key-ring/cryptoKeys/test-key/cryptoKeyVersions/${version}`,
        ciphertext: Buffer.from(ciphertext, "base64")
      });
      _chunkBFR6AXPAcjs.globalExpect.call(void 0, result).toBe("hello world asymmetric");
    });
  });
});
//# sourceMappingURL=client.spec.cjs.map