import { useState, useEffect, useRef } from "react";
import { Mic, Square, Pause, Play, X, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { AudioRecorder, formatDuration, type RecordingState } from "@/lib/utils/audioRecording";

interface AudioRecorderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRecordingComplete: (file: File) => void;
}

export function AudioRecorderDialog({
  open,
  onOpenChange,
  onRecordingComplete,
}: AudioRecorderDialogProps) {
  const [recordingState, setRecordingState] = useState<RecordingState>({
    isRecording: false,
    isPaused: false,
    duration: 0,
    audioBlob: null,
    audioUrl: null,
    error: null,
  });
  const recorderRef = useRef<AudioRecorder | null>(null);

  // Initialize recorder
  useEffect(() => {
    if (open && !recorderRef.current) {
      recorderRef.current = new AudioRecorder((state) => {
        setRecordingState(state);
      });
    }

    return () => {
      if (recorderRef.current) {
        recorderRef.current.dispose();
        recorderRef.current = null;
      }
    };
  }, [open]);

  const handleStart = async () => {
    try {
      await recorderRef.current?.startRecording();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to start recording";
      setRecordingState((prev) => ({ ...prev, error: errorMessage }));
    }
  };

  const handleStop = () => {
    recorderRef.current?.stopRecording();
  };

  const handlePause = () => {
    recorderRef.current?.pauseRecording();
  };

  const handleResume = () => {
    recorderRef.current?.resumeRecording();
  };

  const handleCancel = () => {
    recorderRef.current?.cancelRecording();
    onOpenChange(false);
  };

  const handleSave = () => {
    const file = recorderRef.current?.getAudioFile(`recording_${Date.now()}.wav`);
    if (file) {
      onRecordingComplete(file);
      onOpenChange(false);
    }
  };

  const handleClose = () => {
    if (recordingState.isRecording || recordingState.audioBlob) {
      // Don't close if recording or has audio - require explicit cancel/save
      return;
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mic className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Audio Recording
          </DialogTitle>
          <DialogDescription>
            Record audio directly from your microphone. Click start to begin recording.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Error Message */}
          {recordingState.error && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/50 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-900 dark:text-red-100">
                  Recording Error
                </p>
                <p className="text-xs text-red-700 dark:text-red-300 mt-1">
                  {recordingState.error}
                </p>
              </div>
            </div>
          )}

          {/* Recording Status */}
          {!recordingState.error && (
            <div className="text-center space-y-4">
              {/* Duration Display */}
              <div className="flex items-center justify-center">
                <motion.div
                  key={recordingState.duration}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  className="text-5xl font-mono font-semibold text-neutral-900 dark:text-white tabular-nums"
                >
                  {formatDuration(recordingState.duration)}
                </motion.div>
              </div>

              {/* Recording Indicator */}
              <AnimatePresence>
                {recordingState.isRecording && !recordingState.isPaused && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-center gap-2"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                      className="w-3 h-3 rounded-full bg-red-600"
                    />
                    <span className="text-sm font-medium text-red-600 dark:text-red-400">
                      Recording...
                    </span>
                  </motion.div>
                )}
                {recordingState.isPaused && (
                  <div className="flex items-center justify-center gap-2">
                    <Pause className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
                      Paused
                    </span>
                  </div>
                )}
                {!recordingState.isRecording && recordingState.audioBlob && (
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <span className="text-sm font-medium text-green-600 dark:text-green-400">
                      Recording Complete
                    </span>
                  </div>
                )}
              </AnimatePresence>

              {/* Audio Preview */}
              {recordingState.audioUrl && recordingState.audioBlob && (
                <div className="pt-4">
                  <audio
                    src={recordingState.audioUrl}
                    controls
                    className="w-full h-10"
                  />
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-2">
                    File size: {(recordingState.audioBlob.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Control Buttons */}
          <div className="flex items-center justify-center gap-3">
            {!recordingState.isRecording && !recordingState.audioBlob && (
              <Button
                onClick={handleStart}
                disabled={!!recordingState.error}
                className="h-12 w-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-apple"
              >
                <Mic className="w-5 h-5" />
              </Button>
            )}

            {recordingState.isRecording && (
              <>
                {recordingState.isPaused ? (
                  <Button
                    onClick={handleResume}
                    className="h-12 w-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-apple"
                  >
                    <Play className="w-5 h-5" />
                  </Button>
                ) : (
                  <Button
                    onClick={handlePause}
                    variant="outline"
                    className="h-12 w-12 rounded-full border-2"
                  >
                    <Pause className="w-5 h-5" />
                  </Button>
                )}
                <Button
                  onClick={handleStop}
                  className="h-12 w-12 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-apple"
                >
                  <Square className="w-5 h-5" />
                </Button>
              </>
            )}

            {recordingState.audioBlob && !recordingState.isRecording && (
              <>
                <Button
                  onClick={handleSave}
                  className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-apple"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Use This Recording
                </Button>
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  className="h-11 px-4"
                >
                  Cancel
                </Button>
              </>
            )}
          </div>

          {/* Help Text */}
          {!recordingState.isRecording && !recordingState.audioBlob && !recordingState.error && (
            <p className="text-xs text-center text-neutral-600 dark:text-neutral-400">
              Make sure your microphone is connected and access is granted
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

