import { KMSClientInterface, KMSClientConfig, EncryptionResult } from './interfaces.cjs';

/**
 * Google Cloud KMS client for encryption and decryption operations
 */
declare class KMSClient implements KMSClientInterface {
    private readonly config;
    private readonly client;
    private readonly keyName;
    constructor(config: KMSClientConfig);
    /**
     * Encrypts plaintext using Google Cloud KMS.
     * Ref: https://docs.cloud.google.com/kms/docs/encrypt-decrypt#kms-encrypt-symmetric-nodejs
     *
     * The encrypt() method automatically detects key type (CryptoKey or CryptoKeyVersion) and uses the appropriate method for encryption
     * - `CryptoKey`: Symmetric encryption with the primary key version
     * - `CryptoKeyVersion`: Asymmetric encryption with public key of the specified version
     */
    encrypt(plaintext: string, cryptoKeyVersion?: string): Promise<EncryptionResult>;
    /**
     * Encrypts plaintext using Google Cloud KMS with asymmetric key (public key).
     * Ref: https://docs.cloud.google.com/kms/docs/encrypt-decrypt-rsa#kms-encrypt-asymmetric-nodejs
     */
    encryptAsymmetric(plaintext: string, cryptoKeyVersion: string): Promise<EncryptionResult>;
    /**
     * Decrypts ciphertext using Google Cloud KMS
     * Ref: https://docs.cloud.google.com/kms/docs/encrypt-decrypt#kms-decrypt-symmetric-nodejs
     */
    decrypt(ciphertext: string): Promise<string>;
    /**
     * Decrypts ciphertext using Google Cloud KMS with asymmetric key
     * Note: Asymmetric decryption requires specifying the exact key version used for encryption
     * Ref: https://docs.cloud.google.com/kms/docs/encrypt-decrypt-rsa#kms-decrypt-asymmetric-nodejs
     */
    decryptAsymmetric(ciphertext: string, cryptoKeyVersion: string): Promise<string>;
    /**
     * Closes the KMS client connection
     */
    close(): Promise<void>;
}

export { KMSClient };
