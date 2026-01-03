"use client";

import type { AnalysisResult } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Leaf, Lightbulb, DollarSign, Activity } from "lucide-react";
import { ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis } from "recharts";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";

const riskColorMap = {
  Low: "bg-green-500 hover:bg-green-600",
  Medium: "bg-yellow-500 hover:bg-yellow-600",
  High: "bg-red-500 hover:bg-red-600",
  Default: "bg-gray-500 hover:bg-gray-600",
};

const riskRingColorMap: Record<string, string> = {
  Low: "hsl(142.1 76.2% 42.2%)", // green-600
  Medium: "hsl(47.9 95.8% 53.1%)", // yellow-500
  High: "hsl(0 84.2% 60.2%)", // red-500
};


const driverIcons: { [key: string]: React.ReactNode } = {
  ESG: <Leaf className="h-6 w-6 text-green-500" />,
  Earnings: <DollarSign className="h-6 w-6 text-blue-500" />,
  Market: <Activity className="h-6 w-6 text-purple-500" />,
  Innovation: <Lightbulb className="h-6 w-6 text-yellow-500" />,
};

export default function AnalysisDisplay({ analysis }: { analysis: AnalysisResult }) {
  const chartData = [{ name: "Confidence", value: analysis.confidenceScore * 100, fill: riskRingColorMap[analysis.riskLevel] || "hsl(var(--primary))" }];
  
  const chartConfig = {
    value: {
      label: "Confidence",
    },
  } satisfies ChartConfig;

  const badgeColorClass = riskColorMap[analysis.riskLevel as keyof typeof riskColorMap] || riskColorMap.Default;

  return (
    <div className="container mx-auto">
      <div className="mb-4">
        <h1 className="text-3xl font-bold tracking-tight">Analysis Report</h1>
        <p className="text-muted-foreground">Entity: <span className="font-semibold text-primary">{analysis.entity}</span></p>
        <p className="text-xs text-muted-foreground">Analyzed on: {new Date(analysis.createdAt).toLocaleString()}</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Risk Level</CardTitle>
                    <CardDescription>Overall assessed risk</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center pt-4">
                    <Badge className={`text-4xl px-8 py-4 text-primary-foreground font-bold shadow-lg ${badgeColorClass}`}>
                        {analysis.riskLevel}
                    </Badge>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Confidence Score</CardTitle>
                    <CardDescription>AI model's confidence in this assessment</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-32">
                  <ChartContainer config={chartConfig} className="mx-auto aspect-square h-full">
                      <RadialBarChart
                        data={chartData}
                        startAngle={-270}
                        endAngle={90}
                        innerRadius="70%"
                        outerRadius="100%"
                        barSize={12}
                      >
                        <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                        <RadialBar
                          dataKey="value"
                          cornerRadius={6}
                          background={{ fill: "hsl(var(--muted))" }}
                        />
                         <text
                            x="50%"
                            y="50%"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            className="fill-foreground text-2xl font-bold"
                          >
                            {`${Math.round(analysis.confidenceScore * 100)}%`}
                          </text>
                      </RadialBarChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>
        
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Key Drivers</CardTitle>
            <CardDescription>Primary factors influencing the analysis</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {analysis.keyDrivers.map(driver => (
                    <div key={driver} className="flex flex-col items-center p-4 border rounded-lg bg-background shadow-sm">
                        {driverIcons[driver] || <BarChart className="h-6 w-6" />}
                        <p className="mt-2 font-semibold text-sm">{driver}</p>
                    </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>AI-Generated Explanation</CardTitle>
            <CardDescription>A summary of why the model reached this conclusion.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-foreground">
            <p>{analysis.explanation}</p>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 bg-card/50">
          <CardHeader>
            <CardTitle>Aggregated Reasons (XAI)</CardTitle>
            <CardDescription>Detailed breakdown from the explainable AI module.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground whitespace-pre-wrap font-mono bg-muted/50 p-4 rounded-md">
             {analysis.aggregatedReasons}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
