/**
 * Encryption usecase implementing AES-GCM encryption/decryption
 */
declare class EncryptionModule {
    /**
     * Encrypts data using AES-GCM algorithm
     */
    static aesGcmEncrypt(data: Uint8Array, encryptionKey: string, nonce?: Uint8Array | null): Promise<{
        /** Base64 encoded ciphertext */
        ciphertext: string;
        /** Nonce used for encryption */
        nonce: Uint8Array;
    }>;
    /**
     * Decrypts data using AES-GCM algorithm
     */
    static aesGcmDecrypt(data: string, nonce: Uint8Array, encryptionKey: string): Promise<Uint8Array>;
}

export { EncryptionModule };
