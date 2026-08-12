import { AIAnalysisResult } from '../types/trustchain';

export class AiAnalyzerService {
  /**
   * Simulates AI OCR extraction & Tampering Detection on certificate image/file
   */
  static async analyzeDocument(fileName: string, samplePreset?: 'gandhigram' | 'stanford' | 'suspicious'): Promise<AIAnalysisResult> {
    // Artificial slight delay for realistic processing feedback
    await new Promise(resolve => setTimeout(resolve, 1400));

    if (samplePreset === 'suspicious' || fileName.toLowerCase().includes('edited') || fileName.toLowerCase().includes('fake')) {
      return {
        confidenceScore: 68,
        extractedFields: {
          studentName: 'Vijay Mahes (Modified Pixel Layer)',
          institution: 'Gandhigram Rural Institute',
          courseOrDegree: 'Master of Computer Applications (MCA)',
          gradeOrMarks: '9.8 / 10.0 (Font Mismatch Detected)',
          issueDate: '12 August 2026',
          credentialNo: 'TC-CERT-FORGED-99'
        },
        isTampered: true,
        anomalyScore: 82,
        tamperingFlags: [
          'Font hierarchy mismatch in student name metadata layer',
          'Compression artifact anomaly around grade text box (ELA Analysis)',
          'Digital signature timestamp does not match document metadata creation date'
        ],
        recommendation: 'REJECT'
      };
    }

    if (samplePreset === 'stanford' || fileName.toLowerCase().includes('stanford')) {
      return {
        confidenceScore: 98,
        extractedFields: {
          studentName: 'Vijay Mahes',
          institution: 'Stanford Online / Deep Learning Specialization',
          courseOrDegree: 'Advanced Artificial Intelligence & Neural Networks',
          gradeOrMarks: 'Distinction (98%)',
          issueDate: '04 May 2026',
          credentialNo: 'STF-AI-2026-8812'
        },
        isTampered: false,
        anomalyScore: 3,
        tamperingFlags: [],
        recommendation: 'APPROVE'
      };
    }

    // Default clean output (Gandhigram / standard official certificate)
    return {
      confidenceScore: 96,
      extractedFields: {
        studentName: 'Vijay Mahes',
        institution: 'Gandhigram Rural Institute (Deemed University)',
        courseOrDegree: 'Master of Computer Applications (MCA)',
        gradeOrMarks: '9.4 CGPA (First Class with Distinction)',
        issueDate: '12 August 2026',
        credentialNo: 'GRI-MCA-2026-0492'
      },
      isTampered: false,
      anomalyScore: 5,
      tamperingFlags: [],
      recommendation: 'APPROVE'
    };
  }
}
