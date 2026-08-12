import React, { useState } from 'react';
import { Code2, X, Copy, Check, Terminal, ExternalLink } from 'lucide-react';

interface DeveloperSdkModalProps {
  isOpen: boolean;
  onClose: () => void;
  tcId: string;
}

export const DeveloperSdkModal: React.FC<DeveloperSdkModalProps> = ({
  isOpen,
  onClose,
  tcId
}) => {
  const [activeTab, setActiveTab] = useState<'HTML' | 'REACT' | 'NODE'>('HTML');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const codeSnippets = {
    HTML: `<!-- TrustChain Embeddable Verification Button -->
<script src="https://cdn.trustchain.network/v2/trustchain-verify.js"></script>

<trustchain-verify 
  tc-id="${tcId}"
  theme="dark"
  size="medium"
  onverify="handleVerificationSuccess"
></trustchain-verify>`,

    REACT: `import { TrustChainBadge } from '@trustchain/react-sdk';

export function RecruiterApplicationForm() {
  return (
    <div>
      <h3>Verify Candidate Identity:</h3>
      <TrustChainBadge 
        tcId="${tcId}"
        onVerified={(result) => console.log('Authentic:', result)}
      />
    </div>
  );
}`,

    NODE: `import { TrustChainClient } from '@trustchain/sdk';

const trustchain = new TrustChainClient({
  apiKey: process.env.TRUSTCHAIN_API_KEY
});

// Verify candidate digital identity & degree
const verification = await trustchain.verifyIdentity('${tcId}');
console.log('Degree Valid:', verification.degree.isValid);`
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(codeSnippets[activeTab]);
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
          <div className="p-2.5 bg-emerald-950 border border-emerald-800 rounded-xl text-emerald-400">
            <Terminal className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-extrabold text-white">Developer SDK & Embeddable Widget</h3>
              <span className="px-2 py-0.5 text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-800 rounded font-bold">
                SDK v2.6
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Embed 1-click verification buttons on job portals, university sites, or HR application forms.
            </p>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          {(['HTML', 'REACT', 'NODE'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === tab
                  ? 'bg-emerald-600 text-slate-950 shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-white'
              }`}
            >
              {tab === 'HTML' ? '🌐 HTML Web Component' : tab === 'REACT' ? '⚛️ React SDK' : '💚 Node.js Backend'}
            </button>
          ))}
        </div>

        {/* Code Snippet Box */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Integration Code Snippet:</span>
            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1 text-emerald-400 hover:underline"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Code'}</span>
            </button>
          </div>

          <pre className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-emerald-300 font-mono text-xs overflow-x-auto">
            {codeSnippets[activeTab]}
          </pre>
        </div>

      </div>
    </div>
  );
};
