import React, { useState } from 'react';
import { DigitalIdentity, Credential } from '../types/trustchain';
import { 
  ShieldCheck, 
  CheckCircle2, 
  GraduationCap, 
  Award, 
  Briefcase, 
  Code2, 
  ExternalLink, 
  QrCode, 
  Copy, 
  Check,
  Lock,
  Sparkles,
  FileCheck2,
  Calendar
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PublicVerificationViewProps {
  identity: DigitalIdentity;
  credentials: Credential[];
  openQrModal: () => void;
}

export const PublicVerificationView: React.FC<PublicVerificationViewProps> = ({
  identity,
  credentials,
  openQrModal
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [selectedCred, setSelectedCred] = useState<Credential | null>(null);

  const activeCredentials = credentials.filter(c => c.status === 'ACTIVE');

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    confetti({ particleCount: 30, spread: 60, origin: { y: 0.8 } });
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      
      {/* Top Banner Notice */}
      <div className="p-3 bg-gradient-to-r from-cyan-950 via-slate-900 to-cyan-950 border border-cyan-800/80 rounded-xl flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-cyan-300 font-mono">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span>Public Universal Verification Link Active — Cryptographically Audited</span>
        </div>
        <button
          onClick={handleCopyLink}
          className="flex items-center gap-1 text-cyan-400 hover:text-white transition font-semibold"
        >
          {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copiedLink ? 'Copied' : 'Copy Link'}</span>
        </button>
      </div>

      {/* Hero Profile Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6">
          <img 
            src={identity.avatarUrl} 
            alt={identity.fullName}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-cyan-500/50 shadow-xl"
          />

          <div className="space-y-2 flex-1">
            <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{identity.fullName}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Identity Verified
              </span>
            </div>

            <p className="text-xs sm:text-sm text-cyan-300 font-medium">
              {identity.degree} • {identity.universityName}
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-950 border border-cyan-900 rounded-lg text-xs font-mono text-cyan-400">
              <span className="text-slate-500">TC-ID:</span>
              <span className="font-bold">{identity.tcId}</span>
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl text-center min-w-[160px]">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Trust Score</span>
            <div className="text-3xl font-extrabold text-cyan-400 font-mono my-1">{identity.trustScore} / 100</div>
            <span className="text-[10px] text-emerald-400 font-semibold block">High Authenticity</span>
          </div>
        </div>

        {/* Verification Summary Pill Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800 text-center font-mono text-xs">
          <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
            <span className="text-slate-400 block text-[10px]">Degree</span>
            <span className="text-emerald-400 font-bold">✓ VERIFIED</span>
          </div>
          <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
            <span className="text-slate-400 block text-[10px]">Certificates</span>
            <span className="text-emerald-400 font-bold">✓ 8 VERIFIED</span>
          </div>
          <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
            <span className="text-slate-400 block text-[10px]">Internship</span>
            <span className="text-emerald-400 font-bold">✓ VERIFIED</span>
          </div>
          <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
            <span className="text-slate-400 block text-[10px]">GitHub Evidence</span>
            <span className="text-emerald-400 font-bold">✓ CONNECTED</span>
          </div>
        </div>
      </div>

      {/* Verified Achievement Cards List */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-cyan-400" />
          <span>Cryptographically Verified Achievements</span>
        </h2>

        <div className="space-y-3">
          {activeCredentials.map(cred => (
            <div 
              key={cred.id} 
              onClick={() => setSelectedCred(selectedCred?.id === cred.id ? null : cred)}
              className="p-5 bg-slate-900 border border-slate-800 hover:border-cyan-800/80 rounded-xl space-y-3 cursor-pointer transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-xl">
                    {cred.issuerLogo || '🏛️'}
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase">{cred.type}</span>
                    <h3 className="text-sm font-bold text-white">{cred.title}</h3>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>Issued by: <strong className="text-white">{cred.issuerName}</strong></span>
                {cred.gradeOrScore && (
                  <span className="font-mono text-cyan-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    {cred.gradeOrScore}
                  </span>
                )}
              </div>

              {selectedCred?.id === cred.id && (
                <div className="mt-3 pt-3 border-t border-slate-800 space-y-2 font-mono text-xs bg-slate-950 p-4 rounded-lg">
                  <div>
                    <span className="text-slate-400 text-[10px]">Credential Number:</span>
                    <div className="text-cyan-300">{cred.credentialNumber}</div>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px]">Digital Signature (ECDSA P-256):</span>
                    <div className="text-slate-300 break-all text-[11px] bg-slate-900 p-2 rounded border border-slate-800">
                      {cred.digitalSignature}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Share / QR Button */}
      <div className="flex justify-center gap-3 pt-4">
        <button
          onClick={openQrModal}
          className="flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-extrabold rounded-xl text-xs transition shadow-lg shadow-cyan-600/30"
        >
          <QrCode className="w-4 h-4" /> Scan QR to Verify Profile
        </button>
      </div>

    </div>
  );
};
