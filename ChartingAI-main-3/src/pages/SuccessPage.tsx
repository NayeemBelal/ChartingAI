import { CheckCircle2, Download, FileText, Clock, Upload, Home, Eye, ArrowLeft, Calendar, User, Stethoscope, Activity, Pill, TestTube, AlertTriangle, TrendingUp, FileDown, ChevronDown, Loader2, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet'
import { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { exportToPDF, exportToJSON, exportToTXT } from '@/lib/utils/export'
import { buildChartPayload } from '@/lib/utils/ehr'
import { EHRSubmissionDialog } from '@/components/EHRSubmissionDialog'
import { toast } from 'sonner'

export function SuccessPage() {
  const navigate = useNavigate()
  const location = useLocation() as { state?: any }
  const transcript: string | undefined = location.state?.transcript
  const summary: string | undefined = location.state?.summary
  const bulletPoints: string[] | undefined = location.state?.bulletPoints
  const uploadedFileName: string | undefined = location.state?.fileName
  const clinicalData: import('@/types').ClinicalDataExtraction | undefined = location.state?.clinicalData
  
  // Mock data - would come from props or state management in real app
  const processedData = {
    fileName: uploadedFileName || "Patient_Chart_2024_John_Doe.pdf",
    originalSize: "2.4 MB",
    processedSize: "2.7 MB",
    processingTime: "1m 23s",
    completedAt: new Date().toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric', 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    }),
    fieldsProcessed: 47,
    totalFields: 52,
    completionRate: 90.4,
    patientName: "John Doe",
    chartType: "Annual Physical Examination",
    doctorName: "Dr. Sarah Mitchell"
  }

  const [isExporting, setIsExporting] = useState(false)
  const [isEHRDialogOpen, setIsEHRDialogOpen] = useState(false)
  const [ehrStatus, setEhrStatus] = useState<{ submitted: boolean; ehrReferenceId?: string } | null>(null)

  const handlePreview = () => {
    // In a real app, this would open a preview modal or new tab
    alert('Opening chart preview...')
  }

  const handleExportPDF = () => {
    try {
      setIsExporting(true)
      exportToPDF({
        patientName: processedData.patientName,
        encounterDate: processedData.completedAt,
        summary: summary,
        bulletPoints: bulletPoints,
        transcript: transcript,
        clinicalData: clinicalData,
        fileName: uploadedFileName,
      }, {
        format: 'pdf',
        includeTranscript: true,
        includeStructuredData: true,
        filename: `encounter_${processedData.patientName}_${new Date().toISOString().split('T')[0]}.pdf`,
      })
      toast.success('PDF exported successfully')
    } catch (error) {
      console.error('Export error:', error)
      toast.error('Failed to export PDF')
    } finally {
      setIsExporting(false)
    }
  }

  const handleExportJSON = () => {
    try {
      setIsExporting(true)
      exportToJSON({
        patientName: processedData.patientName,
        encounterDate: processedData.completedAt,
        summary: summary,
        bulletPoints: bulletPoints,
        transcript: transcript,
        clinicalData: clinicalData,
        fileName: uploadedFileName,
      }, {
        format: 'json',
        includeTranscript: true,
        includeStructuredData: true,
        filename: `encounter_${processedData.patientName}_${new Date().toISOString().split('T')[0]}.json`,
      })
      toast.success('JSON exported successfully')
    } catch (error) {
      console.error('Export error:', error)
      toast.error('Failed to export JSON')
    } finally {
      setIsExporting(false)
    }
  }

  const handleExportTXT = () => {
    try {
      setIsExporting(true)
      exportToTXT({
        patientName: processedData.patientName,
        encounterDate: processedData.completedAt,
        summary: summary,
        bulletPoints: bulletPoints,
        transcript: transcript,
        clinicalData: clinicalData,
        fileName: uploadedFileName,
      }, {
        format: 'txt',
        includeTranscript: true,
        includeStructuredData: true,
        filename: `encounter_${processedData.patientName}_${new Date().toISOString().split('T')[0]}.txt`,
      })
      toast.success('Text file exported successfully')
    } catch (error) {
      console.error('Export error:', error)
      toast.error('Failed to export text file')
    } finally {
      setIsExporting(false)
    }
  }

  const handleUploadAnother = () => {
    navigate("/charting-ai-dashboard")
  }

  const handleGoToDashboard = () => {
    navigate("/marketplace-new")
  }

  const handleEHRSuccess = (ehrReferenceId: string) => {
    setEhrStatus({ submitted: true, ehrReferenceId })
  }

  const getChartPayload = () => {
    return buildChartPayload({
      patientName: processedData.patientName,
      visitDate: processedData.completedAt,
      providerName: processedData.doctorName,
      summary: summary,
      bulletPoints: bulletPoints,
      transcript: transcript,
      clinicalData: clinicalData,
      fileName: uploadedFileName,
    })
  }

  return (
    <>
      <Helmet>
        <title>Chart Processing Complete - ChartingAI</title>
        <meta
          name="description"
          content="Your medical chart has been successfully processed and enhanced with AI."
        />
      </Helmet>
      
      <div className="min-h-screen bg-neutral-50 dark:bg-black flex flex-col">
        {/* Enterprise Header */}
        <header className="w-full border-b border-neutral-200/50 dark:border-neutral-800/50 bg-white/80 dark:bg-black/80 backdrop-blur-xl sticky top-0 z-40 shadow-apple">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate("/charting-ai-dashboard")}
                className="text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100/50 dark:hover:bg-neutral-800/50 h-9 px-3 rounded-lg"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <div className="h-6 w-px bg-neutral-200 dark:bg-neutral-800" />
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <div>
                    <h1 className="text-xl font-semibold tracking-tight text-neutral-900 dark:text-white">
                      Chart Processing Complete
                    </h1>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 font-light mt-0.5">
                      AI-enhanced medical chart ready
                    </p>
                  </div>
                  {ehrStatus?.submitted && (
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-green-50 dark:bg-green-950/50 border border-green-200 dark:border-green-900/50">
                      <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                      <span className="text-xs font-semibold text-green-700 dark:text-green-300">
                        Sent to EHR
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {!ehrStatus?.submitted && (
                <Button
                  onClick={() => setIsEHRDialogOpen(true)}
                  className="h-9 px-4 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-apple rounded-lg"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Submit to EHR
                </Button>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-12 space-y-8">
          
          {/* Success Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-6"
          >
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-green-50 dark:bg-green-950/50 border-4 border-green-100 dark:border-green-900/50 flex items-center justify-center shadow-apple">
                <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="space-y-3">
              <h1 className="text-4xl font-semibold tracking-tight text-neutral-900 dark:text-white">
                Chart Processing Complete!
              </h1>
              <p className="text-lg text-neutral-600 dark:text-neutral-300 font-light max-w-2xl mx-auto">
                Your medical chart has been successfully processed and enhanced with AI.
          </p>
        </div>
          </motion.div>

        {/* Processing Summary Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="p-8 rounded-2xl bg-white dark:bg-black border border-neutral-200/50 dark:border-neutral-800/50 shadow-apple-lg"
          >
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-1">
                <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h2 className="text-xl font-semibold text-neutral-900 dark:text-white tracking-tight">
              Processing Summary
                </h2>
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 font-light">
                Details about your processed medical chart
              </p>
            </div>

            <div className="space-y-6">
              {/* File Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 rounded-xl bg-neutral-50 dark:bg-black border border-neutral-200/50 dark:border-neutral-800/50">
                  <h3 className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide mb-2">
                    Original File
                  </h3>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white mb-1">
                    {processedData.fileName}
                  </p>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 font-light">
                    Size: {processedData.originalSize}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200/50 dark:border-blue-900/50">
                  <h3 className="text-xs font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wide mb-2">
                    Processed File
                  </h3>
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                    Enhanced_{processedData.fileName}
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-light">
                    Size: {processedData.processedSize}
                  </p>
                </div>
              </div>

              <Separator className="dark:bg-neutral-800" />

              {/* Chart Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                    <h3 className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                      Patient
                    </h3>
                  </div>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    {processedData.patientName}
                  </p>
              </div>
              <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                    <h3 className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                      Chart Type
                    </h3>
                  </div>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    {processedData.chartType}
                  </p>
              </div>
              <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Stethoscope className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                    <h3 className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                      Doctor
                    </h3>
                  </div>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    {processedData.doctorName}
                  </p>
              </div>
            </div>

              <Separator className="dark:bg-neutral-800" />

            {/* Progress Information */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                    Fields Processed
                  </h3>
                  <span className="text-sm font-medium text-neutral-900 dark:text-white">
                  {processedData.fieldsProcessed}/{processedData.totalFields} ({processedData.completionRate}%)
                </span>
              </div>
                <div className="relative h-3 w-full rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${processedData.completionRate}%` }}
                  />
            </div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 font-light text-center">
                  {processedData.completionRate}% of fields successfully processed
                </p>
            </div>

              <Separator className="dark:bg-neutral-800" />

            {/* Timing Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50 dark:bg-black border border-neutral-200/50 dark:border-neutral-800/50">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/50 border border-blue-200/50 dark:border-blue-900/50 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide mb-0.5">
                      Processing Time
                    </p>
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">
                      {processedData.processingTime}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50 dark:bg-black border border-neutral-200/50 dark:border-neutral-800/50">
                  <div className="w-10 h-10 rounded-lg bg-green-50 dark:bg-green-950/50 border border-green-200/50 dark:border-green-900/50 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                    <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide mb-0.5">
                      Completed
                    </p>
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">
                      {processedData.completedAt}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* AI Summary Report */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="p-6 rounded-2xl bg-white dark:bg-black border border-neutral-200/50 dark:border-neutral-800/50 shadow-apple-lg md:col-span-2"
            >
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white tracking-tight mb-1">
                  AI Summary Report
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 font-light">
                  Generated from your audio transcription
                </p>
              </div>
              <div className="space-y-4">
                <p className="text-sm text-neutral-800 dark:text-neutral-200 leading-relaxed">
                  {summary || "Summary will appear here once generated."}
                </p>
                {bulletPoints && bulletPoints.length > 0 && (
                  <ul className="list-disc pl-5 space-y-1 text-sm text-neutral-800 dark:text-neutral-200">
                    {bulletPoints.map((b, i) => (
                      <li key={i} className="font-light">{b}</li>
                    ))}
                  </ul>
                )}
                {transcript && (
                  <>
                    <Separator className="dark:bg-neutral-800" />
                    <details className="rounded-xl border border-neutral-200/50 dark:border-neutral-800/50 bg-neutral-50 dark:bg-black p-4">
                      <summary className="cursor-pointer text-sm font-semibold text-neutral-900 dark:text-white">
                        View Full Transcript
                      </summary>
                      <p className="mt-3 text-sm text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap font-light leading-relaxed">
                        {transcript}
                      </p>
                    </details>
                  </>
                )}
              </div>
            </motion.div>

            {/* Structured Clinical Data (Advanced Feature) */}
            {clinicalData && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.18 }}
                className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border border-blue-200/50 dark:border-blue-900/50 shadow-apple-lg md:col-span-2"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-white tracking-tight mb-1 flex items-center gap-2">
                      <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      Structured Clinical Data Extraction
                    </h3>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 font-light">
                      AI-extracted structured data for EHR integration
                    </p>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-100 dark:bg-blue-900/50 border border-blue-200 dark:border-blue-800">
                    <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                      {clinicalData.qualityMetrics.overallConfidence}% Confidence
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Chief Complaint & HPI */}
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-white dark:bg-black/50 border border-blue-200/50 dark:border-blue-900/50">
                      <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-2">Chief Complaint</h4>
                      <p className="text-sm text-neutral-700 dark:text-neutral-300">{clinicalData.chiefComplaint}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-white dark:bg-black/50 border border-blue-200/50 dark:border-blue-900/50">
                      <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-2">History of Present Illness</h4>
                      <p className="text-sm text-neutral-700 dark:text-neutral-300">{clinicalData.historyOfPresentIllness}</p>
                    </div>
                  </div>

                  {/* Assessment */}
                  <div className="p-4 rounded-xl bg-white dark:bg-black/50 border border-blue-200/50 dark:border-blue-900/50">
                    <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">Assessment</h4>
                    <div className="space-y-2">
                      {clinicalData.assessment.map((item, idx) => (
                        <div key={idx} className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200/50 dark:border-blue-900/50">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-neutral-900 dark:text-white">{item.diagnosis}</span>
                            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
                              {item.confidence}%
                            </span>
                          </div>
                          {item.icd10 && (
                            <p className="text-xs text-neutral-600 dark:text-neutral-400 font-mono">ICD-10: {item.icd10}</p>
                          )}
                          {item.rationale && (
                            <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">{item.rationale}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Medications */}
                  {clinicalData.plan.medications.length > 0 && (
                    <div className="p-4 rounded-xl bg-white dark:bg-black/50 border border-blue-200/50 dark:border-blue-900/50">
                      <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3 flex items-center gap-2">
                        <Pill className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        Medications
                      </h4>
                      <div className="space-y-2">
                        {clinicalData.plan.medications.map((med, idx) => (
                          <div key={idx} className="p-2 rounded-lg bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-neutral-900 dark:text-white">{med.name}</span>
                              {med.rxNorm && (
                                <span className="text-xs text-neutral-500 dark:text-neutral-500 font-mono">RxNorm: {med.rxNorm}</span>
                              )}
                            </div>
                            {(med.dosage || med.frequency) && (
                              <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                                {[med.dosage, med.frequency, med.route].filter(Boolean).join(' • ')}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Labs & Procedures */}
                  {(clinicalData.plan.labs.length > 0 || clinicalData.plan.procedures.length > 0) && (
                    <div className="space-y-4">
                      {clinicalData.plan.labs.length > 0 && (
                        <div className="p-4 rounded-xl bg-white dark:bg-black/50 border border-blue-200/50 dark:border-blue-900/50">
                          <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3 flex items-center gap-2">
                            <TestTube className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            Lab Orders
                          </h4>
                          <div className="space-y-1">
                            {clinicalData.plan.labs.map((lab, idx) => (
                              <div key={idx} className="text-sm text-neutral-700 dark:text-neutral-300">
                                • {lab.test}
                                {lab.loinc && <span className="text-xs text-neutral-500 font-mono ml-2">(LOINC: {lab.loinc})</span>}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {clinicalData.plan.procedures.length > 0 && (
                        <div className="p-4 rounded-xl bg-white dark:bg-black/50 border border-blue-200/50 dark:border-blue-900/50">
                          <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">Procedures</h4>
                          <div className="space-y-1">
                            {clinicalData.plan.procedures.map((proc, idx) => (
                              <div key={idx} className="text-sm text-neutral-700 dark:text-neutral-300">
                                • {proc.name}
                                {proc.cpt && <span className="text-xs text-neutral-500 font-mono ml-2">(CPT: {proc.cpt})</span>}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Quality Metrics */}
                <div className="mt-6 p-4 rounded-xl bg-white dark:bg-black/50 border border-blue-200/50 dark:border-blue-900/50">
                  <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">Quality Metrics</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">Data Completeness</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
                          <div
                            className="h-full bg-blue-600 rounded-full transition-all"
                            style={{ width: `${clinicalData.qualityMetrics.dataCompleteness}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-neutral-900 dark:text-white">
                          {clinicalData.qualityMetrics.dataCompleteness}%
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">Sections Completed</p>
                      <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                        {clinicalData.qualityMetrics.sectionsCompleted.length}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">Missing Sections</p>
                      <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                        {clinicalData.qualityMetrics.missingRecommendedSections.length}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">Overall Confidence</p>
                      <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                        {clinicalData.qualityMetrics.overallConfidence}%
                      </p>
                    </div>
                  </div>
                </div>

                {/* Risk Factors */}
                {clinicalData.riskFactors.length > 0 && (
                  <div className="mt-4 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50">
                    <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-2 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      Risk Factors Identified
                    </h4>
                    <div className="space-y-1">
                      {clinicalData.riskFactors.map((risk, idx) => (
                        <div key={idx} className="text-sm text-neutral-700 dark:text-neutral-300">
                          • <span className={`font-semibold ${
                            risk.level === 'high' ? 'text-red-600 dark:text-red-400' :
                            risk.level === 'moderate' ? 'text-amber-600 dark:text-amber-400' :
                            'text-blue-600 dark:text-blue-400'
                          }`}>
                            [{risk.level.toUpperCase()}]
                          </span> {risk.description}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Review Your Chart */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="p-6 rounded-2xl bg-white dark:bg-black border border-neutral-200/50 dark:border-neutral-800/50 shadow-apple-lg"
            >
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white tracking-tight mb-1">
                  Review Your Chart
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 font-light">
                Preview the enhanced chart or download it to your device
                </p>
              </div>
              <div className="space-y-3">
                <Button
                  onClick={handlePreview}
                  variant="outline"
                  disabled={isExporting}
                  className="w-full h-11 text-sm font-medium border-neutral-300 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl text-neutral-900 dark:text-neutral-100"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Preview Enhanced Chart
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      disabled={isExporting}
                      className="w-full h-11 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-apple rounded-xl"
                    >
                      {isExporting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Exporting...
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4 mr-2" />
                          Export Chart
                          <ChevronDown className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 bg-white dark:bg-black border-neutral-200 dark:border-neutral-800">
                    <DropdownMenuItem
                      onClick={handleExportPDF}
                      disabled={isExporting}
                      className="cursor-pointer focus:bg-neutral-100 dark:focus:bg-neutral-800"
                    >
                      <FileText className="w-4 h-4 mr-2 text-red-600 dark:text-red-400" />
                      <span>Export as PDF</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleExportJSON}
                      disabled={isExporting}
                      className="cursor-pointer focus:bg-neutral-100 dark:focus:bg-neutral-800"
                    >
                      <FileDown className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                      <span>Export as JSON</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleExportTXT}
                      disabled={isExporting}
                      className="cursor-pointer focus:bg-neutral-100 dark:focus:bg-neutral-800"
                    >
                      <FileText className="w-4 h-4 mr-2 text-green-600 dark:text-green-400" />
                      <span>Export as TXT</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </motion.div>

            {/* What's Next? */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="p-6 rounded-2xl bg-white dark:bg-black border border-neutral-200/50 dark:border-neutral-800/50 shadow-apple-lg"
            >
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white tracking-tight mb-1">
                  What's Next?
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 font-light">
                Continue with another chart or return to your dashboard
                </p>
              </div>
              <div className="space-y-3">
                <Button
                  onClick={handleUploadAnother}
                  variant="outline"
                  className="w-full h-11 text-sm font-medium border-neutral-300 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl text-neutral-900 dark:text-neutral-100"
                >
                  <Upload className="w-4 h-4 mr-2" />
                Upload Another Chart
              </Button>
                <Button
                  onClick={handleGoToDashboard}
                  className="w-full h-11 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-apple rounded-xl"
                >
                  <Home className="w-4 h-4 mr-2" />
                Go to Dashboard
              </Button>
              </div>
            </motion.div>
        </div>

        {/* Additional Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="p-6 rounded-2xl bg-blue-50/50 dark:bg-blue-950/50 border border-blue-200/50 dark:border-blue-900/50 shadow-apple"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-950 border border-blue-200/50 dark:border-blue-900/50 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                  Chart Enhancement Complete
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-300 font-light leading-relaxed">
                  Your medical chart has been enhanced with AI-powered analysis. All patient conversations 
                  and doctor notes have been properly integrated into the appropriate fields. 
                  The enhanced chart maintains full compliance with medical documentation standards.
                </p>
              </div>
            </div>
          </motion.div>

        </main>

        {/* EHR Submission Dialog */}
        <EHRSubmissionDialog
          open={isEHRDialogOpen}
          onOpenChange={setIsEHRDialogOpen}
          payload={getChartPayload()}
          onSuccess={handleEHRSuccess}
        />
      </div>
    </>
  )
}
