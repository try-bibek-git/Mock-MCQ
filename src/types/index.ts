
import type { GenerateMcqsOutput } from '@/ai/flows/generate-mcqs';

export type GeneratedMcqItem = GenerateMcqsOutput['mcqs'][number] & { id: string };

export type MockTestCreationParams = {
  mcqQuestions: string[];
  topic: string;
  numQuestions: number;
};