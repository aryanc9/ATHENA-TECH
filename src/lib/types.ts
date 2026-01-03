import type { Timestamp } from "./firebase";

export interface UserProfile {
  id: string;
  email: string | null;
  name: string | null;
  photoURL: string | null;
  createdAt: any;
}

export interface AnalysisResult {
  id: string;
  userId: string;
  entity: string;
  riskLevel: 'Low' | 'Medium' | 'High' | string;
  confidenceScore: number;
  keyDrivers: string[];
  explanation: string;
  aggregatedReasons: string;
  createdAt: string; // Should be ISO string for serialization
  status: 'pending' | 'running' | 'completed' | 'failed';
}
