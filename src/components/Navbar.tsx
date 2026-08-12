import React from 'react';
import { UserRole } from '../store/useTrustChainStore';
import { 
  ShieldCheck, 
  User, 
  Building2, 
  Briefcase, 
  Landmark, 
  QrCode, 
  FileSearch, 
  ExternalLink,
  Search,
  Sparkles,
  RotateCcw
} from 'lucide-react';

interface NavbarProps {
  currentRole: UserRole;
  setRole: (role: UserRole) => void;
  searchTcId: string;
  setSearchTcId: (id: string) => void;
  openQrModal: () => void;
  openAiModal: () => void;
  resetDemoData: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  setRole,
  searchTcId,
  setSearchTcId,
  openQrModal,
  openAiModal,
  resetDemoData
}) => {
  const roleOptions: { id: UserRole; label: string; icon: React.ReactNode; color: string }[] = [
    { id: 'STUDENT', label: 'Student Wallet', icon: <User className="w-4 h-4" />, color: 'from-blue-500 to-cyan-500' },
    { id: 'UNIVERSITY', label: 'University Portal', icon: <Building2 className="w-4 h-4" />, color: 'from-purple-500 to-indigo-500' },
    { id: 'COMPANY', label: 'Company Verifier', icon: <Briefcase className="w-4 h-4" />, color: 'from-emerald-500 to-teal-500' },
    { id: 'GOVERNMENT', label: 'Government Portal', icon: <Landmark className="w-4 h-4" />, color: 'from-amber-500 to-orange-500' },
    { id: 'PUBLIC_LINK', label: 'Universal Verify', icon: <ExternalLink className="w-4 h-4" />, color: 'from-pink-500 to-rose-500' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setRole('STUDENT')}>
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20">
              <ShieldCheck className="w-6 h-6 text-white" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-900 animate-ping" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-900" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-cyan-300">
                  TrustChain
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-mono font-semibold bg-cyan-950 text-cyan-400 border border-cyan-800 rounded">
                  v2.6 MVP
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium tracking-wide">
                Universal Verification Platform
              </p>
            </div>
          </div>

          {/* Quick Search */}
          <div className="hidden md:flex items-center flex-1 max-w-xs relative">
            <Search className="w-4 h-4 absolute left-3 text-slate-400" />
            <input
              type="text"
              value={searchTcId}
              onChange={(e) => setSearchTcId(e.target.value)}
              placeholder="Search TC-ID (e.g. TC-IN-2026-89421A)..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-950/70 border border-slate-800 rounded-lg text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 placeholder:text-slate-500"
            />
          </div>

          {/* Quick Action Tools */}
          <div className="flex items-center gap-2">
            <button
              onClick={openQrModal}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition border border-slate-700 shadow-sm"
              title="Scan QR Code"
            >
              <QrCode className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Scan QR</span>
            </button>

            <button
              onClick={openAiModal}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-indigo-900/60 to-purple-900/60 hover:from-indigo-800/80 hover:to-purple-800/80 text-purple-200 border border-purple-700/50 rounded-lg text-xs font-medium transition shadow-sm"
              title="AI Document Analyzer OCR"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
              <span className="hidden sm:inline">AI OCR</span>
            </button>

            <button
              onClick={resetDemoData}
              className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition"
              title="Reset Demo Data"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Role Switcher Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto py-2 scrollbar-none border-t border-slate-800/60">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 whitespace-nowrap">
            Persona View:
          </span>
          {roleOptions.map(r => {
            const isActive = currentRole === r.id;
            return (
              <button
                key={r.id}
                onClick={() => setRole(r.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition whitespace-nowrap ${
                  isActive
                    ? `bg-gradient-to-r ${r.color} text-white shadow-md font-semibold ring-1 ring-white/20`
                    : 'bg-slate-950/50 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800/80'
                }`}
              >
                {r.icon}
                <span>{r.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
};
