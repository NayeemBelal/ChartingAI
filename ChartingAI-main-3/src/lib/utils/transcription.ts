/**
 * Transcription and Summarization Utilities
 * 
 * Attempts to use OpenAI APIs if VITE_OPENAI_API_KEY is provided.
 * Falls back to on-device mock implementations for local development.
 */

export interface TranscriptionResult {
  transcript: string;
  durationMs?: number;
}

export interface SummaryResult {
  summary: string;
  bulletPoints: string[];
  // Advanced: Structured clinical data (optional, populated if available)
  clinicalData?: import('@/types').ClinicalDataExtraction;
}

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || "";

/**
 * Transcribe an audio file.
 * - If OPENAI key present: calls OpenAI Whisper endpoint.
 * - Else: returns a mock transcript after a short delay.
 */
export async function transcribeAudio(file: File): Promise<TranscriptionResult> {
  const start = performance.now();

  if (!OPENAI_API_KEY) {
    // Mock transcription for local dev
    await wait(1500);
    return {
      transcript:
        "Patient presents with a three-day history of sore throat, mild fever, and fatigue. " +
        "Denies cough or shortness of breath. No known drug allergies. Vital signs stable. " +
        "Recommend supportive care, hydration, and acetaminophen as needed. Follow-up in 48 hours.",
      durationMs: performance.now() - start,
    };
  }

  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("model", "whisper-1");
    formData.append("response_format", "json");
    // language is optional; leaving it to auto-detect

    const resp = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: formData,
    });

    if (!resp.ok) {
      const text = await resp.text();
      throw new Error(`OpenAI transcription failed: ${resp.status} ${text}`);
    }

    const data = await resp.json();
    // OpenAI returns { text: "..." }
    return {
      transcript: data.text ?? "",
      durationMs: performance.now() - start,
    };
  } catch (err) {
    // Fallback to mock if network/CORS blocks in browser
    console.warn("Transcription fallback in use:", err);
    await wait(1200);
    return {
      transcript:
        "Transcription fallback activated due to network or CORS. " +
        "Example: Patient complains of intermittent chest discomfort over two days, worse with exertion. " +
        "Advised EKG and labs; initiate risk stratification and follow up urgently.",
      durationMs: performance.now() - start,
    };
  }
}

/**
 * Summarize transcript into a concise clinical report.
 * - If OPENAI key present: calls Chat Completions for a structured summary.
 * - Else: simple heuristic summary.
 */
export async function summarizeTranscript(
  transcript: string,
  options?: { extractStructuredData?: boolean }
): Promise<SummaryResult> {
  if (!transcript || transcript.trim().length === 0) {
    return { summary: "No transcript available to summarize.", bulletPoints: [] };
  }

  const extractStructured = options?.extractStructuredData ?? false;

  if (!OPENAI_API_KEY) {
    // Heuristic summarization for local dev
    const sentences = transcript.split(/[.?!]\s+/).filter(Boolean).slice(0, 3);
    const bulletPoints = sentences.slice(0, 4).map((s) => `- ${s.trim()}.`);
    return {
      summary:
        sentences.join(". ") +
        (sentences.length ? "." : ""),
      bulletPoints,
      ...(extractStructured ? { clinicalData: generateMockClinicalData(transcript) } : {}),
    };
  }

  try {
    // First, get basic summary
    const summaryResp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a clinical documentation assistant. Generate a concise, patient-safe summary and 4-6 bullet highlights.",
          },
          {
            role: "user",
            content:
              `Transcription:\n\n${transcript}\n\nProduce:\n1) 2-4 sentence summary in plain language.\n2) 4-6 concise bullet points of key findings/recommendations.`,
          },
        ],
        temperature: 0.2,
      }),
    });

    if (!summaryResp.ok) {
      const text = await summaryResp.text();
      throw new Error(`OpenAI summarization failed: ${summaryResp.status} ${text}`);
    }

    const summaryData = await summaryResp.json();
    const content: string = summaryData.choices?.[0]?.message?.content || "";
    const { summary, bullets } = parseSummary(content);

    let clinicalData: import('@/types').ClinicalDataExtraction | undefined;

    // If structured extraction requested, make a second API call with JSON schema
    if (extractStructured) {
      try {
        const structuredResp = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-4o", // Use more capable model for structured extraction
            messages: [
              {
                role: "system",
                content:
                  "You are a clinical documentation specialist. Extract structured clinical data from medical transcripts. Return ONLY valid JSON matching the ClinicalDataExtraction schema.",
              },
              {
                role: "user",
                content:
                  `Extract structured clinical data from this transcript:\n\n${transcript}\n\nReturn a JSON object with: chiefComplaint, historyOfPresentIllness, reviewOfSystems (object with system arrays), physicalExam (array of {system, findings}), assessment (array of {diagnosis, icd10?, confidence, rationale?}), plan (object with medications[], labs[], procedures[], imaging[], referrals[], followUp, patientInstructions[]), riskFactors (array of {level, description, category}), and qualityMetrics (overallConfidence, sectionsCompleted, missingRecommendedSections, dataCompleteness). Use confidence scores 0-100. Include ICD-10, RxNorm, LOINC, CPT codes when appropriate.`,
              },
            ],
            response_format: { type: "json_object" }, // Requires GPT-4 Turbo or newer
            temperature: 0.1,
          }),
        });

        if (structuredResp.ok) {
          const structuredData = await structuredResp.json();
          const extractedContent = structuredData.choices?.[0]?.message?.content || "{}";
          clinicalData = JSON.parse(extractedContent) as import('@/types').ClinicalDataExtraction;
        } else {
          console.warn("Structured extraction failed, falling back to mock");
          clinicalData = generateMockClinicalData(transcript);
        }
      } catch (structuredErr) {
        console.warn("Structured extraction error:", structuredErr);
        clinicalData = generateMockClinicalData(transcript);
      }
    }

    return {
      summary,
      bulletPoints: bullets,
      ...(clinicalData ? { clinicalData } : {}),
    };
  } catch (err) {
    console.warn("Summarization fallback in use:", err);
    const sentences = transcript.split(/[.?!]\s+/).filter(Boolean).slice(0, 3);
    const bulletPoints = sentences.slice(0, 4).map((s) => `- ${s.trim()}.`);
    return {
      summary:
        sentences.join(". ") +
        (sentences.length ? "." : ""),
      bulletPoints,
      ...(extractStructured ? { clinicalData: generateMockClinicalData(transcript) } : {}),
    };
  }
}

