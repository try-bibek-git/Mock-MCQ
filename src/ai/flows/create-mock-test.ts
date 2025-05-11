'use server';
/**
 * @fileOverview A mock test paper creation AI agent.
 *
 * - createMockTestPaper - A function that handles the mock test paper creation process.
 * - CreateMockTestPaperInput - The input type for the createMockTestPaper function.
 * - CreateMockTestPaperOutput - The return type for the createMockTestPaper function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CreateMockTestPaperInputSchema = z.object({
  mcqs: z.array(z.string()).describe('An array of multiple-choice questions.'),
  topic: z.string().describe('The topic of the mock test.'),
  numQuestions: z.number().describe('The number of questions to include in the mock test.'),
});
export type CreateMockTestPaperInput = z.infer<typeof CreateMockTestPaperInputSchema>;

const CreateMockTestPaperOutputSchema = z.object({
  testPaper: z.string().describe('The mock test paper with the specified number of questions.'),
});
export type CreateMockTestPaperOutput = z.infer<typeof CreateMockTestPaperOutputSchema>;

export async function createMockTestPaper(input: CreateMockTestPaperInput): Promise<CreateMockTestPaperOutput> {
  return createMockTestPaperFlow(input);
}

const prompt = ai.definePrompt({
  name: 'createMockTestPaperPrompt',
  input: {schema: CreateMockTestPaperInputSchema},
  output: {schema: CreateMockTestPaperOutputSchema},
  prompt: `You are an expert in creating mock test papers.

You will receive a list of multiple-choice questions and a topic. Your task is to create a mock test paper using the provided questions. The test paper should have the specified number of questions and cover the given topic.

Topic: {{{topic}}}
Number of Questions: {{{numQuestions}}}
Multiple-Choice Questions:
{{#each mcqs}}{{{this}}}
{{/each}}

Create a mock test paper with the specified number of questions, based on the topic and MCQs.
`,
});

const createMockTestPaperFlow = ai.defineFlow(
  {
    name: 'createMockTestPaperFlow',
    inputSchema: CreateMockTestPaperInputSchema,
    outputSchema: CreateMockTestPaperOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
