import { Credential, SkillEvidence, ProjectEvidence, DigitalIdentity } from '../types/trustchain';

export interface TrustScoreBreakdown {
  totalScore: number; // 0 - 100
  institutionVerifiedPoints: number; // Max 40
  degreeVerifiedPoints: number; // Max 20
  certificatesVerifiedPoints: number; // Max 15
  projectEvidencePoints: number; // Max 15
  skillAssessmentsPoints: number; // Max 8
  profileConsistencyPoints: number; // Max 2
  recommendations: string[];
}

export class TrustScoreEngine {
  static calculateScore(identity: DigitalIdentity, credentials: Credential[]): TrustScoreBreakdown {
    const activeCredentials = credentials.filter(c => c.status === 'ACTIVE' || c.status === 'VERIFIED');

    // 1. Institution Verification (Max 40)
    const hasUniversityDegree = activeCredentials.some(c => c.type === 'DEGREE' && c.issuerName.length > 0);
    const institutionVerifiedPoints = hasUniversityDegree ? 40 : 10;

    // 2. Degree Verified (Max 20)
    const degreeCount = activeCredentials.filter(c => c.type === 'DEGREE').length;
    const degreeVerifiedPoints = Math.min(20, degreeCount * 20);

    // 3. Certificates Verified (Max 15)
    const certCount = activeCredentials.filter(c => c.type === 'CERTIFICATE' || c.type === 'TRAINING').length;
    const certificatesVerifiedPoints = Math.min(15, certCount * 5);

    // 4. Project Evidence (Max 15)
    const verifiedProjectsCount = identity.projects.filter(p => p.verified).length;
    const projectEvidencePoints = Math.min(15, verifiedProjectsCount * 5);

    // 5. Skill Assessments (Max 8)
    const verifiedSkillsCount = identity.skills.filter(s => s.verified).length;
    const skillAssessmentsPoints = Math.min(8, verifiedSkillsCount * 2);

    // 6. Profile Consistency (Max 2)
    const profileConsistencyPoints = (identity.email && identity.phone && identity.avatarUrl) ? 2 : 1;

    const totalScore = Math.min(
      100,
      institutionVerifiedPoints +
      degreeVerifiedPoints +
      certificatesVerifiedPoints +
      projectEvidencePoints +
      skillAssessmentsPoints +
      profileConsistencyPoints
    );

    const recommendations: string[] = [];
    if (certificatesVerifiedPoints < 15) recommendations.push('Connect additional university/online course certificates to gain +5 points.');
    if (projectEvidencePoints < 15) recommendations.push('Link your GitHub repositories for automated commit evidence to gain +5 points.');
    if (skillAssessmentsPoints < 8) recommendations.push('Complete verified skill assessments to unlock the remaining +4 score.');

    return {
      totalScore,
      institutionVerifiedPoints,
      degreeVerifiedPoints,
      certificatesVerifiedPoints,
      projectEvidencePoints,
      skillAssessmentsPoints,
      profileConsistencyPoints,
      recommendations,
    };
  }
}
