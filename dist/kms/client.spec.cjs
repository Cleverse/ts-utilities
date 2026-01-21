"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } var _class;





var _chunkXDMBOPPTcjs = require('../chunk-XDMBOPPT.cjs');


var _chunkQJRRQUSWcjs = require('../chunk-QJRRQUSW.cjs');


var _chunk5JHPDOVLcjs = require('../chunk-5JHPDOVL.cjs');

// src/kms/client.spec.ts
_chunk5JHPDOVLcjs.init_cjs_shims.call(void 0, );
var _crypto = require('crypto'); var _crypto2 = _interopRequireDefault(_crypto);
var {
  mockEncrypt,
  mockDecrypt,
  mockAsymmetricDecrypt,
  mockGetPublicKey,
  mockCryptoKeyPath,
  mockCryptoKeyVersionPath,
  mockClose
} = _chunkXDMBOPPTcjs.vi.hoisted(() => ({
  mockEncrypt: _chunkXDMBOPPTcjs.vi.fn(),
  mockDecrypt: _chunkXDMBOPPTcjs.vi.fn(),
  mockAsymmetricDecrypt: _chunkXDMBOPPTcjs.vi.fn(),
  mockGetPublicKey: _chunkXDMBOPPTcjs.vi.fn(),
  mockCryptoKeyPath: _chunkXDMBOPPTcjs.vi.fn(),
  mockCryptoKeyVersionPath: _chunkXDMBOPPTcjs.vi.fn(),
  mockClose: _chunkXDMBOPPTcjs.vi.fn()
}));
_chunkXDMBOPPTcjs.vi.mock("@google-cloud/kms", () => {
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
_chunkXDMBOPPTcjs.describe.call(void 0, "KMSClient", () => {
  const config = {
    project: "test-project",
    location: "global",
    keyRing: "test-key-ring",
    key: "test-key"
  };
  let kmsClient;
  _chunkXDMBOPPTcjs.beforeEach.call(void 0, () => {
    _chunkXDMBOPPTcjs.vi.clearAllMocks();
    mockCryptoKeyPath.mockReturnValue(
      "projects/test-project/locations/global/keyRings/test-key-ring/cryptoKeys/test-key"
    );
    mockCryptoKeyVersionPath.mockImplementation(
      (p, l, r, k, v) => `projects/${p}/locations/${l}/keyRings/${r}/cryptoKeys/${k}/cryptoKeyVersions/${v}`
    );
    kmsClient = new (0, _chunkQJRRQUSWcjs.KMSClient)(config);
  });
  _chunkXDMBOPPTcjs.describe.call(void 0, "encrypt", () => {
    _chunkXDMBOPPTcjs.it.call(void 0, "should encrypt plaintext correctly (symmetric) and return ciphertext and key version", async () => {
      const plaintext = "hello world";
      const mockCiphertext = Buffer.from("encrypted-data");
      const mockResponse = {
        ciphertext: mockCiphertext,
        name: "projects/test-project/locations/global/keyRings/test-key-ring/cryptoKeys/test-key/cryptoKeyVersions/1"
      };
      mockEncrypt.mockResolvedValue([mockResponse]);
      const result = await kmsClient.encrypt(plaintext);
      _chunkXDMBOPPTcjs.globalExpect.call(void 0, mockEncrypt).toHaveBeenCalledWith({
        name: "projects/test-project/locations/global/keyRings/test-key-ring/cryptoKeys/test-key",
        plaintext: Buffer.from(plaintext)
      });
      _chunkXDMBOPPTcjs.globalExpect.call(void 0, result.ciphertext).toBe(mockCiphertext.toString("base64"));
      _chunkXDMBOPPTcjs.globalExpect.call(void 0, result.cryptoKeyVersion).toBe("1");
    });
    _chunkXDMBOPPTcjs.it.call(void 0, "should encrypt with specific key version (asymmetric) if provided", async () => {
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
      const result = await kmsClient.encrypt(plaintext, version);
      _chunkXDMBOPPTcjs.globalExpect.call(void 0, mockGetPublicKey).toHaveBeenCalledWith({
        name: `projects/test-project/locations/global/keyRings/test-key-ring/cryptoKeys/test-key/cryptoKeyVersions/${version}`
      });
      _chunkXDMBOPPTcjs.globalExpect.call(void 0, result.cryptoKeyVersion).toBe(version);
      _chunkXDMBOPPTcjs.globalExpect.call(void 0, typeof result.ciphertext).toBe("string");
    });
  });
  _chunkXDMBOPPTcjs.describe.call(void 0, "encryptAsymmetric", () => {
    _chunkXDMBOPPTcjs.it.call(void 0, "should encrypt plaintext using public key from KMS", async () => {
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
      const result = await kmsClient.encryptAsymmetric(plaintext, version);
      _chunkXDMBOPPTcjs.globalExpect.call(void 0, mockGetPublicKey).toHaveBeenCalledWith({
        name: `projects/test-project/locations/global/keyRings/test-key-ring/cryptoKeys/test-key/cryptoKeyVersions/${version}`
      });
      _chunkXDMBOPPTcjs.globalExpect.call(void 0, result.cryptoKeyVersion).toBe(version);
      _chunkXDMBOPPTcjs.globalExpect.call(void 0, typeof result.ciphertext).toBe("string");
    });
    _chunkXDMBOPPTcjs.it.call(void 0, "should use SHA512 hash if algorithm specifies it", async () => {
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
      const publicEncryptSpy = _chunkXDMBOPPTcjs.vi.spyOn(_crypto2.default, "publicEncrypt");
      await kmsClient.encryptAsymmetric(plaintext, version);
      _chunkXDMBOPPTcjs.globalExpect.call(void 0, publicEncryptSpy).toHaveBeenCalledWith(
        _chunkXDMBOPPTcjs.globalExpect.objectContaining({
          oaepHash: "sha512"
        }),
        _chunkXDMBOPPTcjs.globalExpect.anything()
      );
    });
    _chunkXDMBOPPTcjs.it.call(void 0, "should throw error if public key PEM is missing", async () => {
      mockGetPublicKey.mockResolvedValue([{}]);
      await _chunkXDMBOPPTcjs.globalExpect.call(void 0, kmsClient.encryptAsymmetric("data", "1")).rejects.toThrow(
        "Failed to encrypt asymmetrically with KMS"
      );
    });
  });
  _chunkXDMBOPPTcjs.describe.call(void 0, "decrypt", () => {
    _chunkXDMBOPPTcjs.it.call(void 0, "should decrypt ciphertext correctly", async () => {
      const ciphertext = Buffer.from("encrypted-data").toString("base64");
      const mockPlaintext = Buffer.from("hello world");
      const mockResponse = {
        plaintext: mockPlaintext
      };
      mockDecrypt.mockResolvedValue([mockResponse]);
      const result = await kmsClient.decrypt(ciphertext);
      _chunkXDMBOPPTcjs.globalExpect.call(void 0, mockDecrypt).toHaveBeenCalledWith({
        name: "projects/test-project/locations/global/keyRings/test-key-ring/cryptoKeys/test-key",
        ciphertext: Buffer.from(ciphertext, "base64")
      });
      _chunkXDMBOPPTcjs.globalExpect.call(void 0, result).toBe("hello world");
    });
  });
  _chunkXDMBOPPTcjs.describe.call(void 0, "decryptAsymmetric", () => {
    _chunkXDMBOPPTcjs.it.call(void 0, "should decrypt asymmetric ciphertext correctly", async () => {
      const ciphertext = Buffer.from("encrypted-data-asym").toString("base64");
      const mockPlaintext = Buffer.from("hello world asymmetric");
      const version = "1";
      const mockResponse = {
        plaintext: mockPlaintext
      };
      mockAsymmetricDecrypt.mockResolvedValue([mockResponse]);
      const result = await kmsClient.decryptAsymmetric(ciphertext, version);
      _chunkXDMBOPPTcjs.globalExpect.call(void 0, mockAsymmetricDecrypt).toHaveBeenCalledWith({
        name: `projects/test-project/locations/global/keyRings/test-key-ring/cryptoKeys/test-key/cryptoKeyVersions/${version}`,
        ciphertext: Buffer.from(ciphertext, "base64")
      });
      _chunkXDMBOPPTcjs.globalExpect.call(void 0, result).toBe("hello world asymmetric");
    });
  });
});
//# sourceMappingURL=client.spec.cjs.map