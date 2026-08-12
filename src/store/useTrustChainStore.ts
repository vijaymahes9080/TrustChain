import { useState, useEffect } from 'react';
import { DigitalIdentity, Credential, AuditLog, PrivacySettings, SkillEvidence, ProjectEvidence } from '../types/trustchain';
import { CryptoEngine } from '../services/cryptoEngine';
import { TrustScoreEngine } from '../services/trustScore';

export type UserRole = 'STUDENT' | 'UNIVERSITY' | 'COMPANY' | 'GOVERNMENT' | 'PUBLIC_LINK';

const INITIAL_PRIVACY: PrivacySettings = {
  gpaVisible: 'PUBLIC',
  phoneVisible: 'RECRUITER_ONLY',
  addressVisible: 'UNIVERSITY_ONLY',
  projectsVisible: 'PUBLIC',
  experienceVisible: 'PUBLIC',
};

const INITIAL_SKILLS: SkillEvidence[] = [
  { id: 'sk-1', skillName: 'Python 3', category: 'Languages', githubRepo: 'vijaymahes9080/trustchain-ai', commitsCount: 142, verified: true, confidenceScore: 98 },
  { id: 'sk-2', skillName: 'React & TypeScript', category: 'Frameworks', githubRepo: 'vijaymahes9080/trustchain', commitsCount: 96, verified: true, confidenceScore: 95 },
  { id: 'sk-3', skillName: 'PostgreSQL & Redis', category: 'Cloud & DB', githubRepo: 'vijaymahes9080/trust-db-service', commitsCount: 48, verified: true, confidenceScore: 91 },
  { id: 'sk-4', skillName: 'Machine Learning & OCR', category: 'AI & ML', githubRepo: 'vijaymahes9080/credential-ocr', commitsCount: 63, verified: true, confidenceScore: 94 },
];

const INITIAL_PROJECTS: ProjectEvidence[] = [
  {
    id: 'proj-1',
    title: 'TrustChain — Universal Verification Platform',
    description: 'Portable digital identity and cryptographic credential verification network replacing document uploads.',
    githubUrl: 'https://github.com/vijaymahes9080/TrustChain',
    stars: 34,
    languages: ['TypeScript', 'React', 'Node.js', 'Python'],
    lastCommitDate: '2026-08-12',
    commitHash: '7f9a12c4b',
    verified: true,
  },
  {
    id: 'proj-2',
    title: 'AI Document Forgery Detector',
    description: 'Neural network document analyzer for detecting manipulated certificate PDFs using Error Level Analysis.',
    githubUrl: 'https://github.com/vijaymahes9080/doc-forgery-detector',
    stars: 19,
    languages: ['Python', 'OpenCV', 'PyTorch'],
    lastCommitDate: '2026-08-04',
    commitHash: '3a881e9d0',
    verified: true,
  }
];

