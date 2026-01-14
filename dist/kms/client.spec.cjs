"use strict"; var _class;

var _chunkO6SZ4EAAcjs = require('../chunk-O6SZ4EAA.cjs');






var _chunkXDMBOPPTcjs = require('../chunk-XDMBOPPT.cjs');


var _chunk5JHPDOVLcjs = require('../chunk-5JHPDOVL.cjs');

// src/kms/client.spec.ts
_chunk5JHPDOVLcjs.init_cjs_shims.call(void 0, );
var { mockEncrypt, mockDecrypt, mockAsymmetricDecrypt, mockCryptoKeyPath, mockCryptoKeyVersionPath, mockClose } = _chunkXDMBOPPTcjs.vi.hoisted(() => ({
  mockEncrypt: _chunkXDMBOPPTcjs.vi.fn(),
  mockDecrypt: _chunkXDMBOPPTcjs.vi.fn(),
  mockAsymmetricDecrypt: _chunkXDMBOPPTcjs.vi.fn(),
  mockCryptoKeyPath: _chunkXDMBOPPTcjs.vi.fn(),
  mockCryptoKeyVersionPath: _chunkXDMBOPPTcjs.vi.fn(),
  mockClose: _chunkXDMBOPPTcjs.vi.fn()
}));
_chunkXDMBOPPTcjs.vi.mock("@google-cloud/kms", () => {
  return {
    KeyManagementServiceClient: (_class = class {constructor() { _class.prototype.__init.call(this);_class.prototype.__init2.call(this);_class.prototype.__init3.call(this);_class.prototype.__init4.call(this);_class.prototype.__init5.call(this);_class.prototype.__init6.call(this); }
      __init() {this.encrypt = mockEncrypt}
      __init2() {this.decrypt = mockDecrypt}
      __init3() {this.asymmetricDecrypt = mockAsymmetricDecrypt}
      __init4() {this.cryptoKeyPath = mockCryptoKeyPath}
      __init5() {this.cryptoKeyVersionPath = mockCryptoKeyVersionPath}
      __init6() {this.close = mockClose}
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
    kmsClient = new (0, _chunkO6SZ4EAAcjs.KMSClient)(config);
  });
  _chunkXDMBOPPTcjs.describe.call(void 0, "encrypt", () => {
    _chunkXDMBOPPTcjs.it.call(void 0, "should encrypt plaintext correctly and return ciphertext and key version", async () => {
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
    _chunkXDMBOPPTcjs.it.call(void 0, "should encrypt with specific key version if provided", async () => {
      const plaintext = "hello world";
      const version = "2";
      const mockCiphertext = Buffer.from("encrypted-data-v2");
      const mockResponse = {
        ciphertext: mockCiphertext,
        name: `projects/test-project/locations/global/keyRings/test-key-ring/cryptoKeys/test-key/cryptoKeyVersions/${version}`
      };
      mockEncrypt.mockResolvedValue([mockResponse]);
      const result = await kmsClient.encrypt(plaintext, version);
      _chunkXDMBOPPTcjs.globalExpect.call(void 0, mockEncrypt).toHaveBeenCalledWith({
        name: `projects/test-project/locations/global/keyRings/test-key-ring/cryptoKeys/test-key/cryptoKeyVersions/${version}`,
        plaintext: Buffer.from(plaintext)
      });
      _chunkXDMBOPPTcjs.globalExpect.call(void 0, result.ciphertext).toBe(mockCiphertext.toString("base64"));
      _chunkXDMBOPPTcjs.globalExpect.call(void 0, result.cryptoKeyVersion).toBe(version);
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