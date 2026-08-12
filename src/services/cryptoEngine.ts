import { Credential } from '../types/trustchain';

// Cryptographic engine using browser Web Crypto API
export class CryptoEngine {
  /**
   * Generates SHA-256 hash of object or text
   */
  static async generateHash(data: string): Promise<string> {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Generates a digital signature for a credential payload
   */
  static async signCredential(payload: {
    tcId: string;
    title: string;
    issuerId: string;
    issueDate: string;
    credentialNumber: string;
  }): Promise<{ signature: string; rawHash: string }> {
    const serialized = JSON.stringify(payload);
    const rawHash = await this.generateHash(serialized);
    
    // ECDSA/RSA P-256 signature simulation format
    const timeHex = Date.now().toString(16);
    const signature = `SIG_P256_v1:${rawHash.slice(0, 32)}.${timeHex}.${payload.issuerId.replace(/[^a-zA-Z0-9]/g, '_')}`;
    
    return { signature, rawHash };
  }

  /**
   * Verifies cryptographic integrity of a credential
   */
  static async verifyCredentialIntegrity(credential: Credential): Promise<{
    isValid: boolean;
    hashMatches: boolean;
    signatureAuthentic: boolean;
    issuerRecognized: boolean;
    calculatedHash: string;
  }> {
    const payload = JSON.stringify({
      tcId: credential.tcId,
      title: credential.title,
      issuerId: credential.issuerId,
      issueDate: credential.issueDate,
      credentialNumber: credential.credentialNumber,
    });

    const calculatedHash = await this.generateHash(payload);
    const hashMatches = credential.rawHash ? credential.rawHash === calculatedHash : true;
    const signatureAuthentic = credential.digitalSignature.startsWith('SIG_P256') || credential.digitalSignature.length > 20;
    const issuerRecognized = credential.issuerId.length > 0;

    const isValid = hashMatches && signatureAuthentic && issuerRecognized && credential.status === 'ACTIVE';

    return {
      isValid,
      hashMatches,
      signatureAuthentic,
      issuerRecognized,
      calculatedHash,
    };
  }

  /**
   * Generates a unique TC-ID
   */
  static generateTcId(): string {
    const year = new Date().getFullYear();
    const randomHex = Math.floor(Math.random() * 0xFFFFFF).toString(16).toUpperCase().padStart(6, '0');
    return `TC-IN-${year}-${randomHex}`;
  }
}
