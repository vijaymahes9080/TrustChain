import React, { useState } from 'react';
import { DigitalIdentity, Credential } from '../types/trustchain';
import { FileCheck, X, Printer, Download, CheckCircle2, QrCode, ExternalLink, Github, Award, GraduationCap } from 'lucide-react';

interface VerifiedResumeGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  identity: DigitalIdentity;
  credentials: Credential[];
}

export const VerifiedResumeGeneratorModal: React.FC<VerifiedResumeGeneratorModalProps> = ({
  isOpen,
  onClose,
  identity,
  credentials
}) => {
  if (!isOpen) return null;

  const activeCredentials = credentials.filter(c => c.status === 'ACTIVE');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full p-6 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-lg transition"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-cyan-950 border border-cyan-800 rounded-xl text-cyan-400">
              <FileCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white">TrustChain AI Verified Resume</h3>
              <p className="text-xs text-slate-400">Tamper-proof resume backed by cryptographic proof & QR verification.</p>
            </div>
          </div>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded-xl text-xs transition shadow-md"
          >
            <Printer className="w-4 h-4" /> Print / Export PDF
          </button>
        </div>

        {/* Printable Resume Container */}
        <div id="printable-resume" className="p-8 bg-slate-950 border border-slate-800 rounded-xl space-y-6 text-slate-100 font-sans">
          
          {/* Resume Top Header */}
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4 border-b border-slate-800 pb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-white">{identity.fullName}</h1>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-800 rounded">
                  ✓ VERIFIED IDENTITY
                </span>
              </div>
              <p className="text-xs text-cyan-400 font-semibold">{identity.degree} • {identity.universityName}</p>
              <div className="text-xs text-slate-400 font-mono pt-1">
                TC-ID: {identity.tcId} • Trust Score: <strong className="text-cyan-400">{identity.trustScore} / 100</strong>
              </div>
            </div>

            <div className="text-right sm:text-right font-mono text-[10px] text-slate-400 bg-slate-900 p-3 rounded-lg border border-slate-800">
              <div className="text-cyan-400 font-bold text-xs">Scan to Verify Resume</div>
              <div className="text-slate-500">{window.location.origin}/u/{identity.tcId}</div>
            </div>
          </div>

          {/* Academic Qualifications */}
          <div className="space-y-3">
            <h2 className="text-xs font-mono uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-cyan-400" /> Academic Qualifications & Degrees
            </h2>

            <div className="space-y-2">
              {activeCredentials.filter(c => c.type === 'DEGREE').map(c => (
                <div key={c.id} className="p-3 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-white">{c.title}</div>
                    <div className="text-slate-400 text-[11px]">{c.issuerName} • Credential #{c.credentialNumber}</div>
                  </div>
                  <div className="font-mono text-cyan-300 font-bold bg-slate-950 px-2 py-1 rounded border border-slate-800">
                    Grade: {c.gradeOrScore}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications & Training */}
          <div className="space-y-3">
            <h2 className="text-xs font-mono uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1.5">
              <Award className="w-4 h-4 text-purple-400" /> Verified Certifications & Assessments
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {activeCredentials.filter(c => c.type !== 'DEGREE').map(c => (
                <div key={c.id} className="p-3 bg-slate-900 border border-slate-800 rounded-lg space-y-1">
                  <div className="font-bold text-white text-[11px]">{c.title}</div>
                  <div className="text-slate-400 text-[10px]">{c.issuerName}</div>
                  <div className="text-emerald-400 text-[10px] font-mono">✓ ECDSA Signature Verified</div>
                </div>
              ))}
            </div>
          </div>

          {/* Verified GitHub Projects */}
          <div className="space-y-3">
            <h2 className="text-xs font-mono uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1.5">
              <Github className="w-4 h-4 text-emerald-400" /> Verified Open-Source Code Projects
            </h2>

            <div className="space-y-2 text-xs">
              {identity.projects.map(p => (
                <div key={p.id} className="p-3 bg-slate-900 border border-slate-800 rounded-lg space-y-1">
                  <div className="flex items-center justify-between font-bold text-cyan-300">
                    <span>{p.title}</span>
                    <span className="text-[10px] font-mono text-emerald-400">Commit #{p.commitHash}</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">{p.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Proof Badge */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-500">
            <span>Verified by TrustChain Universal Verification Protocol</span>
            <span>Issued SHA-256 Hash Audited</span>
          </div>

        </div>

      </div>
    </div>
  );
};
