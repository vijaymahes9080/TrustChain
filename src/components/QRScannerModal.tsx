import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { QrCode, X, CheckCircle2, ShieldCheck, Camera, Upload, Copy, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  tcId: string;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({
  isOpen,
  onClose,
  tcId
}) => {
  const [activeTab, setActiveTab] = useState<'GENERATE' | 'SCAN'>('GENERATE');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [scannedResult, setScannedResult] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [copied, setCopied] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const verificationUrl = `${window.location.origin}/u/${tcId}`;

  useEffect(() => {
    if (isOpen) {
      QRCode.toDataURL(verificationUrl, {
        width: 320,
        margin: 2,
        color: {
          dark: '#06b6d4',
          light: '#090d16'
        }
      })
      .then(url => setQrDataUrl(url))
      .catch(err => console.error(err));
    }
  }, [isOpen, tcId, verificationUrl]);

  if (!isOpen) return null;

  const handleSimulateScan = () => {
    setIsScanning(true);
    setScannedResult(null);
    setTimeout(() => {
      setIsScanning(false);
      setScannedResult(tcId);
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
    }, 1200);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(verificationUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-6 shadow-2xl relative">
        
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-lg transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <button
            onClick={() => setActiveTab('GENERATE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'GENERATE'
                ? 'bg-cyan-600 text-slate-950 shadow-md'
                : 'bg-slate-950 text-slate-400 hover:text-white'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" /> Generate Digital QR
          </button>

          <button
            onClick={() => setActiveTab('SCAN')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'SCAN'
                ? 'bg-cyan-600 text-slate-950 shadow-md'
                : 'bg-slate-950 text-slate-400 hover:text-white'
            }`}
          >
            <Camera className="w-3.5 h-3.5" /> Scan & Verify QR
          </button>
        </div>

        {activeTab === 'GENERATE' ? (
          <div className="text-center space-y-4">
            <div>
              <h3 className="text-base font-bold text-white">TrustChain Digital Verification QR</h3>
              <p className="text-xs text-slate-400">Scan using any smartphone camera or verifier node.</p>
            </div>

            <div className="relative inline-block p-4 bg-slate-950 border-2 border-cyan-500/40 rounded-2xl shadow-xl shadow-cyan-500/10">
              {qrDataUrl ? (
                <img src={qrDataUrl} alt="TrustChain QR Code" className="w-56 h-56 mx-auto rounded-lg" />
              ) : (
                <div className="w-56 h-56 bg-slate-900 animate-pulse rounded-lg flex items-center justify-center text-xs text-slate-500">
                  Generating QR...
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-10 h-10 rounded-xl bg-slate-900 border-2 border-cyan-400 flex items-center justify-center shadow-lg">
                  <ShieldCheck className="w-6 h-6 text-cyan-400" />
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-slate-300 flex items-center justify-between">
              <span className="text-cyan-400 font-bold">{tcId}</span>
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1 text-cyan-400 hover:underline"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy URL'}</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <div>
              <h3 className="text-base font-bold text-white">Live QR Scanner Terminal</h3>
              <p className="text-xs text-slate-400">Position QR code inside viewfinder frame.</p>
            </div>

            <div className="relative w-full h-56 bg-slate-950 border-2 border-dashed border-cyan-500/50 rounded-2xl overflow-hidden flex flex-col items-center justify-center p-4">
              <div className="w-40 h-40 border-2 border-cyan-400 rounded-xl relative flex items-center justify-center">
                <div className="w-full h-0.5 bg-cyan-400 absolute top-1/2 shadow-lg shadow-cyan-400 animate-pulse" />
                <Camera className="w-10 h-10 text-cyan-500/40" />
              </div>

              {isScanning && (
                <div className="absolute inset-0 bg-slate-950/90 flex items-center justify-center font-mono text-xs text-cyan-400">
                  Decoding Cryptographic QR Signature...
                </div>
              )}
            </div>

            <button
              onClick={handleSimulateScan}
              className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded-xl text-xs transition"
            >
              Test Scan Demo QR
            </button>

            {scannedResult && (
              <div className="p-3 bg-emerald-950 border border-emerald-800 rounded-xl text-left font-mono text-xs space-y-1">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>QR Code Verified Authentic!</span>
                </div>
                <div className="text-slate-300">TC-ID: {scannedResult}</div>
                <div className="text-slate-400 text-[10px]">Status: ACTIVE • All Signatures Valid</div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
