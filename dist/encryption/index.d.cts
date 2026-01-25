export { DEK, EncryptedDEK, EncryptionConfig, EnvelopeEncryptionService, SharedDEKDatagateway } from './encryption.service.cjs';
import '../kms/client.cjs';
import '../kms/interfaces.cjs';

/**
 * Encryption usecase implementing AES-GCM encryption/decryption
 */
declare class EncryptionModule {
    /**
     * Encrypts data using AES-GCM algorithm
     */
    static encrypt(data: Uint8Array, encryptionKey: string, nonce?: Uint8Array | null): Promise<{
        /** Base64 encoded ciphertext */
        ciphertext: string;
        /** Nonce used for encryption */
        nonce: Uint8Array;
    }>;
    /**
     * Decrypts data using AES-GCM algorithm
     */
    static decrypt(data: string, nonce: Uint8Array, encryptionKey: string): Promise<Uint8Array>;
    /**
     * Generates a random 32-character encryption key suitable for use with aesGcmEncrypt
     */
    static generateEncryptionKey(encoding?: "hex" | "base64" | "ascii" | "utf8"): string;
    private static getKeyBuffer;
}

export { EncryptionModule };
