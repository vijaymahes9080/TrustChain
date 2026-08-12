import React, { useState } from 'react';
import { AiAnalyzerService } from '../services/aiAnalyzer';
import { AIAnalysisResult } from '../types/trustchain';
import { Sparkles, X, AlertTriangle, CheckCircle2, FileText, Upload, ShieldAlert, Cpu } from 'lucide-react';

interface AiOcrModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AiOcrModal: React.FC<AiOcrModalProps> = ({ isOpen, onClose }) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<'gandhigram' | 'stanford' | 'suspicious'>('gandhigram');
  const [result, setResult] = useState<AIAnalysisResult | null>(null);

  if (!isOpen) return null;

  const handleRunAnalysis = async (preset: 'gandhigram' | 'stanford' | 'suspicious') => {
    setSelectedPreset(preset);
    setAnalyzing(true);
    setResult(null);
    const res = await AiAnalyzerService.analyzeDocument(`${preset}_cert.pdf`, preset);
    setResult(res);
    setAnalyzing(false);
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
          <div className="p-2.5 bg-purple-950 border border-purple-800 rounded-xl text-purple-400">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-white">AI Document OCR & Forgery Detector</h3>
            <p className="text-xs text-slate-400">
              Extracts metadata fields & runs Error Level Analysis (ELA) for document tampering.
            </p>
          </div>
        </div>

        {/* Preset Selector Buttons */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-slate-300">Select Test Document Sample:</span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              onClick={() => handleRunAnalysis('gandhigram')}
              className={`p-3 rounded-xl border text-left text-xs font-semibold transition ${
                selectedPreset === 'gandhigram' && result && !result.isTampered
                  ? 'bg-purple-950/80 border-purple-600 text-white'
                  : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              🏛️ Gandhigram MCA Cert
              <span className="block text-[10px] text-slate-400 mt-0.5">Authentic University PDF</span>
            </button>

            <button
              onClick={() => handleRunAnalysis('stanford')}
              className={`p-3 rounded-xl border text-left text-xs font-semibold transition ${
                selectedPreset === 'stanford' && result && !result.isTampered
                  ? 'bg-purple-950/80 border-purple-600 text-white'
                  : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              🧠 Stanford AI Cert
              <span className="block text-[10px] text-slate-400 mt-0.5">Authentic Online Cert</span>
            </button>

            <button
              onClick={() => handleRunAnalysis('suspicious')}
              className={`p-3 rounded-xl border text-left text-xs font-semibold transition ${
                selectedPreset === 'suspicious' || (result && result.isTampered)
                  ? 'bg-rose-950/80 border-rose-600 text-rose-200'
                  : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              ⚠️ Tampered Certificate
              <span className="block text-[10px] text-rose-400 mt-0.5">Font & Pixel Edited PDF</span>
            </button>
          </div>
        </div>

        {/* Loading Spinner State */}
        {analyzing && (
          <div className="p-8 bg-slate-950 border border-slate-800 rounded-xl text-center space-y-3 font-mono text-xs text-purple-400">
            <Cpu className="w-8 h-8 animate-spin mx-auto text-purple-400" />
            <div>Running Tesseract OCR & ELA Neural Model...</div>
          </div>
        )}

        {/* Analysis Results View */}
        {result && !analyzing && (
          <div className="space-y-4 pt-2">
            
            {/* Status Recommendation Card */}
            <div className={`p-4 rounded-xl border font-mono text-xs flex items-center justify-between ${
              result.isTampered 
                ? 'bg-rose-950/90 border-rose-800 text-rose-200'
                : 'bg-emerald-950/90 border-emerald-800 text-emerald-200'
            }`}>
              <div className="flex items-center gap-3">
                {result.isTampered ? (
                  <ShieldAlert className="w-6 h-6 text-rose-400" />
                ) : (
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                )}
                <div>
                  <div className="font-bold text-sm">
                    AI Recommendation: {result.recommendation}
                  </div>
                  <div className="text-[11px] opacity-90">
                    Confidence: {result.confidenceScore}% • Anomaly Score: {result.anomalyScore} / 100
                  </div>
                </div>
              </div>
            </div>

            {/* Extracted Fields Table */}
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3 text-xs">
              <span className="font-bold text-slate-300 uppercase tracking-wider text-[10px]">
                Extracted Document Fields (OCR Output)
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono">
                <div>
                  <span className="text-slate-500 text-[10px]">Student Name:</span>
                  <div className="text-white font-bold">{result.extractedFields.studentName}</div>
                </div>

                <div>
                  <span className="text-slate-500 text-[10px]">Institution:</span>
                  <div className="text-white font-bold">{result.extractedFields.institution}</div>
                </div>

                <div>
                  <span className="text-slate-500 text-[10px]">Course / Qualification:</span>
                  <div className="text-white font-bold">{result.extractedFields.courseOrDegree}</div>
                </div>

                <div>
                  <span className="text-slate-500 text-[10px]">Grade / Marks:</span>
                  <div className="text-white font-bold">{result.extractedFields.gradeOrMarks}</div>
                </div>

                <div>
                  <span className="text-slate-500 text-[10px]">Issue Date:</span>
                  <div className="text-white">{result.extractedFields.issueDate}</div>
                </div>

                <div>
                  <span className="text-slate-500 text-[10px]">Credential #:</span>
                  <div className="text-white">{result.extractedFields.credentialNo}</div>
                </div>
              </div>
            </div>

            {/* Tampering Flags if any */}
            {result.isTampered && result.tamperingFlags.length > 0 && (
              <div className="p-4 bg-rose-950/60 border border-rose-900 rounded-xl space-y-2 text-xs">
                <span className="font-bold text-rose-300 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-400" /> Tampering Indicators Flagged by AI:
                </span>
                <ul className="list-disc list-inside space-y-1 text-rose-200 font-mono text-[11px]">
                  {result.tamperingFlags.map((flag, idx) => (
                    <li key={idx}>{flag}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
