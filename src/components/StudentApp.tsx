import React, { useState } from 'react';
import { DigitalIdentity, Credential, PrivacyLevel, CredentialType } from '../types/trustchain';
import { TrustScoreEngine } from '../services/trustScore';
import { 
  CheckCircle2, 
  ShieldAlert, 
  Award, 
  GraduationCap, 
  Briefcase, 
  Code2, 
  Copy, 
  Check, 
  QrCode, 
  ExternalLink, 
  Github, 
  Lock, 
  Eye, 
  Sparkles,
  ChevronDown,
  ChevronUp,
  BrainCircuit,
  FileCheck2,
  Calendar,
  Share2
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface StudentAppProps {
  identity: DigitalIdentity;
  credentials: Credential[];
  updatePrivacy: (newPrivacy: any) => void;
  openQrModal: () => void;
  onSelectCredentialForVerify?: (cred: Credential) => void;
}

export const StudentApp: React.FC<StudentAppProps> = ({
  identity,
  credentials,
  updatePrivacy,
  openQrModal
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedTcId, setCopiedTcId] = useState(false);
  const [activeTab, setActiveTab] = useState<'ALL' | CredentialType>('ALL');
  const [selectedCred, setSelectedCred] = useState<Credential | null>(null);
  const [showScoreDetails, setShowScoreDetails] = useState(false);

  const trustBreakdown = TrustScoreEngine.calculateScore(identity, credentials);

  const handleCopyLink = () => {
    const universalLink = `${window.location.origin}/u/${identity.tcId}`;
    navigator.clipboard.writeText(universalLink);
    setCopiedLink(true);
    confetti({ particleCount: 30, spread: 60, origin: { y: 0.8 } });
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyTcId = () => {
    navigator.clipboard.writeText(identity.tcId);
    setCopiedTcId(true);
    setTimeout(() => setCopiedTcId(false), 2000);
  };

  const filteredCredentials = credentials.filter(c => {
    if (activeTab === 'ALL') return true;
    return c.type === activeTab;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
      case 'VERIFIED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-800/80">
            <CheckCircle2 className="w-3.5 h-3.5" /> Verified Active
          </span>
        );
      case 'REVOKED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-950/80 text-rose-400 border border-rose-800/80">
            <ShieldAlert className="w-3.5 h-3.5" /> Revoked
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-950/80 text-amber-400 border border-amber-800/80">
            Pending Check
          </span>
        );
    }
  };

  const getCredentialIcon = (type: CredentialType) => {
    switch (type) {
      case 'DEGREE': return <GraduationCap className="w-5 h-5 text-cyan-400" />;
      case 'CERTIFICATE': return <Award className="w-5 h-5 text-purple-400" />;
      case 'INTERNSHIP': return <Briefcase className="w-5 h-5 text-emerald-400" />;
      case 'PROJECT': return <Code2 className="w-5 h-5 text-blue-400" />;
      case 'ASSESSMENT': return <BrainCircuit className="w-5 h-5 text-amber-400" />;
      default: return <FileCheck2 className="w-5 h-5 text-teal-400" />;
    }
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Top Banner & Profile Digital Card */}
      <div className="relative rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 p-6 sm:p-8 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          
          {/* User Info */}
          <div className="flex items-center gap-5">
            <div className="relative">
              <img 
                src={identity.avatarUrl} 
                alt={identity.fullName}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-cyan-500/50 shadow-lg shadow-cyan-500/20"
              />
              <div className="absolute -bottom-1 -right-1 bg-cyan-500 text-slate-950 font-black text-[10px] px-1.5 py-0.5 rounded shadow">
                MCA
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {identity.fullName}
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-cyan-950 text-cyan-300 border border-cyan-800">
                  <CheckCircle2 className="w-3 h-3 text-cyan-400" /> Identity Verified
                </span>
              </div>

              <div className="mt-1 flex items-center gap-3 text-slate-300 text-xs sm:text-sm">
                <span>{identity.degree}</span>
                <span>•</span>
                <span className="text-cyan-400 font-medium">{identity.universityName}</span>
              </div>

              {/* TC-ID Pill */}
              <div className="mt-3 flex items-center gap-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-950 border border-cyan-900/80 rounded-lg text-xs font-mono text-cyan-300 shadow-inner">
                  <span className="text-slate-500">TC-ID:</span>
                  <span className="font-bold text-cyan-400">{identity.tcId}</span>
                </div>
                <button
                  onClick={handleCopyTcId}
                  className="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-md transition"
                  title="Copy TC-ID"
                >
                  {copiedTcId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Trust Score Gauge Card */}
          <div className="w-full md:w-auto bg-slate-950/80 border border-cyan-900/60 rounded-xl p-4 sm:p-5 flex flex-col items-center justify-center min-w-[220px] shadow-xl">
            <div className="text-xs uppercase font-bold tracking-widest text-slate-400 mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>Trust Score</span>
            </div>
            
            <div className="flex items-baseline gap-1 my-1">
              <span className="text-4xl font-extrabold text-cyan-400 font-mono tracking-tight">
                {trustBreakdown.totalScore}
              </span>
              <span className="text-slate-500 font-mono font-semibold text-lg">/100</span>
            </div>

            <div className="w-full bg-slate-800 rounded-full h-2 mt-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-400 h-full rounded-full transition-all duration-1000"
                style={{ width: `${trustBreakdown.totalScore}%` }}
              />
            </div>

            <button
              onClick={() => setShowScoreDetails(!showScoreDetails)}
              className="mt-3 flex items-center gap-1 text-[11px] font-medium text-cyan-400 hover:text-cyan-300 transition"
            >
              <span>{showScoreDetails ? 'Hide Breakdown' : 'View Score Factors'}</span>
              {showScoreDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>
        </div>

        {/* Expandable Trust Score Factors */}
        {showScoreDetails && (
          <div className="mt-6 pt-6 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg flex items-center justify-between">
              <span className="text-slate-300">Institution Verification</span>
              <span className="font-mono font-bold text-emerald-400">+{trustBreakdown.institutionVerifiedPoints} pts</span>
            </div>
            <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg flex items-center justify-between">
              <span className="text-slate-300">Degree Verified</span>
              <span className="font-mono font-bold text-emerald-400">+{trustBreakdown.degreeVerifiedPoints} pts</span>
            </div>
            <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg flex items-center justify-between">
              <span className="text-slate-300">Certifications</span>
              <span className="font-mono font-bold text-emerald-400">+{trustBreakdown.certificatesVerifiedPoints} pts</span>
            </div>
            <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg flex items-center justify-between">
              <span className="text-slate-300">Project GitHub Evidence</span>
              <span className="font-mono font-bold text-emerald-400">+{trustBreakdown.projectEvidencePoints} pts</span>
            </div>
            <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg flex items-center justify-between">
              <span className="text-slate-300">Skill Assessments</span>
              <span className="font-mono font-bold text-emerald-400">+{trustBreakdown.skillAssessmentsPoints} pts</span>
            </div>
            <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg flex items-center justify-between">
              <span className="text-slate-300">Profile Consistency</span>
              <span className="font-mono font-bold text-emerald-400">+{trustBreakdown.profileConsistencyPoints} pts</span>
            </div>
          </div>
        )}

        {/* Action Buttons Bar */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded-xl text-xs transition shadow-lg shadow-cyan-600/20"
            >
              {copiedLink ? <Check className="w-4 h-4 text-slate-950" /> : <Share2 className="w-4 h-4" />}
              <span>{copiedLink ? 'Universal Verification Link Copied!' : 'Share Universal Verification Link'}</span>
            </button>

            <button
              onClick={openQrModal}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold rounded-xl text-xs transition border border-slate-700"
            >
              <QrCode className="w-4 h-4 text-cyan-400" />
              <span>Generate QR Code</span>
            </button>
          </div>

          <div className="text-xs text-slate-400 flex items-center gap-1.5 font-mono">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Privacy Controlled • Selective Disclosure Active</span>
          </div>
        </div>
      </div>

      {/* Verified Achievement Wallet Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-cyan-400" />
              <span>Verified Achievement Wallet</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Cryptographically signed credentials issued by verified institutions & organizations.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 scrollbar-none">
            {(['ALL', 'DEGREE', 'CERTIFICATE', 'INTERNSHIP', 'ASSESSMENT'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                  activeTab === tab 
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-700'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Credentials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCredentials.map(cred => (
            <div 
              key={cred.id}
              onClick={() => setSelectedCred(selectedCred?.id === cred.id ? null : cred)}
              className="group bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-cyan-800/80 rounded-xl p-5 transition-all shadow-md cursor-pointer relative overflow-hidden"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-lg">
                    {cred.issuerLogo || getCredentialIcon(cred.type)}
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase font-bold text-cyan-400 tracking-wider">
                      {cred.type}
                    </span>
                    <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition">
                      {cred.title}
                    </h3>
                  </div>
                </div>

                {getStatusBadge(cred.status)}
              </div>

              <p className="mt-3 text-xs text-slate-300 font-medium">
                Issued by: <span className="text-slate-100">{cred.issuerName}</span>
              </p>

              {cred.gradeOrScore && (
                <div className="mt-2 inline-block px-2.5 py-1 bg-slate-950 rounded-md border border-slate-800 text-xs font-mono text-cyan-300">
                  Grade / Score: {cred.gradeOrScore}
                </div>
              )}

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-500" /> {cred.issueDate}
                </span>
                <span>Verified {cred.verificationCount} times</span>
              </div>

              {/* Expanded Details */}
              {selectedCred?.id === cred.id && (
                <div className="mt-4 pt-4 border-t border-cyan-900/60 bg-slate-950/80 -mx-5 -mb-5 p-5 space-y-3 text-xs font-mono">
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Credential No:</span>
                    <p className="text-cyan-300">{cred.credentialNumber}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Digital Signature (ECDSA P-256):</span>
                    <p className="text-slate-300 break-all text-[11px] bg-slate-900 p-2 rounded border border-slate-800">
                      {cred.digitalSignature}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold">SHA-256 Raw Payload Hash:</span>
                    <p className="text-slate-400 break-all text-[11px] bg-slate-900 p-2 rounded border border-slate-800">
                      {cred.rawHash}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* GitHub Skill Evidence Section */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white">
              <Github className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>GitHub Code & Skill Evidence Integration</span>
                <span className="px-2 py-0.5 text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-800 rounded">
                  Connected & Verified
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Automated repo analysis verifying commit history as proof of practical skill claims.
              </p>
            </div>
          </div>

          <a 
            href="https://github.com/vijaymahes9080/TrustChain" 
            target="_blank" 
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition border border-slate-700"
          >
            <span>View GitHub Profile</span>
            <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
          </a>
        </div>

        {/* Skill Evidence Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {identity.skills.map(skill => (
            <div key={skill.id} className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">{skill.skillName}</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>

              <div className="text-[11px] text-slate-400 font-mono flex items-center justify-between">
                <span>{skill.category}</span>
                <span className="text-cyan-400 font-semibold">{skill.commitsCount} commits</span>
              </div>

              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-emerald-400 h-full rounded-full"
                  style={{ width: `${skill.confidenceScore}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Verified Repositories */}
        <div className="pt-3 border-t border-slate-800/80 space-y-2">
          <span className="text-xs font-bold text-slate-300">Verified Project Evidence Repositories:</span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {identity.projects.map(proj => (
              <div key={proj.id} className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg space-y-1">
                <div className="flex items-center justify-between">
                  <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="text-xs font-bold text-cyan-300 hover:underline flex items-center gap-1">
                    {proj.title} <ExternalLink className="w-3 h-3" />
                  </a>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-900">
                    Commit #{proj.commitHash}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2">{proj.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Privacy & Selective Disclosure Control Matrix */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Lock className="w-5 h-5 text-cyan-400" />
            <span>Privacy Architecture & Selective Disclosure Matrix</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            You decide what recruiters and universities can see. Share proof without exposing unnecessary personal data.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {(
            [
              { key: 'gpaVisible', label: 'GPA & Academic Marks' },
              { key: 'phoneVisible', label: 'Phone Number' },
              { key: 'addressVisible', label: 'Residential Address' },
              { key: 'projectsVisible', label: 'Project Repositories' },
              { key: 'experienceVisible', label: 'Internship Records' },
            ] as const
          ).map(item => {
            const currentLevel: PrivacyLevel = identity.privacy[item.key];
            return (
              <div key={item.key} className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-2">
                <span className="text-xs font-semibold text-slate-200">{item.label}</span>
                <select
                  value={currentLevel}
                  onChange={(e) => {
                    updatePrivacy({
                      ...identity.privacy,
                      [item.key]: e.target.value as PrivacyLevel,
                    });
                  }}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-cyan-300 font-medium focus:outline-none focus:border-cyan-500"
                >
                  <option value="PUBLIC">🌐 Public (Everyone)</option>
                  <option value="RECRUITER_ONLY">💼 Recruiter Only</option>
                  <option value="UNIVERSITY_ONLY">🏛️ University Only</option>
                  <option value="PRIVATE">🔒 Fully Private</option>
                </select>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
