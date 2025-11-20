import * as Tabs from "@radix-ui/react-tabs";
import { useRef, useState } from "react";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Upload, FileText, Mic } from "lucide-react";
import { motion } from "framer-motion";
import { transcribeAudio as mockTranscribe, generateVisitSummaryReport, generateVisitSummaryReportFromText } from "@/lib/mock";
import { transcribeAudio, summarizeTranscript } from "@/lib/utils/transcription";
import type { VisitSummaryReport } from "@/types";

export default function TranscriptTools() {
  const [activeTab, setActiveTab] = useState<"audio" | "transcript">("audio");

  // Audio tab state
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isProcessingAudio, setIsProcessingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioReport, setAudioReport] = useState<VisitSummaryReport | null>(null);
  const [audioTranscript, setAudioTranscript] = useState<string>("");
  const [error, setError] = useState<string>("");

  // Transcript tab state
  const [transcriptText, setTranscriptText] = useState("");
  const [isProcessingText, setIsProcessingText] = useState(false);
  const [textReport, setTextReport] = useState<VisitSummaryReport | null>(null);

  function browseAudio() {
    fileInputRef.current?.click();
  }

  function onAudioSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    if (!file) return;
    const ext = (file.name.split(".").pop() || "").toLowerCase();
    if (!["mp3", "wav", "m4a"].includes(ext)) {
      setError("Unsupported file type. Please upload .mp3, .wav, or .m4a");
      setAudioFile(null);
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      setError("File is larger than 25 MB.");
      setAudioFile(null);
      return;
    }
    setError("");
    setAudioFile(file);
    setAudioReport(null);
    setAudioTranscript("");
  }

  async function handleTranscribeAndSummarize() {
    if (!audioFile) return;
    setIsProcessingAudio(true);
    setAudioProgress(10);
    setAudioReport(null);
    setAudioTranscript("");
    try {
      // Mock progress
      setAudioProgress(25);
      // Prefer real transcription; fallback to mock on failure
      let transcriptText = "";
      try {
        const real = await transcribeAudio(audioFile);
        transcriptText = real.transcript;
      } catch {
        const turns = await mockTranscribe(audioFile);
        transcriptText = turns.map(t => `${t.speaker}: ${t.text}`).join("\n");
      }
      setAudioProgress(65);
      // Real summarization (fallback to heuristic via mock generator if needed)
      let report: VisitSummaryReport | null = null;
      try {
        const s = await summarizeTranscript(transcriptText);
        report = {
          chiefComplaint: "Generated from transcript",
          summary: s.summary,
          keyFindings: s.bulletPoints.slice(0, 3),
          suspectedDiagnoses: s.bulletPoints.slice(3, 5),
          medicationsDiscussed: [],
          followUpPlan: "Follow clinician guidance based on findings.",
          riskFlags: [],
        };
      } catch {
        report = generateVisitSummaryReportFromText(transcriptText);
      }
      setAudioProgress(90);
      setAudioReport(report);
      setAudioTranscript(transcriptText);
      setAudioProgress(100);
    } catch (e: any) {
      setError(e?.message || "Failed to process audio");
    } finally {
      setTimeout(() => setIsProcessingAudio(false), 400);
    }
  }

  async function handleTranscriptFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".txt")) {
      setError("Please upload a .txt file for transcript text");
      return;
    }
    const text = await file.text();
    setTranscriptText(text);
  }

  async function handleSummarizeText() {
    if (!transcriptText.trim()) return;
    setIsProcessingText(true);
    setTextReport(null);
    try {
      // Prefer OpenAI summarization; fallback to mock generator
      let report: VisitSummaryReport | null = null;
      try {
        const s = await summarizeTranscript(transcriptText);
        report = {
          chiefComplaint: "Generated from transcript",
          summary: s.summary,
          keyFindings: s.bulletPoints.slice(0, 3),
          suspectedDiagnoses: s.bulletPoints.slice(3, 5),
          medicationsDiscussed: [],
          followUpPlan: "Follow clinician guidance based on findings.",
          riskFlags: [],
        };
      } catch {
        report = generateVisitSummaryReportFromText(transcriptText);
      }
      setTextReport(report);
    } catch (e: any) {
      setError(e?.message || "Failed to analyze transcript");
    } finally {
      setIsProcessingText(false);
    }
  }

  return (
    <>
      <Helmet>
        <title>Visit Summary from Audio or Transcript</title>
      </Helmet>
      <div className="min-h-screen bg-neutral-50 dark:bg-black px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white">
              Visit Summary from Audio or Transcript
            </h1>
            <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-400 font-light mt-2">
              Upload audio for auto-transcription, or paste/upload an existing transcript and we’ll summarize the visit.
            </p>
          </div>

          <Tabs.Root value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
            <Tabs.List className="inline-flex gap-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black p-1 shadow-apple">
              <Tabs.Trigger value="audio" className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === "audio" ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100" : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100/60 dark:hover:bg-neutral-900/60"}`}>
                Audio to Summary
              </Tabs.Trigger>
              <Tabs.Trigger value="transcript" className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === "transcript" ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100" : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100/60 dark:hover:bg-neutral-900/60"}`}>
                Transcript to Summary
              </Tabs.Trigger>
            </Tabs.List>

            <div className="mt-6">
              <Tabs.Content value="audio">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-black border border-neutral-200/50 dark:border-neutral-800/50 shadow-apple-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center">
                        <Mic className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Upload Audio</h2>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400 font-light">
                          .mp3, .wav, .m4a • Max 25 MB
                        </p>
                      </div>
                    </div>
                    <div
                      onClick={browseAudio}
                      className="w-full rounded-xl border-2 border-dashed border-neutral-300 dark:border-neutral-800 bg-neutral-50/50 dark:bg-black/50 hover:bg-neutral-50 dark:hover:bg-black/70 transition-all cursor-pointer p-10 flex flex-col items-center justify-center text-center"
                    >
                      <input ref={fileInputRef} type="file" accept=".mp3,.wav,.m4a,audio/*" className="hidden" onChange={onAudioSelected} />
                      {audioFile ? (
                        <>
                          <div className="w-14 h-14 rounded-full bg-green-50 dark:bg-green-950/40 border-2 border-green-200 dark:border-green-900/40 flex items-center justify-center mb-3">
                            <Upload className="w-7 h-7 text-green-600 dark:text-green-400" />
                          </div>
                          <div className="text-sm font-semibold text-neutral-900 dark:text-white">{audioFile.name}</div>
                          <div className="text-xs text-neutral-600 dark:text-neutral-400 font-light">
                            {(audioFile.size / (1024 * 1024)).toFixed(2)} MB • Supports up to ~30 minutes of consultation audio (64–128 kbps mono).
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-14 h-14 rounded-full bg-neutral-100 dark:bg-neutral-800 border-2 border-neutral-200 dark:border-neutral-700 flex items-center justify-center mb-3">
                            <Upload className="w-7 h-7 text-neutral-400 dark:text-neutral-500" />
                          </div>
                          <div className="text-sm font-semibold text-neutral-900 dark:text-white">Drag & drop audio, or click to browse</div>
                          <div className="text-xs text-neutral-600 dark:text-neutral-400 font-light">Supports up to ~30 minutes of consultation audio (64–128 kbps mono).</div>
                        </>
                      )}
                    </div>

                    <div className="mt-4 flex items-center gap-3">
                      <Button onClick={handleTranscribeAndSummarize} disabled={!audioFile || isProcessingAudio} className="h-11 px-6 text-sm font-semibold rounded-xl">
                        Transcribe & Summarize
                      </Button>
                      {isProcessingAudio && (
                        <div className="flex-1">
                          <Progress value={audioProgress} />
                          <p className="text-xs text-neutral-600 dark:text-neutral-400 font-light mt-1">
                            Transcribing audio and generating visit summary…
                          </p>
                        </div>
                      )}
                    </div>

                    {error && (
                      <p className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</p>
                    )}
                  </div>

                  <div className="p-6 rounded-2xl bg-white dark:bg-black border border-neutral-200/50 dark:border-neutral-800/50 shadow-apple-lg">
                    <SummaryCard report={audioReport} />
                  </div>
                </div>

                {audioTranscript && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 p-6 rounded-2xl bg-white dark:bg-black border border-neutral-200/50 dark:border-neutral-800/50 shadow-apple-lg">
                    <h3 className="text-base font-semibold text-neutral-900 dark:text-white mb-2">Transcript</h3>
                    <Separator className="dark:bg-neutral-800 mb-4" />
                    <pre className="whitespace-pre-wrap text-sm text-neutral-800 dark:text-neutral-200 font-light leading-relaxed">{audioTranscript}</pre>
                  </motion.div>
                )}
              </Tabs.Content>

              <Tabs.Content value="transcript">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-black border border-neutral-200/50 dark:border-neutral-800/50 shadow-apple-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center">
                          <FileText className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                        </div>
                        <div>
                          <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Transcript Text</h2>
                          <p className="text-xs text-neutral-600 dark:text-neutral-400 font-light">
                            Paste the consultation transcript here or upload a .txt file.
                          </p>
                        </div>
                      </div>
                      <input type="file" accept=".txt,text/plain" onChange={handleTranscriptFile} className="text-sm text-neutral-600 dark:text-neutral-300" />
                    </div>

                    <textarea
                      value={transcriptText}
                      onChange={(e) => setTranscriptText(e.target.value)}
                      placeholder="Paste the consultation transcript here or upload a .txt file."
                      className="w-full min-h-[220px] rounded-xl border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-black p-4 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:focus-visible:ring-blue-500"
                    />

                    <div className="mt-4">
                      <Button onClick={handleSummarizeText} disabled={!transcriptText.trim() || isProcessingText} className="h-11 px-6 text-sm font-semibold rounded-xl">
                        Summarize Transcript
                      </Button>
                      {isProcessingText && (
                        <p className="text-xs text-neutral-600 dark:text-neutral-400 font-light mt-2">
                          Analyzing transcript and generating visit summary…
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-white dark:bg-black border border-neutral-200/50 dark:border-neutral-800/50 shadow-apple-lg">
                    <SummaryCard report={textReport} />
                  </div>
                </div>
              </Tabs.Content>
            </div>
          </Tabs.Root>
        </div>
      </div>
    </>
  );
}

