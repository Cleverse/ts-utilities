import { KMSClient } from '../kms/client.cjs';
import '../kms/interfaces.cjs';

interface EncryptionConfig {
    defaultVersion?: number;
}
/**
 * Shared-DEK Envelope Encryption service for PII and sensitive Data
 */
declare class EnvelopeEncryptionService {
    #private;
    private readonly kmsClient;
    private readonly sharedDEKDatagateway;
    private readonly config;
    constructor(kmsClient: KMSClient, sharedDEKDatagateway: SharedDEKDatagateway, config: EncryptionConfig);
    /**
     * Encrypt the data using the DEK
     */
    encrypt(data: Uint8Array, nonce?: Uint8Array | null, dekVersion?: number): Promise<{
        dekVersion: number;
        nonce: Uint8Array;
        ciphertext: string;
    }>;
    /**
     * Decrypt the data using the DEK
     */
    decrypt(ciphertext: string, nonce: Uint8Array, dekVersion: number): Promise<Uint8Array>;
    /**
     * Rotates the DEK by encrypting a new DEK with the KMS client and inserting it into the database
     *
     * @param kekVersion The version of the KMS key to use for encryption. Required for asymmetric encryption.
     */
    rotateDEK(kekVersion?: string): Promise<number>;
}
/**
 * DEK with version and KMS key version (Decrypted DEK)
 */
type DEK = {
    version: number;
    dek: string;
    kekVersion: number;
    kekType?: "symmetric" | "asymmetric";
};
/**
 * Encrypted DEK with KMS key version
 */
interface EncryptedDEK {
    version: number;
    encryptedDek: string;
    kekVersion: number;
}
/**
 * Datagateway for Shared DEKs
 */
interface SharedDEKDatagateway {
    getDEK(version?: number): Promise<EncryptedDEK | null>;
    insertNewDEK(encryptedDek: string, kekVersion: number): Promise<EncryptedDEK>;
}

export { type DEK, type EncryptedDEK, type EncryptionConfig, EnvelopeEncryptionService, type SharedDEKDatagateway };
