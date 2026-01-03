'use server';

/**
 * @fileOverview A flow to provide explainable AI analysis for Adani Power.
 *
 * - explainableAIAnalysis - A function that handles the explainable AI analysis process.
 * - ExplainableAIAnalysisInput - The input type for the explainableAIAnalysis function.
 * - ExplainableAIAnalysisOutput - The return type for the explainableAIAnalysis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainableAIAnalysisInputSchema = z.object({
  riskLevel: z.string().describe('The risk level of Adani Power.'),
  confidenceScore: z.number().describe('The confidence score of the analysis.'),
  keyDrivers: z
    .array(z.string())
    .describe('The key drivers influencing the analysis (ESG, Earnings, Market, Innovation).'),
});
export type ExplainableAIAnalysisInput = z.infer<typeof ExplainableAIAnalysisInputSchema>;

const ExplainableAIAnalysisOutputSchema = z.object({
  aggregatedReasons: z
    .string()
    .describe('Aggregated reasons behind the risk level, confidence score, and key drivers.'),
});
export type ExplainableAIAnalysisOutput = z.infer<typeof ExplainableAIAnalysisOutputSchema>;

export async function explainableAIAnalysis(
  input: ExplainableAIAnalysisInput
): Promise<ExplainableAIAnalysisOutput> {
  return explainableAIAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainableAIAnalysisPrompt',
  input: {schema: ExplainableAIAnalysisInputSchema},
  output: {schema: ExplainableAIAnalysisOutputSchema},
  prompt: `Provide an explainable AI analysis for Adani Power based on the following information:\n\nRisk Level: {{{riskLevel}}}\nConfidence Score: {{{confidenceScore}}}\nKey Drivers: {{#each keyDrivers}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}\n\nAggregate the reasons behind the given risk level, confidence score, and key drivers. Provide a comprehensive explanation so that the user can understand the factors influencing the analysis results.`,
});

const explainableAIAnalysisFlow = ai.defineFlow(
  {
    name: 'explainableAIAnalysisFlow',
    inputSchema: ExplainableAIAnalysisInputSchema,
    outputSchema: ExplainableAIAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