function parseSummary(content: string): { summary: string; bullets: string[] } {
  if (!content) return { summary: "", bullets: [] };
  // Try to split into summary and bullets if formatted
  const lines = content.split("\n").map((l) => l.trim()).filter(Boolean);
  const bulletLines = lines.filter((l) => /^[-*•]/.test(l));
  const nonBullet = lines.filter((l) => !/^[-*•]/.test(l));
  const summary = nonBullet.join(" ").trim();
  const bullets = bulletLines.map((l) => l.replace(/^[-*•]\s?/, "").trim());
  return { summary, bullets };
}

function wait(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

/**
 * Generate mock structured clinical data for development/testing.
 * In production, this would come from the AI extraction.
 */
function generateMockClinicalData(transcript: string): import('@/types').ClinicalDataExtraction {
  const lower = transcript.toLowerCase();
  const hasFever = /fever|temperature|temp/i.test(lower);
  const hasThroat = /throat|sore|pharyng/i.test(lower);
  const hasChest = /chest|cardiac|heart/i.test(lower);
  const hasPain = /pain|ache|discomfort/i.test(lower);

  return {
    chiefComplaint: hasThroat
      ? "Sore throat and fatigue"
      : hasChest
      ? "Chest discomfort"
      : "General consultation",
    historyOfPresentIllness:
      "Patient reports symptoms as described in transcript. Details extracted from clinical conversation.",
    reviewOfSystems: {
      constitutional: hasFever ? ["Fever reported"] : ["Afebrile", "No constitutional symptoms"],
      heent: hasThroat ? ["Sore throat", "Pharyngeal erythema"] : ["No heent complaints"],
      cardiovascular: hasChest ? ["Chest discomfort noted"] : ["No cardiovascular symptoms"],
      respiratory: ["No dyspnea", "No cough"],
      gastrointestinal: ["No GI complaints"],
      genitourinary: ["No GU complaints"],
      musculoskeletal: ["No musculoskeletal complaints"],
      neurological: ["No neurological complaints"],
      psychiatric: ["Alert and oriented"],
    },
    physicalExam: [
      {
        system: "General",
        findings: ["Patient in no acute distress", "Vital signs stable"],
      },
      {
        system: "HEENT",
        findings: hasThroat ? ["Pharyngeal erythema"] : ["Normal"],
      },
    ],
    assessment: [
      {
        diagnosis: hasThroat ? "Viral pharyngitis" : "General consultation",
        icd10: hasThroat ? "J02.9" : undefined,
        confidence: 85,
        rationale: "Based on clinical presentation and examination findings",
      },
    ],
    plan: {
      medications: [
        {
          name: "Acetaminophen",
          dosage: "500-1000mg",
          frequency: "Every 4-6 hours as needed",
          route: "Oral",
          rxNorm: "161",
        },
      ],
      labs: [],
      procedures: [],
      imaging: [],
      referrals: [],
      followUp: "Follow up in 48 hours if symptoms persist or worsen",
      patientInstructions: [
        "Maintain adequate hydration",
        "Rest as needed",
        "Return if high fever, difficulty breathing, or worsening symptoms",
      ],
    },
    riskFactors: [],
    qualityMetrics: {
      overallConfidence: 78,
      sectionsCompleted: ["Chief Complaint", "History", "Assessment", "Plan"],
      missingRecommendedSections: ["Allergies", "Past Medical History"],
      dataCompleteness: 75,
    },
  };
}



