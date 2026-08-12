import React, { useState } from 'react';
import { useTrustChain } from './store/useTrustChainStore';
import { Navbar } from './components/Navbar';
import { StudentApp } from './components/StudentApp';
import { UniversityPortal } from './components/UniversityPortal';
import { CompanyPortal } from './components/CompanyPortal';
import { GovernmentPortal } from './components/GovernmentPortal';
import { PublicVerificationView } from './components/PublicVerificationView';
import { QRScannerModal } from './components/QRScannerModal';
import { AiOcrModal } from './components/AiOcrModal';
import { ZkpSimulatorModal } from './components/ZkpSimulatorModal';
import { BlockchainExplorerModal } from './components/BlockchainExplorerModal';
import { W3cVcExportModal } from './components/W3cVcExportModal';
import { DeveloperSdkModal } from './components/DeveloperSdkModal';
import { VerifiedResumeGeneratorModal } from './components/VerifiedResumeGeneratorModal';
import { ShieldCheck, Github } from 'lucide-react';

export function App() {
  const {
    role,
    setRole,
    identity,
    credentials,
    auditLogs,
    searchTcId,
    setSearchTcId,
    qrModalOpen,
    setQrModalOpen,
    aiModalOpen,
    setAiModalOpen,
    issueCredential,
    revokeCredential,
    verifyCredentialInStore,
    updatePrivacy,
    resetToDefault,
  } = useTrustChain();

  const [zkpModalOpen, setZkpModalOpen] = useState(false);
  const [blockExplorerOpen, setBlockExplorerOpen] = useState(false);
  const [w3cModalOpen, setW3cModalOpen] = useState(false);
  const [sdkModalOpen, setSdkModalOpen] = useState(false);
  const [resumeModalOpen, setResumeModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Top Navbar Header */}
      <Navbar
        currentRole={role}
        setRole={setRole}
        searchTcId={searchTcId}
        setSearchTcId={setSearchTcId}
        openQrModal={() => setQrModalOpen(true)}
        openAiModal={() => setAiModalOpen(true)}
        openZkpModal={() => setZkpModalOpen(true)}
        openBlockExplorerModal={() => setBlockExplorerOpen(true)}
        openW3cModal={() => setW3cModalOpen(true)}
        openSdkModal={() => setSdkModalOpen(true)}
        openResumeModal={() => setResumeModalOpen(true)}
        resetDemoData={resetToDefault}
      />

      {/* Main Role Content View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {role === 'STUDENT' && (
          <StudentApp
            identity={identity}
            credentials={credentials}
            updatePrivacy={updatePrivacy}
            openQrModal={() => setQrModalOpen(true)}
          />
        )}

        {role === 'UNIVERSITY' && (
          <UniversityPortal
            credentials={credentials}
            auditLogs={auditLogs}
            issueCredential={issueCredential}
            revokeCredential={revokeCredential}
            openAiModal={() => setAiModalOpen(true)}
          />
        )}

        {role === 'COMPANY' && (
          <CompanyPortal
            identity={identity}
            credentials={credentials}
            verifyCredentialInStore={verifyCredentialInStore}
          />
        )}

        {role === 'GOVERNMENT' && (
          <GovernmentPortal
            identity={identity}
            credentials={credentials}
          />
        )}

        {role === 'PUBLIC_LINK' && (
          <PublicVerificationView
            identity={identity}
            credentials={credentials}
            openQrModal={() => setQrModalOpen(true)}
          />
        )}
      </main>

      {/* Interactive Modals */}
      <QRScannerModal
        isOpen={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        tcId={identity.tcId}
      />

      <AiOcrModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
      />

      <ZkpSimulatorModal
        isOpen={zkpModalOpen}
        onClose={() => setZkpModalOpen(false)}
        identity={identity}
        credentials={credentials}
      />

      <BlockchainExplorerModal
        isOpen={blockExplorerOpen}
        onClose={() => setBlockExplorerOpen(false)}
      />

      <W3cVcExportModal
        isOpen={w3cModalOpen}
        onClose={() => setW3cModalOpen(false)}
        identity={identity}
        credentials={credentials}
      />

      <DeveloperSdkModal
        isOpen={sdkModalOpen}
        onClose={() => setSdkModalOpen(false)}
        tcId={identity.tcId}
      />

      <VerifiedResumeGeneratorModal
        isOpen={resumeModalOpen}
        onClose={() => setResumeModalOpen(false)}
        identity={identity}
        credentials={credentials}
      />

      {/* Footer */}
      <footer className="bg-slate-900/80 border-t border-slate-800/80 py-8 px-4 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            <span className="font-bold text-white">TrustChain</span>
            <span>• Universal Verification Platform</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="font-mono text-slate-400">SHA-256 & P-256 ECDSA & zk-SNARK Network</span>
            <a 
              href="https://github.com/vijaymahes9080/TrustChain" 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-1 text-cyan-400 hover:underline"
            >
              <Github className="w-4 h-4" /> vijaymahes9080/TrustChain
            </a>
          </div>

          <div className="text-slate-400 text-center md:text-right font-medium">
            MCA Final-Year Project & Startup Prototype • Vijay Mahes
          </div>
        </div>
      </footer>

    </div>
  );
}
