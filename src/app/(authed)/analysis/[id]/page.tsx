import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import AnalysisDisplay from "@/components/analysis-display";
import { AnalysisResult } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { notFound } from "next/navigation";
import type { Timestamp } from "firebase/firestore";

// Helper to convert Firestore Timestamp to Date, then to a string.
// This is necessary because Timestamps are not serializable from Server Components to Client Components.
function processFirestoreData(data: any): any {
  if (!data) return null;
  const processedData = { ...data };
  for (const key in processedData) {
    if (processedData[key] && typeof processedData[key] === 'object' && 'toDate' in processedData[key]) {
      processedData[key] = (processedData[key] as Timestamp).toDate().toISOString();
    }
  }
  return processedData;
}


export default async function AnalysisPage({ params }: { params: { id: string } }) {
  const analysisRef = doc(db, "analysis_results", params.id);
  const analysisSnap = await getDoc(analysisRef);

  if (!analysisSnap.exists()) {
    return notFound();
  }

  const analysisData = processFirestoreData({ id: analysisSnap.id, ...analysisSnap.data() }) as AnalysisResult;

  if (analysisData.status === 'failed') {
     return (
        <div className="container mx-auto">
            <Card className="max-w-2xl mx-auto mt-10 border-destructive">
                <CardHeader className="flex flex-row items-center space-x-4">
                    <AlertTriangle className="h-8 w-8 text-destructive" />
                    <CardTitle>Analysis Failed</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>We're sorry, but there was an error while processing your analysis request.</p>
                    <p className="text-sm text-muted-foreground mt-2">Please try again later.</p>
                </CardContent>
            </Card>
        </div>
     )
  }
  
  return <AnalysisDisplay analysis={analysisData} />;
}
