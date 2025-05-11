// src/ai/flows/generate-mcqs.ts
'use server';

/**
 * @fileOverview Generates multiple-choice questions (MCQs) from a PDF content.
 *
 * - generateMcqs - A function that handles the generation of MCQs from PDF content.
 * - GenerateMcqsInput - The input type for the generateMcqs function.
 * - GenerateMcqsOutput - The return type for the generateMcqs function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMcqsInputSchema = z.object({
  pdfText: z.string().describe('The text content extracted from the PDF document.'),
});
export type GenerateMcqsInput = z.infer<typeof GenerateMcqsInputSchema>;

const GenerateMcqsOutputSchema = z.object({
  mcqs: z
    .array(
      z.object({
        question: z.string().describe('The multiple-choice question.'),
        options: z.array(z.string()).describe('The options for the question.'),
        answer: z.string().describe('The correct answer to the question.'),
      })
    )
    .describe('The generated multiple-choice questions.'),
});
export type GenerateMcqsOutput = z.infer<typeof GenerateMcqsOutputSchema>;

export async function generateMcqs(input: GenerateMcqsInput): Promise<GenerateMcqsOutput> {
  return generateMcqsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateMcqsPrompt',
  input: {schema: GenerateMcqsInputSchema},
  output: {schema: GenerateMcqsOutputSchema},
  prompt: `You are an expert in creating multiple-choice questions (MCQs) from text.

  Given the following text from a PDF, generate a set of MCQs to test the user's understanding of the material.
  Each question should have 4 options, and one of them should be the correct answer.

  PDF Text: {{{pdfText}}}

  Format the output as a JSON object with an array of mcqs. Each mcq should have a question, an array of options, and the correct answer.
  `,
});

const generateMcqsFlow = ai.defineFlow(
  {
    name: 'generateMcqsFlow',
    inputSchema: GenerateMcqsInputSchema,
    outputSchema: GenerateMcqsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
