import { useNavigate } from "react-router-dom";
import { Mic, ChevronRight, CheckCircle, Upload, FileText, Clock, TrendingUp, Shield, ArrowLeft, Loader2 } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { openGoogleDrivePicker, openDropboxChooser, downloadCloudFile, type CloudFile } from "@/lib/utils/cloudStorage";
import { toast } from "sonner";
import { transcribeAudio, summarizeTranscript } from "@/lib/utils/transcription";
import { GoogleDrivePicker, type DriveFile } from "@/components/google-drive-picker";
import { AudioRecorderDialog } from "@/components/AudioRecorderDialog";
import type { VisitSummaryReport } from "@/types";

export default function ChartingAIDashboardPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedCloudFile, setSelectedCloudFile] = useState<CloudFile | null>(null);
  const [isLoadingCloudFile, setIsLoadingCloudFile] = useState(false);
  // Transcript-to-summary inline option
  const [transcriptText, setTranscriptText] = useState("");
  const [isProcessingText, setIsProcessingText] = useState(false);
  const [textError, setTextError] = useState("");
  const [isDriveOpen, setIsDriveOpen] = useState(false);
  const [isRecordingDialogOpen, setIsRecordingDialogOpen] = useState(false);

  // Mock enterprise metrics
  const metrics = [
    { label: "Total Encounters", value: "1,247", change: "+12%", trend: "up" },
    { label: "Avg. Processing Time", value: "2.3 min", change: "-18%", trend: "down" },
    { label: "Accuracy Rate", value: "99.2%", change: "+0.4%", trend: "up" },
    { label: "Time Saved", value: "847 hrs", change: "+23%", trend: "up" },
  ];

  // Mock recent encounters
  const recent = [
    {
      id: "enc_1342",
      patient: "Jane Doe",
      mrn: "MRN-89234",
      status: "Draft generated",
      tone: "draft" as const,
      updated: "2 min ago",
      duration: "12:34",
    },
    {
      id: "enc_1341",
      patient: "John Smith",
      mrn: "MRN-89123",
      status: "Finalized",
      tone: "finalized" as const,
      updated: "Today 10:14 AM",
      duration: "15:22",
    },
    {
      id: "enc_1340",
      patient: "Sarah Johnson",
      mrn: "MRN-89012",
      status: "Finalized",
      tone: "finalized" as const,
      updated: "Today 9:45 AM",
      duration: "18:45",
    },
  ];

  // Check if cloud storage SDKs are loaded
  useEffect(() => {
    // Wait for Google APIs to load
    const checkGoogleAPIs = setInterval(() => {
      if (window.gapi && window.google) {
        clearInterval(checkGoogleAPIs);
      }
    }, 100);

    // Cleanup after 10 seconds
    setTimeout(() => clearInterval(checkGoogleAPIs), 10000);

    return () => clearInterval(checkGoogleAPIs);
  }, []);

  async function handleSubmit() {
    if (!selectedFile && !selectedCloudFile) {
      toast.error("Please select a file to upload");
      return;
    }
    try {
      toast.info("Transcribing audio...");
      // Prefer the downloaded local File if present
      let fileToTranscribe = selectedFile;
      if (!fileToTranscribe && selectedCloudFile) {
        // As a safety, download again if not already set
        fileToTranscribe = await downloadCloudFile(selectedCloudFile);
      }
      if (!fileToTranscribe) {
        toast.error("No file available to transcribe");
        return;
      }

      let transcription = await transcribeAudio(fileToTranscribe);
      toast.success("Transcription complete. Summarizing...");

      // Extract structured clinical data for advanced features
      const summary = await summarizeTranscript(transcription.transcript, { extractStructuredData: true });
      toast.success("Summary generated");

      navigate("/success", {
        state: {
          transcript: transcription.transcript,
          summary: summary.summary,
          bulletPoints: summary.bulletPoints,
          fileName: fileToTranscribe.name,
          clinicalData: summary.clinicalData, // Pass structured data
        },
      });
    } catch (error) {
      console.error("Transcription/Summarization error:", error);
      // Fallback to mock transcription if real route fails (e.g. dummy Drive audio)
      try {
        const { transcribeAudio: mockTranscribe } = await import("@/lib/mock");
        const turns = await mockTranscribe(selectedFile as File);
        const transcriptText = turns.map((t) => `${t.speaker}: ${t.text}`).join("\n");
        const summary = await summarizeTranscript(transcriptText, { extractStructuredData: true });
        navigate("/success", {
          state: {
            transcript: transcriptText,
            summary: summary.summary,
            bulletPoints: summary.bulletPoints,
            fileName: (selectedFile && selectedFile.name) || "Imported audio",
            clinicalData: summary.clinicalData, // Pass structured data
          },
        });
      } catch (fallbackErr) {
        console.error("Fallback transcription failed:", fallbackErr);
        toast.error("Failed to process audio. Please try again.");
      }
    }
  }

  function handleRecord() {
    setIsRecordingDialogOpen(true);
  }

  function handleRecordingComplete(file: File) {
    setSelectedFile(file);
    setSelectedCloudFile(null);
    toast.success(`Recording saved: ${file.name}`);
  }

  async function handleGoogleDrive() {
    try {
      setIsLoadingCloudFile(true);
      await openGoogleDrivePicker(
        async (file: CloudFile) => {
          try {
            setSelectedCloudFile(file);
            toast.success(`Selected: ${file.name}`);
            
            // Download the file
            const downloadedFile = await downloadCloudFile(file);
            setSelectedFile(downloadedFile);
            toast.success("File downloaded successfully");
          } catch (error) {
            console.error("Error downloading file:", error);
            toast.error("Failed to download file. Please try again.");
          } finally {
            setIsLoadingCloudFile(false);
          }
        },
        (error: Error) => {
          console.error("Google Drive error:", error);
          toast.error(error.message || "Failed to open Google Drive");
          setIsLoadingCloudFile(false);
        }
      );
    } catch (error) {
      console.error("Error opening Google Drive:", error);
      toast.error("Failed to open Google Drive. Please check your API configuration.");
      setIsLoadingCloudFile(false);
    }
  }

  async function handleDropbox() {
    try {
      setIsLoadingCloudFile(true);
      await openDropboxChooser(
        async (file: CloudFile) => {
          try {
            setSelectedCloudFile(file);
            toast.success(`Selected: ${file.name}`);
            
            // Download the file
            const downloadedFile = await downloadCloudFile(file);
            setSelectedFile(downloadedFile);
            toast.success("File downloaded successfully");
          } catch (error) {
            console.error("Error downloading file:", error);
            toast.error("Failed to download file. Please try again.");
          } finally {
            setIsLoadingCloudFile(false);
          }
        },
        (error: Error) => {
          console.error("Dropbox error:", error);
          toast.error(error.message || "Failed to open Dropbox");
          setIsLoadingCloudFile(false);
        }
      );
    } catch (error) {
      console.error("Error opening Dropbox:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to open Dropbox. Please check your API configuration.";
      toast.error(errorMessage);
      setIsLoadingCloudFile(false);
    }
  }

  function handleOpenEncounter(enc: (typeof recent)[number]) {
    navigate("/success");
  }

  function triggerFileBrowse() {
    fileInputRef.current?.click();
  }

  function onFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  }

  async function handleTranscriptFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".txt")) {
      setTextError("Please upload a .txt file");
      return;
    }
    setTextError("");
    const text = await file.text();
    setTranscriptText(text);
  }

  async function handleSummarizeTranscript() {
    if (!transcriptText.trim()) {
      setTextError("Please paste transcript text or upload a .txt file");
      return;
    }
    setIsProcessingText(true);
    try {
      const result = await summarizeTranscript(transcriptText, { extractStructuredData: true });
      navigate("/success", {
        state: {
          transcript: transcriptText,
          summary: result.summary,
          bulletPoints: result.bulletPoints,
          fileName: "Transcript text",
          clinicalData: result.clinicalData, // Pass structured data
        },
      });
    } catch (e: any) {
      setTextError(e?.message || "Failed to summarize transcript");
    } finally {
      setIsProcessingText(false);
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-black flex flex-col">
      {/* Enterprise Header */}
      <header className="w-full border-b border-neutral-200/50 dark:border-neutral-800/50 bg-white/80 dark:bg-black/80 backdrop-blur-xl sticky top-0 z-40 shadow-apple">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/marketplace-new")}
              className="text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100/50 dark:hover:bg-neutral-800/50 h-9 px-3 rounded-lg"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Marketplace
            </Button>
            <div className="h-6 w-px bg-neutral-200 dark:bg-neutral-800" />
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-neutral-900 dark:text-white">
              AI Medical Charting Agent
            </h1>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 font-light mt-0.5">
                Enterprise Dashboard
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={() => navigate("/profile")}
              className="h-9 px-3 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100/50 dark:hover:bg-neutral-800/50 rounded-lg"
            >
              <div className="w-7 h-7 rounded-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs font-medium text-neutral-700 dark:text-neutral-300 flex items-center justify-center mr-2">
                DR
              </div>
              Profile
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Enterprise Metrics */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-6 rounded-2xl bg-white dark:bg-black border border-neutral-200/50 dark:border-neutral-800/50 shadow-apple hover:shadow-apple-lg transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">{metric.label}</p>
                <TrendingUp className={`w-4 h-4 ${metric.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'}`} />
              </div>
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-semibold text-neutral-900 dark:text-white">{metric.value}</h3>
                <span className={`text-xs font-medium ${metric.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'}`}>
                  {metric.change}
                </span>
              </div>
            </motion.div>
          ))}
        </section>

        {/* Upload Section */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Upload Card */}
          <div className="lg:col-span-2 p-8 rounded-2xl bg-white dark:bg-black border border-neutral-200/50 dark:border-neutral-800/50 shadow-apple-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border border-blue-200/50 dark:border-blue-900/50 flex items-center justify-center">
                <Mic className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-neutral-900 dark:text-white tracking-tight">
                  Upload Audio File
                </h2>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 font-light">
                  Accepted formats: .wav, .mp3 | Max size 100 MB
                </p>
              </div>
            </div>

            {/* Drop Zone */}
            <div
              onClick={triggerFileBrowse}
              className="w-full rounded-xl border-2 border-dashed border-neutral-300 dark:border-neutral-800 bg-neutral-50/50 dark:bg-black/50 hover:bg-neutral-50 dark:hover:bg-black/70 hover:border-blue-400 dark:hover:border-blue-700 transition-all cursor-pointer p-12 flex flex-col items-center justify-center text-center mb-6"
            >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".wav,.mp3,audio/*"
                      className="hidden"
                      onChange={onFileSelected}
                    />

              {selectedFile || selectedCloudFile ? (
                <>
                  <div className="w-16 h-16 rounded-full bg-green-50 dark:bg-green-950/50 border-2 border-green-200 dark:border-green-900/50 flex items-center justify-center mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="text-base font-semibold text-neutral-900 dark:text-white mb-1">
                    {selectedFile?.name || selectedCloudFile?.name}
                  </div>
                  <div className="text-sm text-neutral-600 dark:text-neutral-400 font-light">
                    {selectedFile 
                      ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready to transcribe`
                      : selectedCloudFile
                      ? `${selectedCloudFile.provider === 'google' ? 'Google Drive' : 'Dropbox'} • Ready to transcribe`
                      : 'Ready to transcribe'}
                  </div>
                  {selectedCloudFile && (
                    <div className="mt-2 text-xs text-blue-600 dark:text-blue-400 font-medium">
                      From {selectedCloudFile.provider === 'google' ? 'Google Drive' : 'Dropbox'}
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-800 border-2 border-neutral-200 dark:border-neutral-700 flex items-center justify-center mb-4">
                    <Upload className="w-8 h-8 text-neutral-400 dark:text-neutral-500" />
                  </div>
                  <div className="text-base font-semibold text-neutral-900 dark:text-white mb-2">
                    Drop your audio file here or click to browse
                  </div>
                  <div className="text-sm text-neutral-600 dark:text-neutral-400 font-light">
                    Supports .wav and .mp3 files
                  </div>
                  </>
                )}
              </div>

            {/* Upload Options */}
            <div className="mb-6">
              <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">
                Or upload from:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <Button
                  variant="outline"
                  onClick={handleGoogleDrive}
                  disabled={isLoadingCloudFile}
                  className="h-11 text-sm font-medium border-neutral-300 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl flex items-center justify-center gap-2 text-neutral-900 dark:text-neutral-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoadingCloudFile ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <GoogleDriveIcon className="w-5 h-5" />
                  )}
                  Google Drive
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsDriveOpen(true)}
                  className="h-11 text-sm font-medium border-neutral-300 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl flex items-center justify-center gap-2 text-neutral-900 dark:text-neutral-100 transition-all"
                >
                  <GoogleDriveIcon className="w-5 h-5" />
                  Import from Google Drive
                </Button>
                <Button
                  variant="outline"
                  onClick={handleDropbox}
                  disabled={isLoadingCloudFile}
                  className="h-11 text-sm font-medium border-neutral-300 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl flex items-center justify-center gap-2 text-neutral-900 dark:text-neutral-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoadingCloudFile ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <DropboxIcon className="w-5 h-5" />
                  )}
                  Dropbox
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleSubmit}
                disabled={!selectedFile && !selectedCloudFile}
                className="flex-1 h-11 text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-apple rounded-xl transition-all disabled:opacity-50"
              >
                Submit for Transcription
                <ChevronRight className="ml-2 w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                onClick={handleRecord}
                className="h-11 px-6 text-base font-medium border-neutral-300 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl flex items-center gap-2 text-neutral-900 dark:text-neutral-100"
              >
                <Mic className="w-4 h-4" />
                Record Audio
              </Button>
            </div>
          </div>

          {/* Sidebar Cards */}
          <div className="flex flex-col gap-6">
            {/* Mock Google Drive Picker mount */}
            <GoogleDrivePicker
              open={isDriveOpen}
              onOpenChange={setIsDriveOpen}
              onSelect={(file: DriveFile) => {
                if (file.type === "audio") {
                  // Create a tiny dummy audio blob so the UI shows a file; submission has fallback
                  const dummy = new File([new Uint8Array([0])], file.name, { type: file.mimeType });
                  setSelectedFile(dummy);
                  setSelectedCloudFile(null);
                  toast.success(`Imported audio: ${file.name}`);
                } else {
                  // Load sample into transcript textarea
                  import("@/lib/sampleTranscripts").then(mod => {
                    const text = mod.sampleTranscriptForName(file.name) || "Sample transcript text loaded from Drive mock.";
                    setTranscriptText(text);
                    toast.success(`Imported transcript: ${file.name}`);
                  });
                }
              }}
            />
            {/* Transcript to Summary (inline option) */}
            <div className="p-6 rounded-2xl bg-white dark:bg-black border border-neutral-200/50 dark:border-neutral-800/50 shadow-apple">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-3 tracking-tight">
                Transcript to Summary
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 font-light mb-3">
                Paste transcript text or upload a .txt file to generate an AI visit summary.
              </p>
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs text-neutral-600 dark:text-neutral-400 font-light">
                  .txt file upload will auto-fill the textbox
                </div>
                <input
                  type="file"
                  accept=".txt,text/plain"
                  onChange={handleTranscriptFile}
                  className="text-sm text-neutral-600 dark:text-neutral-300"
                />
              </div>
              <div className="mb-2">
                <Button variant="outline" onClick={() => setIsDriveOpen(true)} className="h-9 text-sm">
                  <GoogleDriveIcon className="w-4 h-4 mr-2" />
                  Import from Google Drive
                </Button>
              </div>
              <textarea
                value={transcriptText}
                onChange={(e) => setTranscriptText(e.target.value)}
                placeholder="Paste the consultation transcript here or upload a .txt file."
                className="w-full min-h-[160px] rounded-xl border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-black p-3 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:focus-visible:ring-blue-500"
              />
              <div className="mt-3">
                <Button
                  onClick={handleSummarizeTranscript}
                  disabled={!transcriptText.trim() || isProcessingText}
                  className="w-full h-10 text-sm font-semibold rounded-xl"
                >
                  {isProcessingText ? "Processing…" : "Summarize Transcript"}
                </Button>
                {textError && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-2">{textError}</p>
                )}
              </div>
            </div>
            {/* How It Works */}
            <div className="p-6 rounded-2xl bg-white dark:bg-black border border-neutral-200/50 dark:border-neutral-800/50 shadow-apple">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4 tracking-tight">
                How It Works
              </h3>
              <ol className="space-y-4">
                {[
                  { step: "Upload", desc: "Audio file" },
                  { step: "Transcribe", desc: "AI processing" },
                  { step: "Review", desc: "Generated charts" },
                  { step: "Finalize", desc: "Approve & save" },
                ].map((item, idx) => (
                  <li key={item.step} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/50 border border-blue-200/50 dark:border-blue-900/50 flex items-center justify-center text-sm font-semibold text-blue-600 dark:text-blue-400 flex-shrink-0">
                          {idx + 1}
                        </div>
                    <div>
                      <div className="text-sm font-medium text-neutral-900 dark:text-white">{item.step}</div>
                      <div className="text-xs text-neutral-600 dark:text-neutral-400 font-light">{item.desc}</div>
                      </div>
                    {idx < 3 && (
                      <ChevronRight className="w-4 h-4 text-neutral-400 dark:text-neutral-600 ml-auto" />
                    )}
                    </li>
                ))}
              </ol>
            </div>

            {/* Enterprise Features */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950 dark:to-blue-900/50 border border-blue-200/50 dark:border-blue-900/50 shadow-apple">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4 tracking-tight flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Enterprise Features
              </h3>
              <ul className="space-y-3 text-sm text-neutral-700 dark:text-neutral-300">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <span className="font-light">HIPAA compliant</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <span className="font-light">99.2% accuracy rate</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <span className="font-light">Real-time processing</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <span className="font-light">Enterprise support</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Recent Encounters */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-white tracking-tight">
                Recent Encounters
              </h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 font-light mt-1">
                Manage and review your patient encounters
              </p>
            </div>
            <Button
              variant="outline"
              className="h-9 px-4 text-sm font-medium border-neutral-300 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-lg text-neutral-900 dark:text-neutral-100"
            >
              View All
              <ChevronRight className="ml-2 w-4 h-4" />
            </Button>
          </div>

          <div className="grid gap-4">
            {recent.map((enc, index) => (
              <EncounterRow
                key={enc.id}
                encounter={enc}
                index={index}
                onOpen={() => handleOpenEncounter(enc)}
              />
            ))}
          </div>
        </section>
      </main>

      {/* Audio Recorder Dialog */}
      <AudioRecorderDialog
        open={isRecordingDialogOpen}
        onOpenChange={setIsRecordingDialogOpen}
        onRecordingComplete={handleRecordingComplete}
      />
    </div>
  );
}

/* Encounter Row Component */
function EncounterRow({
  encounter,
  index,
  onOpen,
}: {
  encounter: {
    id: string;
  patient: string;
    mrn: string;
  status: string;
  tone: "draft" | "finalized";
    updated: string;
    duration: string;
  };
  index: number;
  onOpen: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="p-6 rounded-2xl bg-white dark:bg-black border border-neutral-200/50 dark:border-neutral-800/50 shadow-apple hover:shadow-apple-lg transition-all flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
    >
      <div className="flex items-center gap-4 flex-1">
        <div className="w-12 h-12 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center flex-shrink-0">
          <FileText className="w-6 h-6 text-neutral-600 dark:text-neutral-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
              {encounter.patient}
            </h3>
            <StatusPill tone={encounter.tone} label={encounter.status} />
          </div>
          <div className="flex items-center gap-4 text-sm text-neutral-600 dark:text-neutral-400 font-light">
            <span className="flex items-center gap-1">
              <span className="font-medium">MRN:</span> {encounter.mrn}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {encounter.duration}
            </span>
            <span>{encounter.updated}</span>
          </div>
        </div>
      </div>

      <Button
          onClick={onOpen}
        variant="outline"
        className="h-9 px-4 text-sm font-medium border-neutral-300 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-lg whitespace-nowrap text-neutral-900 dark:text-neutral-100"
        >
          Open
        <ChevronRight className="ml-2 w-4 h-4" />
      </Button>
    </motion.div>
  );
}

/* Status Pill Component */
function StatusPill({
  tone,
  label,
}: {
  tone: "draft" | "finalized";
  label: string;
}) {
  return (
    <div
      className={`px-3 py-1 rounded-lg text-xs font-semibold ${
        tone === "draft"
          ? "bg-blue-50 dark:bg-blue-950/50 border border-blue-200/50 dark:border-blue-900/50 text-blue-700 dark:text-blue-300"
          : "bg-green-50 dark:bg-green-950/50 border border-green-200/50 dark:border-green-900/50 text-green-700 dark:text-green-300"
      }`}
    >
      {label}
    </div>
  );
}

/* Google Drive Icon Component */
function GoogleDriveIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.71 6.5L1.15 17h6.56l6.56-10.5H7.71z"
        fill="#0F9D58"
      />
      <path
        d="M14.87 6.5l-6.56 10.5h12.54l6.56-10.5H14.87z"
        fill="#4285F4"
      />
      <path
        d="M22.88 17L16.32 6.5H7.71l6.56 10.5h8.61z"
        fill="#F4B400"
      />
    </svg>
  );
}

/* Dropbox Icon Component */
function DropboxIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.5 2L12 6.5 17.5 2 12 7 6.5 2zM12 7L17.5 11.5 12 16 6.5 11.5 12 7zM17.5 11.5L23 16 17.5 20.5 12 16 17.5 11.5z"
        fill="#0061FF"
      />
      <path
        d="M6.5 11.5L12 16 6.5 20.5 1 16 6.5 11.5z"
        fill="#0061FF"
        opacity="0.7"
      />
    </svg>
  );
}
