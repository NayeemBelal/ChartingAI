import { CheckCircle, Download, FileText, Clock, RotateCcw, Home, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { useNavigate } from 'react-router-dom'

export function SuccessPage() {
  const navigate = useNavigate()
  
  // Mock data - would come from props or state management in real app
  const processedData = {
    fileName: "Patient_Chart_2024_John_Doe.pdf",
    originalSize: "2.4 MB",
    processedSize: "2.7 MB",
    processingTime: "1m 23s",
    completedAt: new Date().toLocaleString(),
    fieldsProcessed: 47,
    totalFields: 52,
    completionRate: 90.4,
    patientName: "John Doe",
    chartType: "Annual Physical Examination",
    doctorName: "Dr. Sarah Mitchell"
  }

  const handlePreview = () => {
    // In a real app, this would open a preview modal or new tab
    alert('Opening chart preview...')
  }

  const handleDownload = () => {
    // In a real app, this would trigger file download
    alert('Downloading processed chart...')
  }

  const handleUploadAnother = () => {
    // Navigate back to upload screen (would be Screen 4 in real app)
    alert('Navigating to upload page...')
  }

  const handleGoToDashboard = () => {
    // Navigate to dashboard (would be Screen 3 in real app)
    alert('Navigating to dashboard...')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900">Chart Processing Complete!</h1>
          <p className="text-lg text-gray-600">
            Your medical chart has been successfully processed and enhanced with AI
          </p>
        </div>

        {/* Processing Summary Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Processing Summary
            </CardTitle>
            <CardDescription>
              Details about your processed medical chart
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* File Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-sm text-gray-700">Original File</h3>
                <p className="text-sm font-medium">{processedData.fileName}</p>
                <p className="text-sm text-gray-500">Size: {processedData.originalSize}</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-sm text-gray-700">Processed File</h3>
                <p className="text-sm font-medium">Enhanced_{processedData.fileName}</p>
                <p className="text-sm text-gray-500">Size: {processedData.processedSize}</p>
              </div>
            </div>

            <Separator />

            {/* Processing Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-sm text-gray-700">Patient</h3>
                <p className="text-sm">{processedData.patientName}</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-sm text-gray-700">Chart Type</h3>
                <p className="text-sm">{processedData.chartType}</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-sm text-gray-700">Doctor</h3>
                <p className="text-sm">{processedData.doctorName}</p>
              </div>
            </div>

            <Separator />

            {/* Progress Information */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-sm text-gray-700">Fields Processed</h3>
                <span className="text-sm font-medium">
                  {processedData.fieldsProcessed}/{processedData.totalFields} ({processedData.completionRate}%)
                </span>
              </div>
              <Progress value={processedData.completionRate} className="h-2" />
            </div>

            <Separator />

            {/* Timing Information */}
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>Processing time: {processedData.processingTime}</span>
              </div>
              <div>
                <span>Completed: {processedData.completedAt}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Preview & Download */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Review Your Chart</CardTitle>
              <CardDescription>
                Preview the enhanced chart or download it to your device
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button onClick={handlePreview} className="w-full" variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                Preview Enhanced Chart
              </Button>
              <Button onClick={handleDownload} className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Download Chart
              </Button>
            </CardContent>
          </Card>

          {/* Navigation Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">What's Next?</CardTitle>
              <CardDescription>
                Continue with another chart or return to your dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button onClick={handleUploadAnother} className="w-full" variant="outline">
                <RotateCcw className="h-4 w-4 mr-2" />
                Upload Another Chart
              </Button>
              <Button onClick={handleGoToDashboard} className="w-full">
                <Home className="h-4 w-4 mr-2" />
                Go to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Additional Information */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-blue-900">
                  Chart Enhancement Complete
                </p>
                <p className="text-sm text-blue-700">
                  Your medical chart has been enhanced with AI-powered analysis. All patient conversations 
                  and doctor notes have been properly integrated into the appropriate fields. 
                  The enhanced chart maintains full compliance with medical documentation standards.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Navigation */}
        <div className="flex justify-end">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/profile')}
            className="text-gray-600 hover:text-gray-900"
          >
            View Profile →
          </Button>
        </div>
      </div>
    </div>
  )
}
