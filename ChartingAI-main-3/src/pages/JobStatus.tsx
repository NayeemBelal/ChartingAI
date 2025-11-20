import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { ArrowLeft, CheckCircle, Clock, FileText } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const JobStatus = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Simulate processing
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsComplete(true);
          return 100;
        }
        return prev + 5;
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Helmet>
        <title>Job Status - ChartingAI</title>
        <meta name="description" content="View the status of your transcription job." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />

        <main className="container mx-auto px-4 pt-24 pb-12">
          <div className="max-w-3xl mx-auto space-y-8">
            {/* Back Link */}
            <Button
              variant="ghost"
              onClick={() => navigate("/charting-dashboard")}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Charting Agent
            </Button>

            {/* Status Card */}
            <Card className="rounded-2xl">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4">
                  {isComplete ? (
                    <div className="p-4 rounded-full bg-primary/10 w-fit mx-auto">
                      <CheckCircle className="h-12 w-12 text-primary" />
                    </div>
                  ) : (
                    <div className="p-4 rounded-full bg-accent w-fit mx-auto animate-pulse">
                      <Clock className="h-12 w-12 text-accent-foreground" />
                    </div>
                  )}
                </div>
                <CardTitle className="text-2xl">
                  {isComplete ? "Processing Complete!" : "Processing Your Audio"}
                </CardTitle>
                <CardDescription className="text-base">
                  Job ID: <code className="font-mono text-xs">{id}</code>
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {isComplete ? "Transcription ready" : "Transcribing audio..."}
                    </span>
                    <span className="font-medium">{progress}%</span>
                  </div>
                  <Progress value={progress} />
                </div>

                {/* Status Steps */}
                <div className="space-y-3 border-l-2 border-primary/20 pl-4 ml-2">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium">Audio uploaded</span>
                  </div>
                  <div className={`flex items-center gap-3 ${progress >= 50 ? "opacity-100" : "opacity-50"}`}>
                    <CheckCircle className={`h-5 w-5 ${progress >= 50 ? "text-primary" : "text-muted-foreground"}`} />
                    <span className="text-sm font-medium">Transcription started</span>
                  </div>
                  <div className={`flex items-center gap-3 ${isComplete ? "opacity-100" : "opacity-50"}`}>
                    <CheckCircle className={`h-5 w-5 ${isComplete ? "text-primary" : "text-muted-foreground"}`} />
                    <span className="text-sm font-medium">Chart generation complete</span>
                  </div>
                </div>

                {/* Action Buttons */}
                {isComplete && (
                  <div className="flex gap-3 pt-4">
                    <Button className="flex-1 gap-2" size="lg">
                      <FileText className="h-4 w-4" />
                      View Chart
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => navigate("/charting-dashboard")}
                      size="lg"
                    >
                      New Upload
                    </Button>
                  </div>
                )}

                {!isComplete && (
                  <p className="text-center text-sm text-muted-foreground">
                    This may take a few minutes. You'll be notified when it's ready.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </>
  );
};

export default JobStatus;
