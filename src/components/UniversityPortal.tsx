import React, { useState } from 'react';
import { Credential, CredentialType, AuditLog } from '../types/trustchain';
import { 
  Building2, 
  PlusCircle, 
  FileCheck2, 
  Sparkles, 
  ShieldAlert, 
  CheckCircle2, 
  Lock, 
  Search, 
  History,
  AlertTriangle,
  Send,
  UploadCloud
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface UniversityPortalProps {
  credentials: Credential[];
  auditLogs: AuditLog[];
  issueCredential: (credData: any) => Promise<any>;
  revokeCredential: (credId: string, reason: string) => void;
  openAiModal: () => void;
}

export const UniversityPortal: React.FC<UniversityPortalProps> = ({
  credentials,
  auditLogs,
  issueCredential,
  revokeCredential,
  openAiModal
}) => {
  const [activeTab, setActiveTab] = useState<'ISSUE' | 'MANAGE' | 'AUDIT'>('ISSUE');
  
  // Issue Credential Form State
  const [targetTcId, setTargetTcId] = useState('TC-IN-2026-89421A');
  const [recipientName, setRecipientName] = useState('Vijay Mahes');
  const [credType, setCredType] = useState<CredentialType>('DEGREE');
  const [title, setTitle] = useState('Master of Computer Applications (MCA)');
  const [gradeOrScore, setGradeOrScore] = useState('9.4 / 10.0 CGPA');
  const [credentialNumber, setCredentialNumber] = useState('GRI-MCA-2026-0899');
  const [isIssuing, setIsIssuing] = useState(false);
  const [issuedSuccess, setIssuedSuccess] = useState<string | null>(null);

  // Revoke state
  const [revokeCredId, setRevokeCredId] = useState<string | null>(null);
  const [revokeReason, setRevokeReason] = useState('');

  const handleIssueSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsIssuing(true);
    setIssuedSuccess(null);

    const newCred = await issueCredential({
      tcId: targetTcId,
      recipientName,
      type: credType,
      title,
      issuerName: 'Gandhigram Rural Institute (Deemed University)',
      issuerId: 'INST-GRI-001',
      issuerLogo: '🏛️',
      issueDate: new Date().toISOString().split('T')[0],
      gradeOrScore,
      credentialNumber,
    });

    setIsIssuing(false);
    setIssuedSuccess(newCred.digitalSignature);
    confetti({ particleCount: 50, spread: 70, origin: { y: 0.7 } });
  };

  const handleRevokeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!revokeCredId || !revokeReason) return;
    revokeCredential(revokeCredId, revokeReason);
    setRevokeCredId(null);
    setRevokeReason('');
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Institution Header Card */}
      <div className="bg-gradient-to-r from-purple-950/80 via-slate-900 to-slate-950 border border-purple-800/50 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-purple-900/60 border border-purple-600/50 flex items-center justify-center text-3xl shadow-inner">
              🏛️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-white">
                  Gandhigram Rural Institute
                </h1>
                <span className="px-2 py-0.5 text-xs font-mono font-bold bg-purple-900 text-purple-300 border border-purple-700 rounded-md">
                  VERIFIED ISSUER
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Deemed University • Registrar Credential Signing Portal (Issuer ID: <code className="text-cyan-400">INST-GRI-001</code>)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-950/80 p-3 rounded-xl border border-purple-900/60 font-mono text-xs">
            <Lock className="w-4 h-4 text-emerald-400" />
            <div>
              <span className="text-slate-400">ECDSA P-256 Key Status:</span>
              <div className="text-emerald-400 font-bold">HSM Hardware Signed Active</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mt-8 pt-6 border-t border-purple-900/40 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('ISSUE')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'ISSUE'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'bg-slate-950 text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            <PlusCircle className="w-4 h-4" /> Issue Cryptographic Credential
          </button>

          <button
            onClick={openAiModal}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-900 to-purple-900 hover:from-indigo-800 hover:to-purple-800 text-purple-200 border border-purple-700 rounded-xl text-xs font-bold transition shadow-md"
          >
            <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" /> AI OCR Upload & Forgery Check
          </button>

          <button
            onClick={() => setActiveTab('MANAGE')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'MANAGE'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'bg-slate-950 text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            <FileCheck2 className="w-4 h-4" /> Manage Issued Credentials ({credentials.length})
          </button>

          <button
            onClick={() => setActiveTab('AUDIT')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'AUDIT'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'bg-slate-950 text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            <History className="w-4 h-4" /> Institution Audit Ledger
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'ISSUE' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Issue Form */}
          <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-purple-400" />
                <span>Issue Cryptographically Verifiable Credential</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                The university signs the payload using its ECDSA P-256 private key and appends the raw hash to the TrustChain Registry.
              </p>
            </div>

            <form onSubmit={handleIssueSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Target Student TC-ID</label>
                  <input
                    type="text"
                    value={targetTcId}
                    onChange={(e) => setTargetTcId(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-cyan-300 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Student Full Name</label>
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Credential Category</label>
                  <select
                    value={credType}
                    onChange={(e) => setCredType(e.target.value as CredentialType)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="DEGREE">Degree Qualification</option>
                    <option value="CERTIFICATE">Academic Certificate</option>
                    <option value="INTERNSHIP">Internship Completion</option>
                    <option value="AWARD">Academic Excellence Award</option>
                    <option value="TRAINING">Specialized Workshop Training</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Qualification / Degree Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Grade / CGPA / Score</label>
                  <input
                    type="text"
                    value={gradeOrScore}
                    onChange={(e) => setGradeOrScore(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Institutional Credential Serial #</label>
                  <input
                    type="text"
                    value={credentialNumber}
                    onChange={(e) => setCredentialNumber(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isIssuing}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs transition shadow-lg shadow-purple-600/30 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isIssuing ? 'Generating Cryptographic Signature...' : 'Sign & Issue Digital Credential'}</span>
                </button>
              </div>
            </form>

            {issuedSuccess && (
              <div className="p-4 bg-emerald-950/80 border border-emerald-800 rounded-xl space-y-2 font-mono text-xs">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Credential Successfully Issued & Appended to Trust Registry!</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px]">ECDSA Digital Signature:</span>
                  <p className="text-emerald-300 text-[11px] break-all">{issuedSuccess}</p>
                </div>
              </div>
            )}
          </div>

          {/* Quick Guidance Box */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 h-fit">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-purple-400" />
              <span>How Cryptographic Signing Works</span>
            </h3>

            <div className="text-xs text-slate-300 space-y-3">
              <p>
                1. <strong>Payload Hashing:</strong> The student ID, degree, grade, and timestamp are hashed using SHA-256.
              </p>
              <p>
                2. <strong>Digital Signature:</strong> The university private key signs the SHA-256 hash.
              </p>
              <p>
                3. <strong>Instant Verification:</strong> Anyone with the public key can verify the credential without contacting university servers.
              </p>
            </div>

            <div className="p-3 bg-purple-950/50 border border-purple-800/60 rounded-xl space-y-2">
              <span className="text-[11px] font-bold text-purple-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" /> Quick AI Assistant Tool
              </span>
              <p className="text-[11px] text-slate-300">
                Have legacy PDF marksheets or certificates? Use our AI Document OCR tool to auto-fill this form and detect any potential student document alterations.
              </p>
              <button
                onClick={openAiModal}
                className="w-full py-1.5 bg-purple-800 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold transition"
              >
                Launch AI OCR Assistant
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'MANAGE' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white">Issued Credentials Directory</h2>
              <p className="text-xs text-slate-400">View status or revoke compromised or erroneous credentials.</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-3">Type</th>
                  <th className="p-3">Title & Credential #</th>
                  <th className="p-3">Student TC-ID</th>
                  <th className="p-3">Issue Date</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {credentials.map(c => (
                  <tr key={c.id} className="hover:bg-slate-950/60 transition">
                    <td className="p-3 font-bold text-purple-400">{c.type}</td>
                    <td className="p-3 font-sans">
                      <div className="font-bold text-white">{c.title}</div>
                      <div className="text-[10px] font-mono text-slate-400">{c.credentialNumber}</div>
                    </td>
                    <td className="p-3 font-bold text-cyan-400">{c.tcId}</td>
                    <td className="p-3 text-slate-400">{c.issueDate}</td>
                    <td className="p-3">
                      {c.status === 'ACTIVE' ? (
                        <span className="text-emerald-400 font-bold">ACTIVE</span>
                      ) : (
                        <span className="text-rose-400 font-bold">REVOKED</span>
                      )}
                    </td>
                    <td className="p-3 text-right font-sans">
                      {c.status === 'ACTIVE' && (
                        <button
                          onClick={() => setRevokeCredId(c.id)}
                          className="px-2.5 py-1 bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800 rounded-md text-[11px] font-semibold transition"
                        >
                          Revoke Credential
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Revoke Dialog Modal */}
          {revokeCredId && (
            <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-base">
                  <AlertTriangle className="w-5 h-5" />
                  <span>Confirm Credential Revocation</span>
                </div>
                <p className="text-xs text-slate-300">
                  Revoking this credential will immediately update its status in the global TrustChain network. Verifiers will see it marked as REVOKED.
                </p>

                <form onSubmit={handleRevokeSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Revocation Reason</label>
                    <input
                      type="text"
                      value={revokeReason}
                      onChange={(e) => setRevokeReason(e.target.value)}
                      placeholder="e.g. Academic dishonesty / Duplicate entry / Issued in error"
                      required
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setRevokeCredId(null)}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold"
                    >
                      Confirm Revoke
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'AUDIT' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <History className="w-5 h-5 text-purple-400" />
            <span>Cryptographic Audit Ledger</span>
          </h2>

          <div className="space-y-3">
            {auditLogs.map(log => (
              <div key={log.id} className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1 font-mono text-xs">
                <div className="flex items-center justify-between text-slate-400 text-[11px]">
                  <span>{log.timestamp}</span>
                  <span className="text-cyan-400 font-bold">{log.action}</span>
                </div>
                <div className="text-slate-200 font-sans font-semibold text-sm">
                  {log.details}
                </div>
                <div className="text-slate-500 text-[10px]">
                  Actor: {log.actorName} ({log.actorRole}) • Event SHA Hash: {log.hash}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