function SummaryCard({ report }: { report: VisitSummaryReport | null }) {
  if (!report) {
    return (
      <div className="text-sm text-neutral-600 dark:text-neutral-400 font-light">
        The AI Visit Summary will appear here after processing.
      </div>
    );
  }
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">Chief complaint</h3>
        <p className="text-sm text-neutral-800 dark:text-neutral-200 font-light leading-relaxed">{report.chiefComplaint}</p>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">Summary</h3>
        <p className="text-sm text-neutral-800 dark:text-neutral-200 font-light leading-relaxed">{report.summary}</p>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">Key findings</h3>
        <ul className="list-disc pl-5 space-y-1 text-sm text-neutral-800 dark:text-neutral-200">
          {report.keyFindings.map((k, i) => <li key={i} className="font-light">{k}</li>)}
        </ul>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">Suspected diagnoses</h3>
        <ul className="list-disc pl-5 space-y-1 text-sm text-neutral-800 dark:text-neutral-200">
          {report.suspectedDiagnoses.map((k, i) => <li key={i} className="font-light">{k}</li>)}
        </ul>
      </div>

      {report.medicationsDiscussed.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">Medications discussed</h3>
          <ul className="list-disc pl-5 space-y-1 text-sm text-neutral-800 dark:text-neutral-200">
            {report.medicationsDiscussed.map((k, i) => <li key={i} className="font-light">{k}</li>)}
          </ul>
        </div>
      )}

      <div>
        <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">Follow-up plan</h3>
        <p className="text-sm text-neutral-800 dark:text-neutral-200 font-light leading-relaxed">{report.followUpPlan}</p>
      </div>

      {report.riskFlags.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-red-600 dark:text-red-400">Risk flags</h3>
          <ul className="list-disc pl-5 space-y-1 text-sm text-neutral-800 dark:text-neutral-200">
            {report.riskFlags.map((k, i) => <li key={i} className="font-light">{k}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}


