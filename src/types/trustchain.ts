export type CredentialType = 'DEGREE' | 'CERTIFICATE' | 'INTERNSHIP' | 'PROJECT' | 'ASSESSMENT' | 'AWARD' | 'TRAINING';

export type CredentialStatus = 'ISSUED' | 'ACTIVE' | 'VERIFIED' | 'REVOKED' | 'EXPIRED';

export type PrivacyLevel = 'PUBLIC' | 'RECRUITER_ONLY' | 'UNIVERSITY_ONLY' | 'PRIVATE';

export interface PrivacySettings {
  gpaVisible: PrivacyLevel;
  phoneVisible: PrivacyLevel;
  addressVisible: PrivacyLevel;
  projectsVisible: PrivacyLevel;
  experienceVisible: PrivacyLevel;
}

export interface SkillEvidence {
  id: string;
  skillName: string;
  category: 'Languages' | 'Frameworks' | 'Cloud & DB' | 'AI & ML';
  githubRepo?: string;
  commitsCount?: number;
  verified: boolean;
  confidenceScore: number;
}

export interface ProjectEvidence {
  id: string;
  title: string;
  description: string;
  githubUrl: string;
  stars: number;
  languages: string[];
  lastCommitDate: string;
  commitHash: string;
  verified: boolean;
}

export interface Credential {
  id: string;
  tcId: string; // Target student TC-ID
  type: CredentialType;
  title: string;
  issuerName: string;
  issuerId: string;
  issuerLogo?: string;
  recipientName: string;
  issueDate: string;
  expiryDate?: string;
  status: CredentialStatus;
  gradeOrScore?: string;
  credentialNumber: string;
  digitalSignature: string;
  rawHash: string;
  revocationReason?: string;
  verificationCount: number;
  lastVerifiedDate?: string;
  documentUrl?: string;
}

export interface DigitalIdentity {
  tcId: string; // TC-IN-2026-89421A
  fullName: string;
  email: string;
  phone: string;
  location: string;
  universityName: string;
  degree: string;
  gradYear: string;
  avatarUrl: string;
  trustScore: number;
  skills: SkillEvidence[];
  projects: ProjectEvidence[];
  privacy: PrivacySettings;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: 'CREDENTIAL_ISSUED' | 'CREDENTIAL_VERIFIED' | 'CREDENTIAL_REVOKED' | 'PRIVACY_UPDATED' | 'OCR_ANALYZED';
  actorName: string;
  actorRole: 'STUDENT' | 'UNIVERSITY' | 'COMPANY' | 'GOVERNMENT' | 'PUBLIC' | 'PUBLIC_LINK';
  targetTcId: string;
  details: string;
  hash: string;
}

export interface AIAnalysisResult {
  confidenceScore: number; // 0-100
  extractedFields: {
    studentName: string;
    institution: string;
    courseOrDegree: string;
    gradeOrMarks: string;
    issueDate: string;
    credentialNo: string;
  };
  isTampered: boolean;
  anomalyScore: number; // 0 (clean) to 100 (suspicious)
  tamperingFlags: string[];
  recommendation: 'APPROVE' | 'FLAG_FOR_HUMAN_REVIEW' | 'REJECT';
}
