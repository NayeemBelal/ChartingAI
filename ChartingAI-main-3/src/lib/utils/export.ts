/**
 * Export Utilities
 * Handles exporting encounters to various formats (PDF, FHIR, etc.)
 */

import jsPDF from 'jspdf';
import type { ClinicalDataExtraction } from '@/types';

export interface ExportOptions {
  format: 'pdf' | 'txt' | 'json';
  includeTranscript?: boolean;
  includeStructuredData?: boolean;
  filename?: string;
}

/**
 * Export encounter to PDF format
 */
export function exportToPDF(
  data: {
    patientName?: string;
    encounterDate?: string;
    summary?: string;
    bulletPoints?: string[];
    transcript?: string;
    clinicalData?: ClinicalDataExtraction;
    fileName?: string;
  },
  options?: ExportOptions
): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const maxWidth = pageWidth - 2 * margin;
  let yPosition = margin;

  // Helper function to add text with wrapping
  const addText = (text: string, fontSize: number = 10, isBold: boolean = false, color?: [number, number, number]) => {
    doc.setFontSize(fontSize);
    if (isBold) {
      doc.setFont(undefined, 'bold');
    } else {
      doc.setFont(undefined, 'normal');
    }
    if (color) {
      doc.setTextColor(color[0], color[1], color[2]);
    } else {
      doc.setTextColor(0, 0, 0);
    }

    const lines = doc.splitTextToSize(text, maxWidth);
    
    // Check if we need a new page
    if (yPosition + (lines.length * (fontSize * 0.4)) > pageHeight - margin) {
      doc.addPage();
      yPosition = margin;
    }

    lines.forEach((line: string) => {
      doc.text(line, margin, yPosition);
      yPosition += fontSize * 0.4;
    });
    
    doc.setTextColor(0, 0, 0);
    yPosition += 5; // Add spacing after text
  };

  // Header
  doc.setFillColor(37, 99, 235); // Blue
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont(undefined, 'bold');
  doc.text('ChartingAI Medical Report', margin, 25);
  
  yPosition = 50;

  // Patient Information
  if (data.patientName || data.encounterDate) {
    doc.setFillColor(243, 244, 246); // Light gray
    doc.rect(margin - 5, yPosition - 10, maxWidth + 10, 20, 'F');
    
    doc.setTextColor(0, 0, 0);
    addText('Patient Information', 12, true);
    
    if (data.patientName) {
      addText(`Patient: ${data.patientName}`, 10);
    }
    if (data.encounterDate) {
      addText(`Encounter Date: ${data.encounterDate}`, 10);
    } else {
      addText(`Generated: ${new Date().toLocaleDateString()}`, 10);
    }
    if (data.fileName) {
      addText(`Source: ${data.fileName}`, 9, false, [100, 100, 100]);
    }
    
    yPosition += 10;
  }

  // Summary
  if (data.summary) {
    addText('Summary', 14, true, [37, 99, 235]);
    addText(data.summary, 10);
    yPosition += 5;
  }

  // Bullet Points
  if (data.bulletPoints && data.bulletPoints.length > 0) {
    addText('Key Points', 12, true, [37, 99, 235]);
    data.bulletPoints.forEach((point) => {
      addText(`• ${point.replace(/^[-*•]\s*/, '')}`, 10);
    });
    yPosition += 5;
  }

  // Structured Clinical Data
  if (data.clinicalData && options?.includeStructuredData !== false) {
    yPosition += 5;
    addText('Clinical Data', 14, true, [37, 99, 235]);
    
    // Chief Complaint
    if (data.clinicalData.chiefComplaint) {
      addText('Chief Complaint', 11, true);
      addText(data.clinicalData.chiefComplaint, 10);
    }

    // Assessment
    if (data.clinicalData.assessment && data.clinicalData.assessment.length > 0) {
      addText('Assessment', 11, true);
      data.clinicalData.assessment.forEach((item) => {
        let text = item.diagnosis;
        if (item.icd10) {
          text += ` (ICD-10: ${item.icd10})`;
        }
        if (item.confidence !== undefined) {
          text += ` [Confidence: ${item.confidence}%]`;
        }
        addText(`• ${text}`, 10);
      });
    }

    // Plan - Medications
    if (data.clinicalData.plan?.medications && data.clinicalData.plan.medications.length > 0) {
      addText('Medications', 11, true);
      data.clinicalData.plan.medications.forEach((med) => {
        let text = med.name;
        if (med.dosage) text += ` - ${med.dosage}`;
        if (med.frequency) text += ` (${med.frequency})`;
        if (med.rxNorm) text += ` [RxNorm: ${med.rxNorm}]`;
        addText(`• ${text}`, 10);
      });
    }

    // Plan - Lab Orders
    if (data.clinicalData.plan?.labs && data.clinicalData.plan.labs.length > 0) {
      addText('Lab Orders', 11, true);
      data.clinicalData.plan.labs.forEach((lab) => {
        let text = lab.test;
        if (lab.loinc) text += ` [LOINC: ${lab.loinc}]`;
        addText(`• ${text}`, 10);
      });
    }

    // Plan - Follow-up
    if (data.clinicalData.plan?.followUp) {
      addText('Follow-Up Plan', 11, true);
      addText(data.clinicalData.plan.followUp, 10);
    }

    // Quality Metrics
    if (data.clinicalData.qualityMetrics) {
      yPosition += 5;
      addText('Quality Metrics', 11, true);
      addText(`Overall Confidence: ${data.clinicalData.qualityMetrics.overallConfidence}%`, 10);
      addText(`Data Completeness: ${data.clinicalData.qualityMetrics.dataCompleteness}%`, 10);
    }
  }

  // Full Transcript
  if (data.transcript && options?.includeTranscript) {
    yPosition += 10;
    doc.addPage();
    yPosition = margin;
    addText('Full Transcript', 14, true, [37, 99, 235]);
    addText(data.transcript, 9);
  }

  // Footer
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Page ${i} of ${totalPages} | Generated by ChartingAI | ${new Date().toLocaleString()}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
  }

  // Generate filename
  const filename = options?.filename || 
    `encounter_${data.patientName || 'patient'}_${new Date().toISOString().split('T')[0]}.pdf`;

  // Save PDF
  doc.save(filename);
}

