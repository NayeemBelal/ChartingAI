export type Role = "MOA" | "Physician";

export interface UserSession {
  email: string;
  role: Role;
  rememberMe?: boolean;
}

// Basic transcript turn structure
export interface TranscriptTurn {
  speaker: "Patient" | "Clinician" | "System";
  text: string;
  startSec?: number;
  endSec?: number;
}

// Visit summary report for AI output
export interface VisitSummaryReport {
  chiefComplaint: string;
  summary: string;
  keyFindings: string[];
  suspectedDiagnoses: string[];
  medicationsDiscussed: string[];
  followUpPlan: string;
  riskFlags: string[];
}

// Advanced: Structured Clinical Data Extraction
export interface ClinicalDataExtraction {
  chiefComplaint: string;
  historyOfPresentIllness: string;
  reviewOfSystems: {
    constitutional: string[];
    heent: string[];
    cardiovascular: string[];
    respiratory: string[];
    gastrointestinal: string[];
    genitourinary: string[];
    musculoskeletal: string[];
    neurological: string[];
    psychiatric: string[];
    [key: string]: string[]; // Allow custom systems
  };
  physicalExam: {
    system: string;
    findings: string[];
  }[];
  assessment: {
    diagnosis: string;
    icd10?: string;
    confidence: number; // 0-100
    rationale?: string;
  }[];
  plan: {
    medications: {
      name: string;
      dosage?: string;
      frequency?: string;
      route?: string;
      duration?: string;
      rxNorm?: string; // RxNorm code for interoperability
    }[];
    labs: {
      test: string;
      rationale?: string;
      loinc?: string; // LOINC code
    }[];
    procedures: {
      name: string;
      rationale?: string;
      cpt?: string; // CPT code for billing
    }[];
    imaging: {
      study: string;
      rationale?: string;
    }[];
    referrals: {
      specialty: string;
      reason?: string;
    }[];
    followUp: string;
    patientInstructions: string[];
  };
  riskFactors: {
    level: 'low' | 'moderate' | 'high';
    description: string;
    category: 'allergy' | 'medication' | 'symptom' | 'vital' | 'lab' | 'other';
  }[];
  qualityMetrics: {
    overallConfidence: number; // 0-100
    sectionsCompleted: string[];
    missingRecommendedSections: string[];
    dataCompleteness: number; // 0-100
  };
}

// EHR Submission Types
export interface FinalChartPayload {
  patientName: string;
  patientId?: string;
  mrn?: string;
  visitDate: string;
  providerName: string;
  providerId?: string;
  encounterId?: string;
  chiefComplaint: string;
  historyOfPresentIllness: string;
  reviewOfSystems?: {
    [key: string]: string[];
  };
  physicalExam?: {
    system: string;
    findings: string[];
  }[];
  assessment: {
    diagnosis: string;
    icd10?: string;
    confidence?: number;
    rationale?: string;
  }[];
  plan: {
    medications?: {
      name: string;
      dosage?: string;
      frequency?: string;
      route?: string;
      rxNorm?: string;
    }[];
    labs?: {
      test: string;
      loinc?: string;
      rationale?: string;
    }[];
    procedures?: {
      name: string;
      cpt?: string;
      rationale?: string;
    }[];
    followUp: string;
    patientInstructions?: string[];
  };
  summary?: string;
  bulletPoints?: string[];
  transcript?: string;
  metadata: {
    sourceFile?: string;
    generatedAt: string;
    qualityMetrics?: {
      overallConfidence: number;
      dataCompleteness: number;
    };
  };
}

export interface EHRSubmissionResponse {
  status: "ok" | "error";
  ehrReferenceId?: string;
  error?: string;
  submittedAt?: string;
}

