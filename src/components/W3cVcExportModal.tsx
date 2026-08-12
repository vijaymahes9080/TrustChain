import React, { useState } from 'react';
import { W3cVcEngine, W3cVerifiableCredential } from '../services/w3cVcEngine';
import { Credential, DigitalIdentity } from '../types/trustchain';
import { FileCode, X, Copy, Check, Download, ExternalLink } from 'lucide-react';

interface W3cVcExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  identity: DigitalIdentity;
  credentials: Credential[];
}

export const W3cVcExportModal: React.FC<W3cVcExportModalProps> = ({
  isOpen,
  onClose,
  identity,
  credentials
}) => {
  const [selectedCredId, setSelectedCredId] = useState(credentials[0]?.id || '');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const targetCred = credentials.find(c => c.id === selectedCredId) || credentials[0];
  const vcData: W3cVerifiableCredential | null = targetCred ? W3cVcEngine.exportW3cVc(targetCred, identity) : null;

  const handleCopyJson = () => {
    if (!vcData) return;
    navigator.clipboard.writeText(JSON.stringify(vcData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJson = () => {
    if (!vcData) return;
    const blob = new Blob([JSON.stringify(vcData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `W3C_VC_${targetCred.credentialNumber}.json`;
    a.click();
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
          <div className="p-2.5 bg-blue-950 border border-blue-800 rounded-xl text-blue-400">
            <FileCode className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-extrabold text-white">W3C Standard Verifiable Credential Export</h3>
              <span className="px-2 py-0.5 text-[10px] font-mono bg-blue-950 text-blue-300 border border-blue-700 rounded font-bold">
                JSON-LD / DID
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Interoperable W3C Standard payload compatible with global DID identity wallets.
            </p>
          </div>
        </div>

        {/* Credential Selector */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-300">Select Credential to Export:</label>
          <select
            value={selectedCredId}
            onChange={(e) => setSelectedCredId(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
          >
            {credentials.map(c => (
              <option key={c.id} value={c.id}>
                {c.type}: {c.title} ({c.issuerName})
              </option>
            ))}
          </select>
        </div>

        {/* JSON-LD Code View */}
        {vcData && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span>W3C VC JSON-LD Payload (did:trustchain subject):</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyJson}
                  className="flex items-center gap-1 text-cyan-400 hover:underline"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>

                <button
                  onClick={handleDownloadJson}
                  className="flex items-center gap-1 text-blue-400 hover:underline"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .json</span>
                </button>
              </div>
            </div>

            <pre className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-blue-300 font-mono text-xs overflow-x-auto max-h-72 scrollbar-thin">
              {JSON.stringify(vcData, null, 2)}
            </pre>
          </div>
        )}

      </div>
    </div>
  );
};
