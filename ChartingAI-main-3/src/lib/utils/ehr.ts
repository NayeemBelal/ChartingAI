/**
 * EHR Integration Utilities
 * Mock implementation for EHR submission
 * 
 * In production, this would call a real EHR API (Epic, Cerner, etc.)
 * or FHIR-compliant endpoint.
 */

import type { FinalChartPayload, EHRSubmissionResponse } from '@/types';

/**
 * Submit chart to mock EHR system
 * 
 * Simulates network latency and returns a mock EHR reference ID.
 * In production, this would make an actual API call to the EHR system.
 * 
 * @param payload - Complete chart payload to submit
 * @returns Promise with submission response including EHR reference ID
 */
export async function submitChartToMockEHR(
  payload: FinalChartPayload
): Promise<EHRSubmissionResponse> {
  // Simulate network latency (1.2 seconds)
  await new Promise((resolve) => setTimeout(resolve, 1200));

  // Simulate occasional failures (5% chance for demo purposes)
  // In production, remove this and handle real API errors
  if (Math.random() < 0.05) {
    throw new Error('EHR system temporarily unavailable. Please try again.');
  }

  // Generate mock EHR reference ID
  const ehrReferenceId = `EHR-${Math.floor(100000 + Math.random() * 900000).toString()}`;

  return {
    status: 'ok',
    ehrReferenceId,
    submittedAt: new Date().toISOString(),
  };
}

/**
 * Build FinalChartPayload from available data
 * 
 * Converts the data structure from Success page state into
 * the standardized EHR payload format.
 */
export function buildChartPayload(data: {
  patientName?: string;
  patientId?: string;
  mrn?: string;
  visitDate?: string;
  providerName?: string;
  providerId?: string;
  encounterId?: string;
  summary?: string;
  bulletPoints?: string[];
  transcript?: string;
  clinicalData?: import('@/types').ClinicalDataExtraction;
  fileName?: string;
}): FinalChartPayload {
  const clinicalData = data.clinicalData;

  return {
    patientName: data.patientName || 'Unknown Patient',
    patientId: data.patientId,
    mrn: data.mrn,
    visitDate: data.visitDate || new Date().toISOString(),
    providerName: data.providerName || 'Unknown Provider',
    providerId: data.providerId,
    encounterId: data.encounterId,
    chiefComplaint: clinicalData?.chiefComplaint || 'No chief complaint documented',
    historyOfPresentIllness: clinicalData?.historyOfPresentIllness || data.summary || '',
    reviewOfSystems: clinicalData?.reviewOfSystems,
    physicalExam: clinicalData?.physicalExam,
    assessment: clinicalData?.assessment || [],
    plan: {
      medications: clinicalData?.plan?.medications,
      labs: clinicalData?.plan?.labs,
      procedures: clinicalData?.plan?.procedures,
      followUp: clinicalData?.plan?.followUp || 'Follow-up as needed',
      patientInstructions: clinicalData?.plan?.patientInstructions,
    },
    summary: data.summary,
    bulletPoints: data.bulletPoints,
    transcript: data.transcript,
    metadata: {
      sourceFile: data.fileName,
      generatedAt: new Date().toISOString(),
      qualityMetrics: clinicalData?.qualityMetrics ? {
        overallConfidence: clinicalData.qualityMetrics.overallConfidence,
        dataCompleteness: clinicalData.qualityMetrics.dataCompleteness,
      } : undefined,
    },
  };
}

