export interface LedgerBlock {
  blockHeight: number;
  blockHash: string;
  previousBlockHash: string;
  merkleRoot: string;
  timestamp: string;
  transactionCount: number;
  validatorSignature: string;
  transactions: {
    txHash: string;
    type: 'CREDENTIAL_ANCHOR' | 'REVOCATION' | 'DID_REGISTER';
    tcId: string;
    details: string;
  }[];
}

export class BlockchainLedger {
  /**
   * Returns simulated immutable audit ledger blocks
   */
  static getLedgerBlocks(): LedgerBlock[] {
    return [
      {
        blockHeight: 148920,
        blockHash: '0x7f9a12c4b8e3d2a10f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c8b7a',
        previousBlockHash: '0x3a881e9d0c7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e7d6c5b4a3f2e1d',
        merkleRoot: '0x9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f',
        timestamp: '2026-08-12 06:15:20 UTC',
        transactionCount: 4,
        validatorSignature: 'VAL_SIG_GRI_AUTH_NODE_01',
        transactions: [
          {
            txHash: '0xa9b8c7d6e5f4a3b2c1d0',
            type: 'CREDENTIAL_ANCHOR',
            tcId: 'TC-IN-2026-89421A',
            details: 'Anchored MCA Degree Credential (GRI-MCA-2026-0492) Hash'
          },
          {
            txHash: '0xf1e2d3c4b5a698877665',
            type: 'DID_REGISTER',
            tcId: 'TC-IN-2026-89421A',
            details: 'Registered Decentralized Identifier did:trustchain:TC-IN-2026-89421A'
          }
        ]
      },
      {
        blockHeight: 148919,
        blockHash: '0x3a881e9d0c7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e7d6c5b4a3f2e1d',
        previousBlockHash: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
        merkleRoot: '0x8f9a12b4e5c6d7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2',
        timestamp: '2026-08-11 18:40:00 UTC',
        transactionCount: 2,
        validatorSignature: 'VAL_SIG_AWS_TRAINING_NODE_04',
        transactions: [
          {
            txHash: '0x1a2b3c4d5e6f7a8b9c0d',
            type: 'CREDENTIAL_ANCHOR',
            tcId: 'TC-IN-2026-89421A',
            details: 'Anchored AWS Solutions Architect Certification Hash'
          }
        ]
      }
    ];
  }
}
