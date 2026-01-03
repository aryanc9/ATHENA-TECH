import AnalysisTrigger from "@/components/analysis-trigger";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const shouldRefresh = (lastFetchedAt: number): boolean => {
  const SIX_HOURS = 6 * 60 * 60 * 1000;
  return Date.now() - lastFetchedAt > SIX_HOURS;
};

export default function DashboardPage() {
  return (
    <div className="container mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Your central hub for automated analysis.</p>
      </div>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Automated Entity Analysis</CardTitle>
          <CardDescription>
            Begin the automated data collection and AI-powered analysis for Adani Power.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
              <div>
                  <h3 className="font-semibold">Target Entity</h3>
                  <p className="text-lg text-primary">Adani Power</p>
              </div>
              <AnalysisTrigger />
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Clicking "Analyze Automatically" will trigger a series of cloud functions to fetch the latest alternative data, aggregate it, and run it through our explainable AI model.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