/**
 * Export encounter to JSON format
 */
export function exportToJSON(
  data: {
    patientName?: string;
    encounterDate?: string;
    summary?: string;
    bulletPoints?: string[];
    transcript?: string;
    clinicalData?: ClinicalDataExtraction;
    fileName?: string;
  },
  options?: ExportOptions
): void {
  const exportData = {
    metadata: {
      generatedAt: new Date().toISOString(),
      patientName: data.patientName,
      encounterDate: data.encounterDate,
      sourceFile: data.fileName,
    },
    summary: data.summary,
    bulletPoints: data.bulletPoints,
    ...(options?.includeTranscript && { transcript: data.transcript }),
    ...(options?.includeStructuredData && { clinicalData: data.clinicalData }),
  };

  const jsonString = JSON.stringify(exportData, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = options?.filename || `encounter_${data.patientName || 'patient'}_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export encounter to TXT format
 */
export function exportToTXT(
  data: {
    patientName?: string;
    encounterDate?: string;
    summary?: string;
    bulletPoints?: string[];
    transcript?: string;
    clinicalData?: ClinicalDataExtraction;
    fileName?: string;
  },
  options?: ExportOptions
): void {
  let content = '='.repeat(70) + '\n';
  content += 'ChartingAI Medical Report\n';
  content += '='.repeat(70) + '\n\n';

  if (data.patientName || data.encounterDate) {
    content += 'PATIENT INFORMATION\n';
    content += '-'.repeat(70) + '\n';
    if (data.patientName) content += `Patient: ${data.patientName}\n`;
    if (data.encounterDate) content += `Encounter Date: ${data.encounterDate}\n`;
    else content += `Generated: ${new Date().toLocaleDateString()}\n`;
    if (data.fileName) content += `Source: ${data.fileName}\n`;
    content += '\n';
  }

  if (data.summary) {
    content += 'SUMMARY\n';
    content += '-'.repeat(70) + '\n';
    content += data.summary + '\n\n';
  }

  if (data.bulletPoints && data.bulletPoints.length > 0) {
    content += 'KEY POINTS\n';
    content += '-'.repeat(70) + '\n';
    data.bulletPoints.forEach((point) => {
      content += `• ${point.replace(/^[-*•]\s*/, '')}\n`;
    });
    content += '\n';
  }

  if (data.clinicalData && options?.includeStructuredData !== false) {
    content += 'CLINICAL DATA\n';
    content += '-'.repeat(70) + '\n';

    if (data.clinicalData.chiefComplaint) {
      content += `Chief Complaint: ${data.clinicalData.chiefComplaint}\n\n`;
    }

    if (data.clinicalData.assessment && data.clinicalData.assessment.length > 0) {
      content += 'Assessment:\n';
      data.clinicalData.assessment.forEach((item) => {
        content += `  • ${item.diagnosis}`;
        if (item.icd10) content += ` (ICD-10: ${item.icd10})`;
        if (item.confidence !== undefined) content += ` [Confidence: ${item.confidence}%]`;
        content += '\n';
      });
      content += '\n';
    }

    if (data.clinicalData.plan?.medications && data.clinicalData.plan.medications.length > 0) {
      content += 'Medications:\n';
      data.clinicalData.plan.medications.forEach((med) => {
        content += `  • ${med.name}`;
        if (med.dosage) content += ` - ${med.dosage}`;
        if (med.frequency) content += ` (${med.frequency})`;
        content += '\n';
      });
      content += '\n';
    }

    if (data.clinicalData.plan?.followUp) {
      content += `Follow-Up Plan: ${data.clinicalData.plan.followUp}\n\n`;
    }
  }

  if (data.transcript && options?.includeTranscript) {
    content += 'FULL TRANSCRIPT\n';
    content += '-'.repeat(70) + '\n';
    content += data.transcript + '\n\n';
  }

  content += '\n' + '='.repeat(70) + '\n';
  content += `Generated by ChartingAI on ${new Date().toLocaleString()}\n`;
  content += '='.repeat(70) + '\n';

  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = options?.filename || `encounter_${data.patientName || 'patient'}_${new Date().toISOString().split('T')[0]}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

