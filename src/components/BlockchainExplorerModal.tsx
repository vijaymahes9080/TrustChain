import React from 'react';
import { BlockchainLedger, LedgerBlock } from '../services/blockchainLedger';
import { Layers, X, ShieldCheck, Hash, Link2, CheckCircle2 } from 'lucide-react';

interface BlockchainExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BlockchainExplorerModal: React.FC<BlockchainExplorerModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const blocks: LedgerBlock[] = BlockchainLedger.getLedgerBlocks();

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full p-6 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-lg transition"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-950 border border-indigo-800 rounded-xl text-indigo-400">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-extrabold text-white">TrustChain Block Ledger Explorer</h3>
              <span className="px-2 py-0.5 text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-800 rounded font-bold">
                Immutable Ledger
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Inspect how university credentials and student DIDs are anchored in Merkle roots.
            </p>
          </div>
        </div>

        {/* Blocks Feed */}
        <div className="space-y-4">
          {blocks.map(block => (
            <div key={block.blockHeight} className="p-4 bg-slate-950 border border-indigo-900/60 rounded-xl space-y-3 font-mono text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-indigo-950 text-indigo-300 font-bold rounded border border-indigo-800">
                    Block #{block.blockHeight}
                  </span>
                  <span className="text-slate-400 text-[11px]">{block.timestamp}</span>
                </div>
                <div className="text-emerald-400 font-bold text-[11px] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Validator: {block.validatorSignature}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Block Hash:</span>
                  <div className="text-cyan-300 truncate">{block.blockHash}</div>
                </div>

                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Merkle Root:</span>
                  <div className="text-purple-300 truncate">{block.merkleRoot}</div>
                </div>
              </div>

              {/* Transactions in Block */}
              <div className="pt-2 border-t border-slate-800/80 space-y-1.5 font-sans">
                <span className="text-slate-400 text-[10px] uppercase font-bold font-mono block">
                  Anchored Ledger Transactions ({block.transactionCount}):
                </span>
                {block.transactions.map((tx, idx) => (
                  <div key={idx} className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 text-xs flex items-center justify-between gap-2">
                    <div>
                      <span className="font-bold text-white text-[11px]">{tx.details}</span>
                      <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                        Tx Hash: <code className="text-cyan-400">{tx.txHash}</code> • TC-ID: <code className="text-purple-300">{tx.tcId}</code>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 bg-slate-950 text-cyan-400 border border-slate-800 rounded font-mono text-[10px] font-bold">
                      {tx.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
