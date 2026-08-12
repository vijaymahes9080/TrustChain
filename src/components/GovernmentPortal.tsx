import React, { useState } from 'react';
import { DigitalIdentity, Credential } from '../types/trustchain';
import { 
  Landmark, 
  Search, 
  CheckCircle2, 
  FileText, 
  Code, 
  Copy, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  Zap,
  Users
} from 'lucide-react';

interface GovernmentPortalProps {
  identity: DigitalIdentity;
  credentials: Credential[];
}

export const GovernmentPortal: React.FC<GovernmentPortalProps> = ({
  identity,
  credentials
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'SCHOLARSHIP' | 'API'>('SCHOLARSHIP');
  const [copiedCurl, setCopiedCurl] = useState(false);

  const sampleCurl = `curl -X GET "https://api.trustchain.gov.in/v1/verify/${identity.tcId}" \\
  -H "Authorization: Bearer tc_live_89421a9902" \\
  -H "Accept: application/json"`;

  const sampleApiResponse = {
    status: 200,
    success: true,
    verification: {
      tc_id: identity.tcId,
      student_name: identity.fullName,
      university: identity.universityName,
      trust_score: identity.trustScore,
      qualification: identity.degree,
      scholarship_eligible: true,
      degree_credential: {
        status: "ACTIVE",
        verified_issuer: "Gandhigram Rural Institute",
        digital_signature: "SIG_P256_v1:8f9a12b4e5c6d7a8b9c0d1e2f3a4b5c6.1786523910.INST_GRI_001",
        grade: "9.4 CGPA (First Class Distinction)",
        revoked: false
      },
      verified_at: new Date().toISOString()
    }
  };

  const handleCopyCurl = () => {
    navigator.clipboard.writeText(sampleCurl);
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Government Portal Header */}
      <div className="bg-gradient-to-r from-amber-950/90 via-slate-900 to-slate-950 border border-amber-800/50 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-900/60 border border-amber-600/50 flex items-center justify-center text-2xl shadow-inner">
              🏛️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-white">
                  Government & Public Verification Portal
                </h1>
                <span className="px-2 py-0.5 text-xs font-mono font-bold bg-amber-900 text-amber-300 border border-amber-700 rounded-md">
                  MINISTRY NODE
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Automated scholarship qualification, government internship scheme verification & national recruitment APIs.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-950/80 p-3 rounded-xl border border-amber-900/60 font-mono text-xs">
            <Zap className="w-4 h-4 text-amber-400" />
            <div>
              <span className="text-slate-400">Verification Latency:</span>
              <div className="text-amber-400 font-bold">&lt; 150ms Instant Lookup</div>
            </div>
          </div>
        </div>

        {/* Sub Navigation */}
        <div className="mt-8 pt-6 border-t border-amber-900/40 flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('SCHOLARSHIP')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeSubTab === 'SCHOLARSHIP'
                ? 'bg-amber-600 text-slate-950 shadow-lg shadow-amber-600/30'
                : 'bg-slate-950 text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            <Users className="w-4 h-4" /> Scholarship & Scheme Eligibility Check
          </button>

          <button
            onClick={() => setActiveSubTab('API')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeSubTab === 'API'
                ? 'bg-amber-600 text-slate-950 shadow-lg shadow-amber-600/30'
                : 'bg-slate-950 text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            <Code className="w-4 h-4" /> Public Verification API & cURL Tester
          </button>
        </div>
      </div>

      {activeSubTab === 'SCHOLARSHIP' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              <span>National Post-Graduate MCA Merit Scholarship Verification</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              TrustChain automatically checks degree authenticity and GPA criteria without requiring applicants to submit paper certificates or visit government centers.
            </p>
          </div>

          {/* Sample Applicant Verification Card */}
          <div className="p-5 bg-slate-950 border border-amber-900/60 rounded-xl space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <img 
                  src={identity.avatarUrl} 
                  alt={identity.fullName}
                  className="w-12 h-12 rounded-xl object-cover border border-amber-500/50"
                />
                <div>
                  <h3 className="text-sm font-bold text-white">{identity.fullName}</h3>
                  <p className="text-xs font-mono text-cyan-400">TC-ID: {identity.tcId}</p>
                </div>
              </div>

              <div className="px-3 py-1 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded-lg font-mono text-xs font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> ELIGIBLE & VERIFIED
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Required Qualification:</span>
                <span className="text-white font-semibold">Master of Computer Applications</span>
                <div className="text-emerald-400 font-mono text-[10px] mt-1">✓ Matched (GRI Degree)</div>
              </div>

              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Academic Cutoff (CGPA &gt;= 8.0):</span>
                <span className="text-white font-semibold">9.4 CGPA</span>
                <div className="text-emerald-400 font-mono text-[10px] mt-1">✓ Exceeds Threshold</div>
              </div>

              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Trust Score Cutoff (&gt;= 80):</span>
                <span className="text-white font-semibold">{identity.trustScore} / 100</span>
                <div className="text-emerald-400 font-mono text-[10px] mt-1">✓ Verified Authentic</div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => alert('Scholarship Application #SCH-2026-9941 automatically approved & disburse signal queued.')}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded-xl text-xs transition shadow-md shadow-amber-600/20"
              >
                Approve & Process Scholarship Disbursement
              </button>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'API' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Code className="w-5 h-5 text-amber-400" />
              <span>Public Verification REST API Documentation</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Third-party government systems, university portals, and hiring applications can integrate direct API verifications.
            </p>
          </div>

          {/* cURL Command Box */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-300">
              <span>cURL Request Example:</span>
              <button
                onClick={handleCopyCurl}
                className="flex items-center gap-1 text-amber-400 hover:underline"
              >
                {copiedCurl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCurl ? 'Copied' : 'Copy cURL'}</span>
              </button>
            </div>

            <pre className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-amber-300 font-mono text-xs overflow-x-auto">
              {sampleCurl}
            </pre>
          </div>

          {/* Response Inspector */}
          <div className="space-y-2">
            <span className="text-xs font-mono text-slate-300 block">Live JSON API Response Payload:</span>
            <pre className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-emerald-400 font-mono text-xs overflow-x-auto max-h-80 scrollbar-thin">
              {JSON.stringify(sampleApiResponse, null, 2)}
            </pre>
          </div>
        </div>
      )}

    </div>
  );
};
