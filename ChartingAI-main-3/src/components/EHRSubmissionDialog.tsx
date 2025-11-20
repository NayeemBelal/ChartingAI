import { useState } from "react";
import { CheckCircle2, Loader2, AlertCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { submitChartToMockEHR } from "@/lib/utils/ehr";
import type { FinalChartPayload } from "@/types";
import { toast } from "sonner";

interface EHRSubmissionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payload: FinalChartPayload;
  onSuccess: (ehrReferenceId: string) => void;
}

export function EHRSubmissionDialog({
  open,
  onOpenChange,
  payload,
  onSuccess,
}: EHRSubmissionDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await submitChartToMockEHR(payload);
      
      if (response.status === "ok" && response.ehrReferenceId) {
        toast.success("Chart successfully submitted to EHR.", {
          description: `EHR Reference: ${response.ehrReferenceId}`,
        });
        onSuccess(response.ehrReferenceId);
        onOpenChange(false);
      } else {
        throw new Error(response.error || "Submission failed");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unable to submit to EHR at this time. Please try again.";
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (!isSubmitting) {
      setError(null);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleCancel}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            Submit to EHR
          </DialogTitle>
          <DialogDescription>
            Review the chart details below. If everything looks correct, confirm to submit this note to the EHR system.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4 -mr-4">
          <div className="space-y-6 py-4">
            {/* Patient Information */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white uppercase tracking-wide">
                Patient Information
              </h3>
              <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                <div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">Patient Name</p>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    {payload.patientName}
                  </p>
                </div>
                {payload.mrn && (
                  <div>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">MRN</p>
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">
                      {payload.mrn}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">Visit Date</p>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    {new Date(payload.visitDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">Provider</p>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    {payload.providerName}
                  </p>
                </div>
              </div>
            </div>

            <Separator className="dark:bg-neutral-800" />

            {/* Chief Complaint */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white uppercase tracking-wide">
                Chief Complaint
              </h3>
              <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                {payload.chiefComplaint}
              </p>
            </div>

            <Separator className="dark:bg-neutral-800" />

            {/* History of Present Illness */}
            {payload.historyOfPresentIllness && (
              <>
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-white uppercase tracking-wide">
                    History of Present Illness
                  </h3>
                  <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed whitespace-pre-wrap">
                    {payload.historyOfPresentIllness}
                  </p>
                </div>
                <Separator className="dark:bg-neutral-800" />
              </>
            )}

            {/* Assessment */}
            {payload.assessment && payload.assessment.length > 0 && (
              <>
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-white uppercase tracking-wide">
                    Assessment
                  </h3>
                  <div className="space-y-2">
                    {payload.assessment.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800"
                      >
                        <p className="text-sm font-medium text-neutral-900 dark:text-white mb-1">
                          {item.diagnosis}
                        </p>
                        {item.icd10 && (
                          <p className="text-xs text-neutral-600 dark:text-neutral-400 font-mono">
                            ICD-10: {item.icd10}
                          </p>
                        )}
                        {item.rationale && (
                          <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                            {item.rationale}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <Separator className="dark:bg-neutral-800" />
              </>
            )}

            {/* Plan */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white uppercase tracking-wide">
                Plan
              </h3>
              
              {payload.plan.medications && payload.plan.medications.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wide">
                    Medications
                  </h4>
                  <ul className="space-y-1">
                    {payload.plan.medications.map((med, idx) => (
                      <li key={idx} className="text-sm text-neutral-700 dark:text-neutral-300">
                        • {med.name}
                        {med.dosage && ` - ${med.dosage}`}
                        {med.frequency && ` (${med.frequency})`}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {payload.plan.labs && payload.plan.labs.length > 0 && (
                <div className="space-y-2 mt-3">
                  <h4 className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wide">
                    Lab Orders
                  </h4>
                  <ul className="space-y-1">
                    {payload.plan.labs.map((lab, idx) => (
                      <li key={idx} className="text-sm text-neutral-700 dark:text-neutral-300">
                        • {lab.test}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {payload.plan.followUp && (
                <div className="space-y-2 mt-3">
                  <h4 className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wide">
                    Follow-Up
                  </h4>
                  <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                    {payload.plan.followUp}
                  </p>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-3 rounded-lg bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/50 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-900 dark:text-red-100">Submission Error</p>
              <p className="text-xs text-red-700 dark:text-red-300 mt-1">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-800 mt-4">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="h-10 px-4"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="h-10 px-6 bg-blue-600 hover:bg-blue-700 text-white shadow-apple"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting to EHR...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Confirm & Submit
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