const INITIAL_CREDENTIALS: Credential[] = [
  {
    id: 'cred-101',
    tcId: 'TC-IN-2026-89421A',
    type: 'DEGREE',
    title: 'Master of Computer Applications (MCA)',
    issuerName: 'Gandhigram Rural Institute (Deemed University)',
    issuerId: 'INST-GRI-001',
    issuerLogo: '🏛️',
    recipientName: 'Vijay Mahes',
    issueDate: '2026-06-15',
    status: 'ACTIVE',
    gradeOrScore: '9.4 / 10.0 CGPA (First Class Distinction)',
    credentialNumber: 'GRI-MCA-2026-0492',
    digitalSignature: 'SIG_P256_v1:8f9a12b4e5c6d7a8b9c0d1e2f3a4b5c6.1786523910.INST_GRI_001',
    rawHash: '8f9a12b4e5c6d7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2',
    verificationCount: 42,
    lastVerifiedDate: '2026-08-11',
  },
  {
    id: 'cred-102',
    tcId: 'TC-IN-2026-89421A',
    type: 'CERTIFICATE',
    title: 'AWS Certified Solutions Architect — Associate',
    issuerName: 'Amazon Web Services (AWS Training)',
    issuerId: 'INST-AWS-900',
    issuerLogo: '☁️',
    recipientName: 'Vijay Mahes',
    issueDate: '2026-03-20',
    expiryDate: '2029-03-20',
    status: 'ACTIVE',
    gradeOrScore: 'Passed (912 / 1000)',
    credentialNumber: 'AWS-CERT-994182',
    digitalSignature: 'SIG_P256_v1:3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d.1774023910.INST_AWS_900',
    rawHash: '3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b',
    verificationCount: 19,
    lastVerifiedDate: '2026-08-09',
  },
  {
    id: 'cred-103',
    tcId: 'TC-IN-2026-89421A',
    type: 'INTERNSHIP',
    title: 'Full Stack Software Engineering Intern',
    issuerName: 'TechCorp Solutions Ltd.',
    issuerId: 'INST-TECHCORP-55',
    issuerLogo: '💼',
    recipientName: 'Vijay Mahes',
    issueDate: '2026-05-30',
    status: 'ACTIVE',
    gradeOrScore: 'Exceeded Expectations (Outstanding)',
    credentialNumber: 'TC-INT-2026-0881',
    digitalSignature: 'SIG_P256_v1:9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b.1780000000.INST_TECHCORP_55',
    rawHash: '9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f',
    verificationCount: 15,
    lastVerifiedDate: '2026-08-10',
  },
  {
    id: 'cred-104',
    tcId: 'TC-IN-2026-89421A',
    type: 'ASSESSMENT',
    title: 'Advanced Machine Learning & Neural Networks',
    issuerName: 'Stanford Online / DeepLearning.AI',
    issuerId: 'INST-STANFORD-10',
    issuerLogo: '🧠',
    recipientName: 'Vijay Mahes',
    issueDate: '2026-01-14',
    status: 'ACTIVE',
    gradeOrScore: '98% High Distinction',
    credentialNumber: 'STF-AI-2026-8812',
    digitalSignature: 'SIG_P256_v1:1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f.1768400000.INST_STANFORD_10',
    rawHash: '1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d',
    verificationCount: 28,
    lastVerifiedDate: '2026-08-01',
  }
];

const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    timestamp: '2026-08-12 06:15:20',
    action: 'CREDENTIAL_VERIFIED',
    actorName: 'Google Recruiting Team',
    actorRole: 'COMPANY',
    targetTcId: 'TC-IN-2026-89421A',
    details: 'Verified MCA Degree & GitHub Project Evidence via Universal Verification Link',
    hash: 'a9b8c7d6e5f4a3b2c1d0'
  },
  {
    id: 'log-2',
    timestamp: '2026-08-11 14:30:10',
    action: 'CREDENTIAL_ISSUED',
    actorName: 'Gandhigram Rural Institute Registrar',
    actorRole: 'UNIVERSITY',
    targetTcId: 'TC-IN-2026-89421A',
    details: 'Issued MCA Degree Credential (GRI-MCA-2026-0492) with P-256 ECDSA Digital Signature',
    hash: 'f1e2d3c4b5a698877665'
  },
  {
    id: 'log-3',
    timestamp: '2026-08-10 09:45:00',
    action: 'OCR_ANALYZED',
    actorName: 'AI Credential Analyzer Engine',
    actorRole: 'UNIVERSITY',
    targetTcId: 'TC-IN-2026-89421A',
    details: 'Completed OCR scan on Stanford AI Certificate — 98% confidence score, 0 tampering detected',
    hash: '1a2b3c4d5e6f7a8b9c0d'
  }
];

