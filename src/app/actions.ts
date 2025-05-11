'use server';

import type { GenerateMcqsInput, GenerateMcqsOutput } from '@/ai/flows/generate-mcqs';
import { generateMcqs } from '@/ai/flows/generate-mcqs';
import type { CreateMockTestPaperInput, CreateMockTestPaperOutput } from '@/ai/flows/create-mock-test';
import { createMockTestPaper } from '@/ai/flows/create-mock-test';
import type { GeneratedMcqItem, MockTestCreationParams } from '@/types';

// Import 'pdf-parse/lib/pdf-parse.js' to avoid issues in some environments like Vercel
// The library 'pdf-parse' might try to access file system in a way that's not compatible with serverless environments
// by default, the '.js' specific import often points to a version that's more environment-agnostic
// or pre-bundled/processed to avoid such issues.
// If 'pdf-parse' itself works, that's fine, but this is a common workaround.
// For now, let's try with the direct 'pdf-parse' and if issues persist, switch to 'pdf-parse/lib/pdf-parse.js'
// The previous error log showed an ENOENT error related to pdf-parse trying to open a test file,
// which indicates it might be trying to resolve paths relative to its own package,
// which can fail in bundled environments. Using the direct lib import sometimes bypasses these issues.
// Given the specific error "ENOENT: no such file or directory, open './test/data/05-versions-space.pdf'" from pdf-parse,
// it's safer to use the lib import.
import pdf from 'pdf-parse/lib/pdf-parse.js';


export async function processPdfAndGenerateMcqs(formData: FormData): Promise<{ mcqs?: GeneratedMcqItem[]; error?: string }> {
  const file = formData.get('pdfFile') as File;

  if (!file) {
    return { error: 'No PDF file uploaded.' };
  }

  if (file.type !== 'application/pdf') {
    return { error: 'Invalid file type. Please upload a PDF.' };
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const pdfData = await pdf(buffer);
    
    const pdfText = pdfData.text;

    if (!pdfText.trim()) {
      return { error: 'Could not extract text from the PDF. The PDF might be empty or image-based.' };
    }

    const input: GenerateMcqsInput = { pdfText };
    const output: GenerateMcqsOutput = await generateMcqs(input);

    const mcqsWithIds: GeneratedMcqItem[] = output.mcqs.map((mcq, index) => ({
      ...mcq,
      id: `mcq-${Date.now()}-${index}`, // Generate a unique ID
    }));

    return { mcqs: mcqsWithIds };

  } catch (err: any) {
    console.error('Error processing PDF and generating MCQs:', err);
    // Check if the error is from pdf-parse itself related to file system access
    if (err.message && (err.message.includes('ENOENT') || err.message.includes('llex'))) {
        return { error: "Failed to process PDF: A required library component ('pdf-parse' or 'pdf.js-dist') encountered an internal file access error. This might be due to an environment configuration issue." };
    }
    return { error: err.message || 'An unknown error occurred while processing the PDF.' };
  }
}

export async function generateMockTest(params: MockTestCreationParams): Promise<{ testPaper?: string; error?: string }> {
  const { mcqQuestions, topic, numQuestions } = params;

  if (!mcqQuestions || mcqQuestions.length === 0) {
    return { error: 'No MCQs provided to generate the test.' };
  }
  if (!topic.trim()) {
    return { error: 'Test topic cannot be empty.' };
  }
  if (numQuestions <= 0) {
    return { error: 'Number of questions must be greater than zero.' };
  }
  if (numQuestions > mcqQuestions.length) {
    return { error: `Requested ${numQuestions} questions, but only ${mcqQuestions.length} MCQs are available.`}
  }

  try {
    const input: CreateMockTestPaperInput = {
      mcqs: mcqQuestions, // The flow expects an array of strings (questions)
      topic,
      numQuestions,
    };
    const output: CreateMockTestPaperOutput = await createMockTestPaper(input);
    return { testPaper: output.testPaper };
  } catch (err: any) {
    console.error('Error generating mock test:', err);
    return { error: err.message || 'An unknown error occurred while generating the mock test.' };
  }
}
