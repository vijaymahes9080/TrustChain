import { Credential, DigitalIdentity } from '../types/trustchain';

export interface W3cVerifiableCredential {
  '@context': string[];
  id: string;
  type: string[];
  issuer: {
    id: string;
    name: string;
  };
  issuanceDate: string;
  expirationDate?: string;
  credentialSubject: {
    id: string; // did:trustchain:TC-IN-2026-89421A
    name: string;
    degreeOrQualification: string;
    gradeOrMarks?: string;
    institution: string;
  };
  proof: {
    type: string;
    created: string;
    verificationMethod: string;
    proofPurpose: string;
    jws: string;
  };
}

export class W3cVcEngine {
  /**
   * Converts a TrustChain credential into a W3C Standard Verifiable Credential (VC) JSON-LD format
   */
  static exportW3cVc(credential: Credential, identity: DigitalIdentity): W3cVerifiableCredential {
    const didSubject = `did:trustchain:${identity.tcId}`;
    const didIssuer = `did:trustchain:issuer:${credential.issuerId.toLowerCase()}`;

    return {
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        'https://schema.org',
        'https://trustchain.network/contexts/v2.json'
      ],
      id: `urn:uuid:${credential.id}`,
      type: ['VerifiableCredential', 'VerifiableAchievementCredential', credential.type],
      issuer: {
        id: didIssuer,
        name: credential.issuerName,
      },
      issuanceDate: `${credential.issueDate}T00:00:00Z`,
      expirationDate: credential.expiryDate ? `${credential.expiryDate}T23:59:59Z` : undefined,
      credentialSubject: {
        id: didSubject,
        name: identity.fullName,
        degreeOrQualification: credential.title,
        gradeOrMarks: credential.gradeOrScore,
        institution: credential.issuerName,
      },
      proof: {
        type: 'JsonWebSignature2020',
        created: `${credential.issueDate}T10:00:00Z`,
        verificationMethod: `${didIssuer}#keys-1`,
        proofPurpose: 'assertionMethod',
        jws: credential.digitalSignature
      }
    };
  }
}
