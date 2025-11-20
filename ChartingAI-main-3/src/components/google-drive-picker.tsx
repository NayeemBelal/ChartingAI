import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { FileText, Music4 } from "lucide-react";

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  size: number;
  type: "audio" | "transcript";
}

const MOCK_FILES: DriveFile[] = [
  { id: "1", name: "ER Visit - Chest Pain.mp3", mimeType: "audio/mpeg", size: 6.2 * 1024 * 1024, type: "audio" },
  { id: "2", name: "Diabetes Follow-Up Transcript.txt", mimeType: "text/plain", size: 48 * 1024, type: "transcript" },
  { id: "3", name: "Pediatric Fever Visit.txt", mimeType: "text/plain", size: 36 * 1024, type: "transcript" },
  { id: "4", name: "Annual Physical Audio.m4a", mimeType: "audio/mp4", size: 4.8 * 1024 * 1024, type: "audio" },
  { id: "5", name: "Hypertension Counseling.txt", mimeType: "text/plain", size: 42 * 1024, type: "transcript" },
];

export function GoogleDrivePicker({
  open,
  onOpenChange,
  onSelect,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSelect: (file: DriveFile) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-neutral-900 dark:text-white">Import from Google Drive</DialogTitle>
          <DialogDescription className="text-sm text-neutral-600 dark:text-neutral-400">
            Choose a file to import. This is a mock picker for UX only.
          </DialogDescription>
        </DialogHeader>

        <div className="border border-neutral-200/50 dark:border-neutral-800/50 rounded-xl overflow-hidden">
          <div className="max-h-72 overflow-y-auto">
            <ul className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {MOCK_FILES.map((f) => (
                <li key={f.id} className="flex items-center justify-between p-3 hover:bg-neutral-50 dark:hover:bg-neutral-900/60 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center">
                      {f.type === "audio" ? (
                        <Music4 className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                      ) : (
                        <FileText className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-neutral-900 dark:text-white">{f.name}</div>
                      <div className="text-xs text-neutral-600 dark:text-neutral-400">
                        {f.type === "audio" ? "Audio" : "Transcript"} • {(f.size / (1024 * 1024)).toFixed(2)} MB
                      </div>
                    </div>
                  </div>
                  <Button size="sm" className="h-8" onClick={() => { onSelect(f); onOpenChange(false); }}>
                    Select
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="h-9">
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}



