import React, { useState } from 'react';
import { ZkpEngine, ZkpProofResult } from '../services/zkpEngine';
import { DigitalIdentity, Credential } from '../types/trustchain';
import { ShieldCheck, X, Cpu, CheckCircle2, Lock, EyeOff, Sparkles, Copy, Check } from 'lucide-react';

interface ZkpSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  identity: DigitalIdentity;
  credentials: Credential[];
}

export const ZkpSimulatorModal: React.FC<ZkpSimulatorModalProps> = ({
  isOpen,
  onClose,
  identity,
  credentials
}) => {
  const [claimType, setClaimType] = useState<ZkpProofResult['claimType']>('GPA_ABOVE_THRESHOLD');
  const [threshold, setThreshold] = useState(8.0);
  const [generating, setGenerating] = useState(false);
  const [proofResult, setProofResult] = useState<ZkpProofResult | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleGenerateProof = async () => {
    setGenerating(true);
    setProofResult(null);
    const result = await ZkpEngine.generateZkpProof(identity, credentials, claimType, threshold);
    setProofResult(result);
    setGenerating(false);
  };

  const handleCopyProof = () => {
    if (!proofResult) return;
    navigator.clipboard.writeText(JSON.stringify(proofResult, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-lg transition"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-cyan-950 border border-cyan-800 rounded-xl text-cyan-400">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-extrabold text-white">Zero-Knowledge Proof (ZKP) Studio</h3>
              <span className="px-2 py-0.5 text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-700 rounded font-bold">
                zk-SNARK Groth16
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Prove claims about your education or performance without exposing actual GPA, birthdate, or transcripts.
            </p>
          </div>
        </div>

        {/* Claim Selector Form */}
        <div className="space-y-4 bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Select Claim to Prove in Zero-Knowledge:</label>
            <select
              value={claimType}
              onChange={(e) => setClaimType(e.target.value as any)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="GPA_ABOVE_THRESHOLD">1. Prove CGPA is Above Threshold (e.g. CGPA &gt;= 8.0) without revealing CGPA</option>
              <option value="DEGREE_HOLDERSHIP">2. Prove Authentic MCA Degree Possesses without revealing Student ID or Phone</option>
              <option value="GITHUB_COMMITS_THRESHOLD">3. Prove GitHub Open Source Contributions &gt; Threshold without revealing Private Code</option>
            </select>
          </div>

          {claimType === 'GPA_ABOVE_THRESHOLD' && (
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Minimum CGPA Threshold:</label>
              <input
                type="number"
                step="0.1"
                min="5.0"
                max="10.0"
                value={threshold}
                onChange={(e) => setThreshold(parseFloat(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-cyan-300"
              />
            </div>
          )}

          <button
            onClick={handleGenerateProof}
            disabled={generating}
            className="w-full py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-slate-950 font-extrabold rounded-xl text-xs transition shadow-lg shadow-cyan-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {generating ? (
              <>
                <Cpu className="w-4 h-4 animate-spin text-slate-950" />
                <span>Computing Groth16 zk-SNARK Witness & Proof...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Zero-Knowledge Cryptographic Proof</span>
              </>
            )}
          </button>
        </div>

        {/* Proof Output Result */}
        {proofResult && (
          <div className="space-y-3 pt-2">
            <div className="p-4 bg-emerald-950/80 border border-emerald-800 rounded-xl space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between text-emerald-400 font-bold">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> ZKP Proof Verified Valid!
                </span>
                <span>ID: {proofResult.proofId}</span>
              </div>
              <p className="text-slate-200 font-sans font-medium text-xs">
                {proofResult.claimStatement}
              </p>
              <div className="text-[10px] text-slate-400">
                Verifier Key Hash: <code className="text-cyan-300">{proofResult.verifierKeyHash}</code>
              </div>
            </div>

            {/* Proof JSON snippet */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span>Groth16 BN128 Cryptographic Proof Payload:</span>
                <button
                  onClick={handleCopyProof}
                  className="flex items-center gap-1 text-cyan-400 hover:underline"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy JSON'}</span>
                </button>
              </div>

              <pre className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-cyan-300 font-mono text-[11px] overflow-x-auto max-h-56 scrollbar-thin">
                {JSON.stringify(proofResult.proofData, null, 2)}
              </pre>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
