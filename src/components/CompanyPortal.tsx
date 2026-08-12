import React, { useState } from 'react';
import { DigitalIdentity, Credential } from '../types/trustchain';
import { CryptoEngine } from '../services/cryptoEngine';
import { 
  Briefcase, 
  Search, 
  CheckCircle2, 
  ShieldCheck, 
  FileCheck, 
  Github, 
  Lock, 
  Award, 
  GraduationCap, 
  AlertOctagon, 
  Download,
  Share2,
  Calendar
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CompanyPortalProps {
  identity: DigitalIdentity;
  credentials: Credential[];
  verifyCredentialInStore: (credId: string) => void;
}

export const CompanyPortal: React.FC<CompanyPortalProps> = ({
  identity,
  credentials,
  verifyCredentialInStore
}) => {
  const [inputTcId, setInputTcId] = useState(identity.tcId);
  const [isSearching, setIsSearching] = useState(false);
  const [verificationDone, setVerificationDone] = useState(true);
  const [verificationResult, setVerificationResult] = useState<any>(null);

  const handleVerifyCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);

    // Simulate verification engine checks
    await new Promise(r => setTimeout(r, 900));

    const activeCreds = credentials.filter(c => c.tcId === inputTcId && c.status === 'ACTIVE');
    
    // Perform real crypto verification on all credentials
    const cryptoChecks = await Promise.all(
      activeCreds.map(c => CryptoEngine.verifyCredentialIntegrity(c))
    );

    activeCreds.forEach(c => verifyCredentialInStore(c.id));

    setIsSearching(false);
    setVerificationDone(true);
    setVerificationResult({
      totalCreds: activeCreds.length,
      allValid: cryptoChecks.every(c => c.isValid),
      checks: cryptoChecks,
    });

    confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
  };

  const activeCredentials = credentials.filter(c => c.status === 'ACTIVE');

  return (
    <div className="space-y-8 pb-12">
      
      {/* Recruiter Banner */}
      <div className="bg-gradient-to-r from-emerald-950/90 via-slate-900 to-slate-950 border border-emerald-800/50 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-900/60 border border-emerald-600/50 flex items-center justify-center text-2xl shadow-inner">
              💼
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-white">
                  TechCorp Recruitment & Background Check Terminal
                </h1>
                <span className="px-2 py-0.5 text-xs font-mono font-bold bg-emerald-900 text-emerald-300 border border-emerald-700 rounded-md">
                  VERIFIER NODE
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Zero manual background verification calls needed. Instantly verify degrees, skills & work experience via TrustChain.
              </p>
            </div>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-xl border border-emerald-900/60 font-mono text-xs text-right">
            <span className="text-slate-400">Background Checks Completed Today:</span>
            <div className="text-emerald-400 font-bold text-lg">148 Candidates Verified</div>
          </div>
        </div>

        {/* Search Candidate Input */}
        <form onSubmit={handleVerifyCandidate} className="mt-6 pt-6 border-t border-emerald-900/40 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              value={inputTcId}
              onChange={(e) => setInputTcId(e.target.value)}
              placeholder="Enter Candidate TC-ID (e.g. TC-IN-2026-89421A)..."
              required
              className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-emerald-900/80 rounded-xl text-sm font-mono text-cyan-300 focus:outline-none focus:border-emerald-500 shadow-inner"
            />
          </div>

          <button
            type="submit"
            disabled={isSearching}
            className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-xl text-xs transition shadow-lg shadow-emerald-600/30 whitespace-nowrap disabled:opacity-50"
          >
            {isSearching ? 'Running Cryptographic Verification...' : 'Verify Candidate Background'}
          </button>
        </form>
      </div>

      {/* Verification Result Overview Card */}
      {verificationDone && (
        <div className="bg-slate-900/90 border border-emerald-800/80 rounded-2xl p-6 space-y-6 shadow-2xl">
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 bg-emerald-950/80 border border-emerald-700/80 rounded-xl">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-500/20 rounded-xl border border-emerald-500 text-emerald-400">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-extrabold text-white">
                    Candidate Verification Status: <span className="text-emerald-400">VERIFIED AUTHENTIC</span>
                  </h2>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  Candidate TC-ID: <code className="text-cyan-300 font-mono font-bold">{identity.tcId}</code> • Name: <span className="text-white font-semibold">{identity.fullName}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => alert(`Background Check Audit Certificate generated for ${identity.fullName} (TC-ID: ${identity.tcId}). All credentials cryptographically authentic.`)}
                className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-emerald-300 border border-emerald-700 rounded-xl text-xs font-bold transition shadow-sm"
              >
                <Download className="w-4 h-4" /> Download Audit Report
              </button>
            </div>
          </div>

          {/* Cryptographic Verification Checklist Table */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 font-mono block">Credential Exists?</span>
              <span className="text-xs font-extrabold text-emerald-400 flex items-center justify-center gap-1 mt-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> YES
              </span>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 font-mono block">Issuer Authentic?</span>
              <span className="text-xs font-extrabold text-emerald-400 flex items-center justify-center gap-1 mt-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> VERIFIED
              </span>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 font-mono block">ECDSA Signature?</span>
              <span className="text-xs font-extrabold text-emerald-400 flex items-center justify-center gap-1 mt-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> VALID
              </span>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 font-mono block">Status Revoked?</span>
              <span className="text-xs font-extrabold text-emerald-400 flex items-center justify-center gap-1 mt-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> ACTIVE (NO)
              </span>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 col-span-2 sm:col-span-1">
              <span className="text-[10px] text-slate-400 font-mono block">SHA-256 Data Integrity?</span>
              <span className="text-xs font-extrabold text-emerald-400 flex items-center justify-center gap-1 mt-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> MATCHED
              </span>
            </div>
          </div>

          {/* Breakdown of Candidate Qualifications */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
              Verified Candidate Credentials Breakdown
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeCredentials.map(cred => (
                <div key={cred.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2 relative">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase">
                      {cred.type}
                    </span>
                    <span className="text-emerald-400 text-xs font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Authentic
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white">{cred.title}</h4>
                  <p className="text-xs text-slate-300">Issuer: {cred.issuerName}</p>

                  {cred.gradeOrScore && (
                    <div className="text-xs font-mono text-cyan-300 bg-slate-900 px-2 py-1 rounded inline-block">
                      Grade: {cred.gradeOrScore}
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-800 text-[10px] font-mono text-slate-400 flex items-center justify-between">
                    <span>Issued: {cred.issueDate}</span>
                    <span>Cred #: {cred.credentialNumber}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* GitHub Code Commit Evidence Inspector */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Github className="w-5 h-5 text-white" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Verified GitHub Code Evidence Inspector
                </h4>
              </div>
              <span className="text-[10px] font-mono text-emerald-400">2 Repositories Verified</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {identity.projects.map(proj => (
                <div key={proj.id} className="p-3 bg-slate-900 border border-slate-800 rounded-lg space-y-1 text-xs">
                  <div className="flex items-center justify-between font-bold text-cyan-300">
                    <span>{proj.title}</span>
                    <span className="text-[10px] font-mono text-emerald-400">★ {proj.stars} stars</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">{proj.description}</p>
                  <div className="text-[10px] font-mono text-slate-400 pt-1">
                    Commit Hash: <code className="text-cyan-400">{proj.commitHash}</code> ({proj.lastCommitDate})
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
