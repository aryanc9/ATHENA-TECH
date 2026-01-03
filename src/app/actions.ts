"use server";

import { generateRiskLevel } from "@/ai/flows/generate-risk-level";
import { explainableAIAnalysis } from "@/ai/flows/explainable-ai-analysis";
import { db, collection, addDoc, serverTimestamp, doc, getDoc } from "@/lib/firebase";
import { AnalysisResult } from "@/lib/types";

// This action is designed to be called from a client-side component.
// It simulates fetching data, runs AI analysis, saves the result, and returns the new ID.
export async function runAnalysis(userId: string): Promise<{ success: boolean; analysisId?: string, error?: string }> {
  console.log("Starting analysis for user:", userId);

  if (!userId) {
    return { success: false, error: "User is not authenticated." };
  }

  try {
    const entityRef = doc(db, 'entities', 'adani_power');
    const entitySnap = await getDoc(entityRef);

    if (!entitySnap.exists()) {
      return { success: false, error: "Target entity 'adani_power' not found in database." };
    }
    const entityData = entitySnap.data();

    // In a real app, this would involve multiple steps to fetch and aggregate data.
    // For this demo, we'll use mock data as input for the AI flows.
    const mockAlternativeData = {
      esgScore: 65,
      earningsQuality: 80,
      marketSentiment: 45,
      innovationIndex: 70,
    };
    
    console.log("Generating risk level...");
    const riskResult = await generateRiskLevel(mockAlternativeData);

    console.log("Generating explainable AI analysis...");
    const explanationResult = await explainableAIAnalysis({
      riskLevel: riskResult.riskLevel,
      confidenceScore: riskResult.confidenceScore,
      keyDrivers: riskResult.keyDrivers,
    });
    
    console.log("Saving analysis to Firestore...");
    const analysisData: Omit<AnalysisResult, 'id' | 'createdAt'> & {createdAt: any} = {
      userId,
      entity: entityData.name,
      riskLevel: riskResult.riskLevel,
      confidenceScore: riskResult.confidenceScore,
      keyDrivers: riskResult.keyDrivers,
      explanation: riskResult.explanation,
      aggregatedReasons: explanationResult.aggregatedReasons,
      createdAt: serverTimestamp(),
      status: 'completed'
    };

    const docRef = await addDoc(collection(db, "analysis_results"), analysisData);
    
    console.log("Analysis complete. Document ID:", docRef.id);
    
    return { success: true, analysisId: docRef.id };

  } catch (error) {
    console.error("Analysis pipeline failed:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown server error occurred.";
    
    // As a fallback, save a failure record
    try {
        const failureData = {
            userId,
            entity: "Adani Power",
            status: 'failed',
            createdAt: serverTimestamp(),
            error: errorMessage,
        };
        const docRef = await addDoc(collection(db, "analysis_results"), failureData);
        return { success: false, analysisId: docRef.id, error: errorMessage };
    } catch (saveError) {
        console.error("Failed to save failure record:", saveError);
        return { success: false, error: "Analysis failed and could not save a failure record." };
    }
  }
}
