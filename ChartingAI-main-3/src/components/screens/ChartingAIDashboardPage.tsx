import { useNavigate } from "react-router-dom";
import { Mic, ChevronRight, CheckCircle } from "lucide-react";
import { useRef, useState } from "react";

export default function ChartingAIDashboardPage() {
  const navigate = useNavigate();

  // hidden file input ref
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // track upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // mock recent encounters
  const recent = [
    {
      id: "enc_1342",
      patient: "Jane Doe",
      status: "Draft generated",
      tone: "draft" as const,
      updated: "2 min ago",
    },
    {
      id: "enc_1341",
      patient: "John Smith",
      status: "Finalized",
      tone: "finalized" as const,
      updated: "Today 10:14 AM",
    },
  ];

  function handleSubmit() {
    // later: create job, call backend, etc.
    navigate("/success");
  }

  function handleRecord() {
    alert("Recording flow not implemented yet.");
  }

  function handleOpenEncounter(enc: (typeof recent)[number]) {
    // draft vs finalized routing can branch later
    navigate("/success");
  }

  // open native file picker
  function triggerFileBrowse() {
    fileInputRef.current?.click();
  }

  // handle file chosen
  function onFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundColor: "#f9fafb",
      }}
    >
      {/* ---------- HEADER ---------- */}
      <header className="w-full border-b border-neutral-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          {/* Left: Back + Title + Subtitle */}
          <div className="flex-1 min-w-0">
            <button
              onClick={() => navigate("/marketplace")}
              className="flex items-center text-[13px] text-neutral-600 hover:text-neutral-800"
            >
              <span className="mr-2">←</span>
              <span>Back to Marketplace</span>
            </button>

            <h1 className="text-[1.75rem] font-semibold text-neutral-900 leading-snug mt-3">
              AI Medical Charting Agent
            </h1>

            <p className="text-[14px] text-neutral-600 leading-relaxed mt-2 max-w-3xl">
              Upload or record consultations to auto-generate clinical notes and
              structured charts.
            </p>
          </div>

          {/* Right: Profile chip */}
          <div className="flex items-start md:pt-2">
            <button
              className="flex items-center justify-center h-8 min-w-[2rem] px-3 rounded-full border text-[13px] font-medium shadow-sm"
              style={{
                backgroundColor: "#ffffff",
                borderColor: "#d0d5dd",
                color: "#0f172a",
                borderWidth: "1px",
              }}
              onClick={() => {
                // later: open profile menu / go to /profile
                navigate("/profile");
              }}
              title="View profile"
            >
              DR
            </button>
          </div>
        </div>
      </header>

      {/* ---------- MAIN BODY ---------- */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Upload + Side Panels */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT: Upload card */}
          <div
            className="col-span-2 rounded-xl border bg-white shadow-[0_16px_40px_-8px_rgba(0,0,0,0.04)]"
            style={{
              borderColor: "#d0d5dd",
            }}
          >
            {/* Card header row */}
            <div className="px-6 py-4 border-b border-neutral-200 flex items-start gap-2">
              <div
                className="h-8 w-8 rounded-md flex items-center justify-center text-white text-[14px] font-medium"
                style={{
                  backgroundColor: "#10b981", // green
                }}
              >
                <Mic className="h-4 w-4 text-white" />
              </div>

              <div className="min-w-0">
                <div className="text-[16px] font-semibold text-neutral-900 leading-tight">
                  Upload Audio File
                </div>
                <div className="text-[13px] text-neutral-600 leading-relaxed">
                  Accepted formats: .wav, .mp3 &nbsp;|&nbsp; Max size 100 MB
                </div>
              </div>
            </div>

            {/* Body: dropzone / file state */}
            <div className="px-6 py-6">
              <div
                className="w-full rounded-lg border-2 border-dashed bg-neutral-50 flex flex-col items-center justify-center text-center p-10"
                style={{
                  borderColor: "#d0d5dd",
                }}
              >
                {selectedFile ? (
                  <>
                    <div className="h-12 w-12 rounded-full border border-neutral-300 bg-white flex items-center justify-center mb-4">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>

                    <div className="text-[14px] text-neutral-800 font-medium">
                      {selectedFile.name}
                    </div>
                    <div className="text-[13px] text-neutral-500 mt-2">
                      Ready to transcribe
                    </div>
                  </>
                ) : (
                  <>
                    <div className="h-12 w-12 rounded-full border border-neutral-300 bg-white flex items-center justify-center mb-4">
                      <Mic className="h-5 w-5 text-neutral-600" />
                    </div>

                    <div className="text-[14px] text-neutral-800 font-medium">
                      Drop your audio file here or click to browse
                    </div>
                    <div className="text-[13px] text-neutral-500 mt-2">
                      Supports .wav and .mp3 files
                    </div>

                    {/* Hidden file input */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".wav,.mp3,audio/*"
                      className="hidden"
                      onChange={onFileSelected}
                    />

                    {/* Browse trigger */}
                    <button
                      onClick={triggerFileBrowse}
                      className="mt-4 text-[13px] font-medium hover:underline"
                      style={{ color: "#2f59b0" }}
                    >
                      Browse files
                    </button>
                  </>
                )}
              </div>

              {/* Action buttons */}
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleSubmit}
                  className="flex-1 text-[13px] font-medium rounded-lg py-2 px-4 text-white shadow-sm"
                  style={{
                    backgroundColor: "#97b7ff", // light clinic-blue submit
                    color: "#0f172a",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.06)",
                  }}
                >
                  Submit for Transcription
                </button>

                <button
                  onClick={handleRecord}
                  className="flex-shrink-0 text-[13px] font-medium rounded-lg py-2 px-4 border flex items-center justify-center gap-2"
                  style={{
                    backgroundColor: "#ffffff",
                    borderColor: "#d0d5dd",
                    borderWidth: "1px",
                    color: "#0f172a",
                  }}
                >
                  <Mic className="h-4 w-4 text-neutral-700" />
                  <span>Record Audio</span>
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: How it Works + Benefits */}
          <div className="flex flex-col gap-6">
            {/* How it Works card */}
            <div
              className="rounded-xl border bg-white p-6 shadow-[0_16px_40px_-8px_rgba(0,0,0,0.04)]"
              style={{ borderColor: "#d0d5dd" }}
            >
              <div className="text-[15px] font-semibold text-neutral-900 mb-4">
                How It Works
              </div>

              <ol className="space-y-4">
                {["Upload", "Transcribe", "Review", "Finalize"].map(
                  (step, idx) => (
                    <li
                      key={step}
                      className="flex items-start justify-between text-[14px] text-neutral-800"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className="h-6 w-6 rounded-full flex items-center justify-center text-[12px] font-medium"
                          style={{
                            backgroundColor: "#eef4ff",
                            color: "#2f59b0",
                            border: "1px solid #a3c4ff",
                          }}
                        >
                          {idx + 1}
                        </div>
                        <span className="leading-tight">{step}</span>
                      </div>

                      <ChevronRight className="h-4 w-4 text-neutral-400" />
                    </li>
                  )
                )}
              </ol>
            </div>

            {/* Benefits card */}
            <div
              className="rounded-xl border bg-white p-6 shadow-[0_16px_40px_-8px_rgba(0,0,0,0.04)]"
              style={{ borderColor: "#d0d5dd" }}
            >
              <div className="text-[15px] font-semibold text-neutral-900 mb-4">
                Benefits
              </div>

              <ul className="list-disc pl-5 text-[14px] text-neutral-700 space-y-2">
                <li>Reduces doctor clicks by 70%</li>
                <li>Improves chart accuracy</li>
                <li>Enhances patient care</li>
              </ul>
            </div>
          </div>
        </section>

        {/* ---------- RECENT ACTIVITY ---------- */}
        <section className="space-y-4">
          <div className="text-xs text-neutral-500 font-medium tracking-wide uppercase">
            Recent activity
          </div>

          <div className="grid gap-4">
            {recent.map((enc) => (
              <EncounterRow
                key={enc.id}
                patient={enc.patient}
                updated={enc.updated}
                status={enc.status}
                tone={enc.tone}
                onOpen={() => handleOpenEncounter(enc)}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

/* -------------------------------------------
 * Encounter row
 * ------------------------------------------- */
function EncounterRow({
  patient,
  updated,
  status,
  tone,
  onOpen,
}: {
  patient: string;
  updated: string;
  status: string;
  tone: "draft" | "finalized";
  onOpen: () => void;
}) {
  return (
    <div
      className="rounded-xl border bg-white p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between shadow-[0_16px_40px_-8px_rgba(0,0,0,0.04)]"
      style={{
        borderColor: "#d0d5dd",
      }}
    >
      {/* left block */}
      <div className="space-y-1">
        <div className="text-sm text-neutral-500">Patient</div>
        <div className="text-base font-medium text-neutral-900 leading-tight">
          {patient}
        </div>
        <div className="text-xs text-neutral-500">{updated}</div>
      </div>

      {/* right block */}
      <div className="flex flex-col sm:items-end gap-2 pt-4 sm:pt-0">
        <StatusPill tone={tone} label={status} />

        <button
          onClick={onOpen}
          className="w-full sm:w-auto text-[13px] font-medium rounded-lg border border-neutral-300 bg-neutral-100 text-neutral-800 py-2 px-4 hover:bg-neutral-200 transition"
        >
          Open
        </button>
      </div>
    </div>
  );
}

/* -------------------------------------------
 * Status pill
 * ------------------------------------------- */
function StatusPill({
  tone,
  label,
}: {
  tone: "draft" | "finalized";
  label: string;
}) {
  const style =
    tone === "draft"
      ? {
          backgroundColor: "#e9f1ff",
          color: "#2f59b0",
          border: "1px solid #a3c4ff",
        }
      : {
          backgroundColor: "#ecfdf3",
          color: "#039855",
          border: "1px solid #a6f4c5",
        };

  return (
    <div
      className="text-xs rounded-full px-2 py-1 text-center min-w-[7rem] font-medium"
      style={style}
    >
      {label}
    </div>
  );
}
