import type { TranscriptTurn, VisitSummaryReport } from "@/types";

export async function transcribeAudio(file: File): Promise<TranscriptTurn[]> {
  // Simulate work
  await wait(1200);
  const sizeMb = file.size / (1024 * 1024);
  if (sizeMb > 25) {
    throw new Error("File exceeds 25 MB limit");
  }
  const ext = (file.name.split(".").pop() || "").toLowerCase();
  if (!["mp3", "wav", "m4a"].includes(ext)) {
    throw new Error("Unsupported file type. Please upload .mp3, .wav, or .m4a");
  }
  return [
    { speaker: "Clinician", text: "Good morning, what brings you in today?" },
    { speaker: "Patient", text: "I've had a sore throat and mild fever for three days." },
    { speaker: "Clinician", text: "Any cough, shortness of breath, or chest pain?" },
    { speaker: "Patient", text: "No cough or shortness of breath. Mostly fatigue and throat pain." },
    { speaker: "Clinician", text: "We'll do a quick exam. Vitals are stable. Let's discuss care plan." },
  ];
}

export function generateVisitSummaryReport(transcript: TranscriptTurn[]): VisitSummaryReport {
  // Generate a deterministic mock based on content
  const text = transcript.map(t => t.text).join(" ");
  const mentionsFever = /fever/i.test(text);
  const mentionsThroat = /throat/i.test(text);

  return {
    chiefComplaint: mentionsThroat ? "Sore throat and fatigue" : "General consultation",
    summary:
      "Patient reports three-day history of sore throat and low-grade fever without cough or dyspnea. " +
      "Physical exam stable; supportive care recommended including hydration and antipyretics. " +
      "Return precautions discussed with follow-up in 48 hours if symptoms persist or worsen.",
    keyFindings: [
      "3-day symptom duration",
      mentionsFever ? "Low-grade fever reported" : "Afebrile",
      mentionsThroat ? "Pharyngitis symptoms without cough" : "No airway symptoms reported",
      "Vitals within normal limits",
    ],
    suspectedDiagnoses: [
      "Viral pharyngitis",
      "Less likely: streptococcal pharyngitis",
    ],
    medicationsDiscussed: [
      "Acetaminophen as needed",
      "Salt water gargles; warm fluids",
    ],
    followUpPlan:
      "Supportive care. Follow up in 48 hours or sooner if high fever, breathing difficulty, or worsening pain.",
    riskFlags: [],
  };
}

export function generateVisitSummaryReportFromText(text: string): VisitSummaryReport {
  const transcript: TranscriptTurn[] = text
    .split(/\n+/)
    .map(l => l.trim())
    .filter(Boolean)
    .map((line, i) => ({
      speaker: i % 2 === 0 ? "Clinician" : "Patient",
      text: line,
    }));
  return generateVisitSummaryReport(transcript);
}

function wait(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}



