'use server';

/**
 * @fileOverview Analyzes aggregated alternative data to determine the risk level and confidence score for Adani Power.
 *
 * - generateRiskLevel - A function that handles the risk level generation process.
 * - GenerateRiskLevelInput - The input type for the generateRiskLevel function.
 * - GenerateRiskLevelOutput - The return type for the generateRiskLevel function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateRiskLevelInputSchema = z.object({
  esgScore: z.number().describe('The ESG score of Adani Power.'),
  earningsQuality: z.number().describe('The earnings quality of Adani Power.'),
  marketSentiment: z.number().describe('The market sentiment towards Adani Power.'),
  innovationIndex: z.number().describe('The innovation index of Adani Power.'),
});

export type GenerateRiskLevelInput = z.infer<typeof GenerateRiskLevelInputSchema>;

const GenerateRiskLevelOutputSchema = z.object({
  riskLevel: z.string().describe('The risk level of Adani Power (e.g., Low, Medium, High).'),
  confidenceScore: z.number().describe('The confidence score (0-1) of the risk level assessment.'),
  keyDrivers: z.array(z.string()).describe('The key drivers influencing the risk level (e.g., ESG, Earnings, Market, Innovation).'),
  explanation: z.string().describe('An explanation of the risk level assessment.'),
});

export type GenerateRiskLevelOutput = z.infer<typeof GenerateRiskLevelOutputSchema>;

export async function generateRiskLevel(input: GenerateRiskLevelInput): Promise<GenerateRiskLevelOutput> {
  return generateRiskLevelFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRiskLevelPrompt',
  input: {schema: GenerateRiskLevelInputSchema},
  output: {schema: GenerateRiskLevelOutputSchema},
  prompt: `Analyze the following alternative data for Adani Power to determine the risk level, confidence score, and key drivers.\n\nESG Score: {{{esgScore}}}\nEarnings Quality: {{{earningsQuality}}}\nMarket Sentiment: {{{marketSentiment}}}\nInnovation Index: {{{innovationIndex}}}\n\nBased on this data, provide a risk level (Low, Medium, High), a confidence score (0-1), the key drivers influencing the risk level, and an explanation of your assessment.\n`,
});

const generateRiskLevelFlow = ai.defineFlow(
  {
    name: 'generateRiskLevelFlow',
    inputSchema: GenerateRiskLevelInputSchema,
    outputSchema: GenerateRiskLevelOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
