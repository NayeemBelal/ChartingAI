import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { ArrowLeft, Mic, Upload, FileAudio } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const ChartingDashboard = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (file: File) => {
    const validTypes = ["audio/wav", "audio/mpeg", "audio/mp3"];
    const maxSize = 100 * 1024 * 1024; // 100 MB

    if (!validTypes.includes(file.type) && !file.name.match(/\.(wav|mp3)$/i)) {
      alert("Please upload a .wav or .mp3 file");
      return;
    }

    if (file.size > maxSize) {
      alert("File size must be less than 100 MB");
      return;
    }

    setSelectedFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleSubmit = () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          // Navigate to mock job page
          setTimeout(() => {
            const mockJobId = Math.random().toString(36).substring(7);
            navigate(`/jobs/${mockJobId}`);
          }, 500);
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  const handleRecordAudio = () => {
    // Mock handler for recording
    alert("Recording feature coming soon!");
  };

  return (
    <>
      <Helmet>
        <title>AI Medical Charting Agent - ChartingAI</title>
        <meta name="description" content="Upload or record consultations to auto-generate clinical notes and structured charts." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />

        <main className="container mx-auto px-4 pt-24 pb-12">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Back Link */}
            <Button
              variant="ghost"
              onClick={() => navigate("/marketplace")}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Marketplace
            </Button>

            {/* Header */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                AI Medical Charting Agent
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl">
                Upload or record consultations to auto-generate clinical notes and structured charts.
              </p>
            </div>

            {/* Main Content */}
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Upload Section */}
              <div className="lg:col-span-2">
                <Card className="rounded-2xl">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-lg bg-accent">
                        <Mic className="h-6 w-6 text-accent-foreground" />
                      </div>
                      <CardTitle>Upload Audio File</CardTitle>
                    </div>
                    <CardDescription>
                      Accepted formats: .wav, .mp3 | Max size 100 MB
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    {/* Drop Zone */}
                    <motion.div
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      whileHover={{ scale: 1.01 }}
                      className={`
                        relative border-2 border-dashed rounded-xl p-12 text-center cursor-pointer
                        transition-colors duration-200
                        ${isDragging 
                          ? "border-primary bg-primary/5" 
                          : "border-border hover:border-primary/50 hover:bg-accent/50"
                        }
                      `}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".wav,.mp3,audio/wav,audio/mpeg"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileSelect(file);
                        }}
                        className="hidden"
                      />

                      <div className="flex flex-col items-center gap-4">
                        <div className="p-4 rounded-full bg-muted">
                          {selectedFile ? (
                            <FileAudio className="h-8 w-8 text-primary" />
                          ) : (
                            <Upload className="h-8 w-8 text-muted-foreground" />
                          )}
                        </div>
                        
                        {selectedFile ? (
                          <div className="space-y-1">
                            <p className="font-medium">{selectedFile.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <p className="font-medium">
                              Drop your audio file here or click to browse
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Supports .wav and .mp3 files
                            </p>
                          </div>
                        )}
                      </div>
                    </motion.div>

                    {/* Processing Progress */}
                    {isProcessing && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="space-y-2"
                      >
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Processing audio...</span>
                          <span className="font-medium">{uploadProgress}%</span>
                        </div>
                        <Progress value={uploadProgress} />
                      </motion.div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <Button
                        onClick={handleSubmit}
                        disabled={!selectedFile || isProcessing}
                        className="flex-1"
                        size="lg"
                      >
                        Submit for Transcription
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleRecordAudio}
                        disabled={isProcessing}
                        className="gap-2"
                        size="lg"
                      >
                        <Mic className="h-4 w-4" />
                        Record Audio
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Info Panel */}
              <div className="space-y-6">
                <Card className="rounded-2xl">
                  <CardHeader>
                    <CardTitle className="text-lg">How It Works</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { step: "1", label: "Upload" },
                        { step: "2", label: "Transcribe" },
                        { step: "3", label: "Review" },
                        { step: "4", label: "Finalize" },
                      ].map((item, index) => (
                        <div key={item.step} className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm">
                            {item.step}
                          </div>
                          <span className="text-sm font-medium">{item.label}</span>
                          {index < 3 && (
                            <div className="ml-auto text-muted-foreground">→</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-2xl">
                  <CardHeader>
                    <CardTitle className="text-lg">Benefits</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 text-sm">
                      <li className="flex gap-2">
                        <span className="text-primary">•</span>
                        <span>Reduces doctor clicks by 70%</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-primary">•</span>
                        <span>Improves chart accuracy</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-primary">•</span>
                        <span>Enhances patient care</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default ChartingDashboard;