export function useTrustChain() {
  const [role, setRole] = useState<UserRole>('STUDENT');
  const [identity, setIdentity] = useState<DigitalIdentity>(() => {
    const saved = localStorage.getItem('trustchain_identity');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      tcId: 'TC-IN-2026-89421A',
      fullName: 'Vijay Mahes',
      email: 'Vijaypradhap2004@gmail.com',
      phone: '+91 98765 43210',
      location: 'Dindigul / Madurai, Tamil Nadu, India',
      universityName: 'Gandhigram Rural Institute (Deemed University)',
      degree: 'Master of Computer Applications (MCA)',
      gradYear: '2026',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
      trustScore: 94,
      skills: INITIAL_SKILLS,
      projects: INITIAL_PROJECTS,
      privacy: INITIAL_PRIVACY,
      createdAt: '2026-01-01',
    };
  });

  const [credentials, setCredentials] = useState<Credential[]>(() => {
    const saved = localStorage.getItem('trustchain_credentials');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_CREDENTIALS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('trustchain_audit');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_AUDIT_LOGS;
  });

  const [searchTcId, setSearchTcId] = useState<string>('TC-IN-2026-89421A');
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);

  // Recalculate trust score whenever credentials or identity change
  useEffect(() => {
    const breakdown = TrustScoreEngine.calculateScore(identity, credentials);
    if (identity.trustScore !== breakdown.totalScore) {
      setIdentity(prev => ({ ...prev, trustScore: breakdown.totalScore }));
    }
  }, [credentials]);

  // Persist to local storage
  useEffect(() => {
    localStorage.setItem('trustchain_identity', JSON.stringify(identity));
  }, [identity]);

  useEffect(() => {
    localStorage.setItem('trustchain_credentials', JSON.stringify(credentials));
  }, [credentials]);

  useEffect(() => {
    localStorage.setItem('trustchain_audit', JSON.stringify(auditLogs));
  }, [auditLogs]);

  const addAuditLog = (action: AuditLog['action'], actorName: string, actorRole: UserRole, details: string) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      action,
      actorName,
      actorRole,
      targetTcId: identity.tcId,
      details,
      hash: Math.random().toString(36).substring(2, 12),
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const issueCredential = async (newCredData: Omit<Credential, 'id' | 'digitalSignature' | 'rawHash' | 'verificationCount' | 'status'>) => {
    const { signature, rawHash } = await CryptoEngine.signCredential({
      tcId: newCredData.tcId,
      title: newCredData.title,
      issuerId: newCredData.issuerId,
      issueDate: newCredData.issueDate,
      credentialNumber: newCredData.credentialNumber,
    });

    const newCredential: Credential = {
      ...newCredData,
      id: `cred-${Date.now()}`,
      status: 'ACTIVE',
      digitalSignature: signature,
      rawHash,
      verificationCount: 1,
      lastVerifiedDate: new Date().toISOString().split('T')[0],
    };

    setCredentials(prev => [newCredential, ...prev]);
    addAuditLog('CREDENTIAL_ISSUED', newCredData.issuerName, 'UNIVERSITY', `Issued digital credential '${newCredData.title}' for TC-ID ${newCredData.tcId}`);
    return newCredential;
  };

  const revokeCredential = (credentialId: string, reason: string) => {
    setCredentials(prev => prev.map(c => {
      if (c.id === credentialId) {
        return { ...c, status: 'REVOKED', revocationReason: reason };
      }
      return c;
    }));
    const target = credentials.find(c => c.id === credentialId);
    addAuditLog('CREDENTIAL_REVOKED', 'Institution Admin', 'UNIVERSITY', `Revoked credential '${target?.title || credentialId}' — Reason: ${reason}`);
  };

  const verifyCredentialInStore = (credentialId: string) => {
    setCredentials(prev => prev.map(c => {
      if (c.id === credentialId) {
        return {
          ...c,
          verificationCount: c.verificationCount + 1,
          lastVerifiedDate: new Date().toISOString().split('T')[0]
        };
      }
      return c;
    }));
    const target = credentials.find(c => c.id === credentialId);
    addAuditLog('CREDENTIAL_VERIFIED', 'Verifier Engine', role, `Verified authentic cryptographic signature for '${target?.title}'`);
  };

  const updatePrivacy = (newPrivacy: PrivacySettings) => {
    setIdentity(prev => ({ ...prev, privacy: newPrivacy }));
    addAuditLog('PRIVACY_UPDATED', identity.fullName, 'STUDENT', 'Updated data sharing consent levels');
  };

  const resetToDefault = () => {
    localStorage.clear();
    window.location.reload();
  };

  return {
    role,
    setRole,
    identity,
    setIdentity,
    credentials,
    auditLogs,
    searchTcId,
    setSearchTcId,
    qrModalOpen,
    setQrModalOpen,
    aiModalOpen,
    setAiModalOpen,
    issueCredential,
    revokeCredential,
    verifyCredentialInStore,
    updatePrivacy,
    addAuditLog,
    resetToDefault,
  };
}
