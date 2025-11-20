/**
 * Audio Recording Utilities
 * Handles real-time audio recording using Web Audio API
 */

export interface RecordingState {
  isRecording: boolean;
  isPaused: boolean;
  duration: number; // in seconds
  audioBlob: Blob | null;
  audioUrl: string | null;
  error: string | null;
}

export class AudioRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private stream: MediaStream | null = null;
  private startTime: number = 0;
  private pausedTime: number = 0;
  private totalPausedDuration: number = 0;
  private durationInterval: NodeJS.Timeout | null = null;
  
  private state: RecordingState = {
    isRecording: false,
    isPaused: false,
    duration: 0,
    audioBlob: null,
    audioUrl: null,
    error: null,
  };

  private onStateChange?: (state: RecordingState) => void;

  constructor(onStateChange?: (state: RecordingState) => void) {
    this.onStateChange = onStateChange;
  }

  private updateState(updates: Partial<RecordingState>) {
    this.state = { ...this.state, ...updates };
    this.onStateChange?.(this.state);
  }

  /**
   * Request microphone access and start recording
   */
  async startRecording(): Promise<void> {
    try {
      // Request microphone access
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100,
        },
      });

      // Check if MediaRecorder is supported
      if (!MediaRecorder.isTypeSupported('audio/webm')) {
        // Fallback to default mime type
        this.mediaRecorder = new MediaRecorder(this.stream);
      } else {
        this.mediaRecorder = new MediaRecorder(this.stream, {
          mimeType: 'audio/webm;codecs=opus',
        });
      }

      this.audioChunks = [];
      this.startTime = Date.now();
      this.totalPausedDuration = 0;
      this.pausedTime = 0;

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.audioChunks, { type: this.mediaRecorder?.mimeType || 'audio/webm' });
        const url = URL.createObjectURL(blob);
        
        // Convert to WAV format for better compatibility
        this.convertToWav(blob).then((wavBlob) => {
          const wavUrl = URL.createObjectURL(wavBlob);
          this.updateState({
            audioBlob: wavBlob,
            audioUrl: wavUrl,
          });
        }).catch(() => {
          // If conversion fails, use original blob
          this.updateState({
            audioBlob: blob,
            audioUrl: url,
          });
        });

        this.cleanup();
      };

      this.mediaRecorder.start(1000); // Collect data every second
      this.updateState({ isRecording: true, isPaused: false, error: null });

      // Start duration counter
      this.startDurationCounter();

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to start recording';
      this.updateState({ error: errorMessage });
      
      if (error instanceof DOMException) {
        if (error.name === 'NotAllowedError') {
          throw new Error('Microphone access denied. Please allow microphone access and try again.');
        } else if (error.name === 'NotFoundError') {
          throw new Error('No microphone found. Please connect a microphone and try again.');
        }
      }
      
      throw error;
    }
  }

  /**
   * Pause recording
   */
  pauseRecording(): void {
    if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
      this.mediaRecorder.pause();
      this.pausedTime = Date.now();
      if (this.durationInterval) {
        clearInterval(this.durationInterval);
        this.durationInterval = null;
      }
      this.updateState({ isPaused: true });
    }
  }

  /**
   * Resume recording
   */
  resumeRecording(): void {
    if (this.mediaRecorder && this.mediaRecorder.state === 'paused') {
      this.mediaRecorder.resume();
      if (this.pausedTime > 0) {
        this.totalPausedDuration += Date.now() - this.pausedTime;
        this.pausedTime = 0;
      }
      this.startDurationCounter();
      this.updateState({ isPaused: false });
    }
  }

  /**
   * Stop recording
   */
  stopRecording(): void {
    if (this.mediaRecorder && (this.mediaRecorder.state === 'recording' || this.mediaRecorder.state === 'paused')) {
      this.mediaRecorder.stop();
      if (this.durationInterval) {
        clearInterval(this.durationInterval);
        this.durationInterval = null;
      }
      this.updateState({ isRecording: false, isPaused: false });
    }
  }

  /**
   * Cancel recording (discard)
   */
  cancelRecording(): void {
    this.stopRecording();
    this.audioChunks = [];
    this.cleanup();
    this.updateState({
      audioBlob: null,
      audioUrl: null,
      duration: 0,
    });
  }

  /**
   * Get current recording state
   */
  getState(): RecordingState {
    return { ...this.state };
  }

  /**
   * Get recorded audio as File
   */
  getAudioFile(filename: string = 'recording.wav'): File | null {
    if (!this.state.audioBlob) return null;
    return new File([this.state.audioBlob], filename, { type: 'audio/wav' });
  }

  /**
   * Start duration counter
   */
  private startDurationCounter(): void {
    if (this.durationInterval) {
      clearInterval(this.durationInterval);
    }

    this.durationInterval = setInterval(() => {
      if (this.startTime > 0) {
        const elapsed = (Date.now() - this.startTime - this.totalPausedDuration - (this.pausedTime > 0 ? Date.now() - this.pausedTime : 0)) / 1000;
        this.updateState({ duration: Math.max(0, Math.floor(elapsed)) });
      }
    }, 100);
  }

  /**
   * Convert blob to WAV format for better compatibility
   */
  private async convertToWav(blob: Blob): Promise<Blob> {
    try {
      const arrayBuffer = await blob.arrayBuffer();
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

      const wavBuffer = this.audioBufferToWav(audioBuffer);
      return new Blob([wavBuffer], { type: 'audio/wav' });
    } catch (error) {
      console.warn('Failed to convert to WAV, using original format:', error);
      return blob;
    }
  }

  /**
   * Convert AudioBuffer to WAV format
   */
  private audioBufferToWav(buffer: AudioBuffer): ArrayBuffer {
    const length = buffer.length;
    const numberOfChannels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const bytesPerSample = 2;
    const blockAlign = numberOfChannels * bytesPerSample;
    const byteRate = sampleRate * blockAlign;
    const dataSize = length * blockAlign;
    const bufferSize = 44 + dataSize;
    const arrayBuffer = new ArrayBuffer(bufferSize);
    const view = new DataView(arrayBuffer);

    // WAV header
    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    writeString(0, 'RIFF');
    view.setUint32(4, bufferSize - 8, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true); // fmt chunk size
    view.setUint16(20, 1, true); // audio format (1 = PCM)
    view.setUint16(22, numberOfChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, byteRate, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, 16, true); // bits per sample
    writeString(36, 'data');
    view.setUint32(40, dataSize, true);

    // Convert audio data
    let offset = 44;
    for (let i = 0; i < length; i++) {
      for (let channel = 0; channel < numberOfChannels; channel++) {
        const sample = Math.max(-1, Math.min(1, buffer.getChannelData(channel)[i]));
        view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
        offset += 2;
      }
    }

    return arrayBuffer;
  }

  /**
   * Cleanup resources
   */
  private cleanup(): void {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    if (this.durationInterval) {
      clearInterval(this.durationInterval);
      this.durationInterval = null;
    }
    if (this.state.audioUrl) {
      URL.revokeObjectURL(this.state.audioUrl);
    }
  }

  /**
   * Cleanup and release resources
   */
  dispose(): void {
    this.stopRecording();
    this.cleanup();
  }
}

/**
 * Format duration in seconds to MM:SS format
 */
export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

