"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { runAnalysis } from "@/app/actions";
import { Loader2, Zap } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

type Status = "idle" | "running" | "success" | "error";

export default function AnalysisTrigger() {
  const [status, setStatus] = useState<Status>("idle");
  const router = useRouter();
  const { toast } = useToast();
  const { userProfile } = useAuth();

  const handleAnalysis = async () => {
    if (!userProfile) {
        toast({ variant: 'destructive', title: 'Authentication Error', description: 'You must be signed in to run an analysis.' });
        return;
    }
    setStatus("running");
    try {
      const result = await runAnalysis(userProfile.uid);
      if (result.success && result.analysisId) {
        setStatus("success");
        toast({
          title: "Analysis Complete",
          description: "Redirecting to the results page.",
        });
        router.push(`/analysis/${result.analysisId}`);
      } else {
        throw new Error(result.error || "Analysis failed to start.");
      }
    } catch (error) {
      setStatus("error");
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: errorMessage,
      });
      // Reset status after a delay
      setTimeout(() => setStatus("idle"), 3000);
    }
  };
  
  const getStatusIndicator = () => {
    switch(status) {
        case 'running':
            return (
                <div className="flex items-center space-x-2 text-sm text-muted-foreground animate-pulse">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Analyzing... This may take a moment.</span>
                </div>
            )
        case 'idle':
        case 'error':
        case 'success':
        default:
            return null;
    }
  }

  return (
    <div className="flex flex-col items-end space-y-2">
      <Button onClick={handleAnalysis} disabled={status === "running"}>
        {status === "running" ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Zap className="mr-2 h-4 w-4 text-accent-foreground" />
            Analyze Automatically
          </>
        )}
      </Button>
      {getStatusIndicator()}
    </div>
  );
}
