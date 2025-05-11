'use server';

import { generateMcqs } from '@/ai/flows/generate-mcqs';
import type { GenerateMcqsOutput } from '@/ai/flows/generate-mcqs';
import { createMockTestPaper } from '@/ai/flows/create-mock-test';
import type { CreateMockTestPaperOutput } from '@/ai/flows/create-mock-test';
import type { GeneratedMcqItem, MockTestCreationParams } from '@/types';
import pdf from 'pdf-parse';

export async function processPdfAndGenerateMcqs(formData: FormData): Promise<{ mcqs?: GeneratedMcqItem[]; error?: string }> {
  const file = formData.get('pdfFile') as File;

  if (!file || file.size === 0) {
    return { error: 'No PDF file provided.' };
  }

  if (file.type !== 'application/pdf') {
    return { error: 'Invalid file type. Please upload a PDF.' };
  }

  try {
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const data = await pdf(fileBuffer);
    const pdfText = data.text;

    if (!pdfText.trim()) {
      return { error: 'Could not extract text from PDF or PDF is empty.' };
    }
    
    // Basic text cleaning/truncation if necessary - Gemini has token limits
    const MAX_TEXT_LENGTH = 30000; // Adjust as needed based on model limits
    const truncatedText = pdfText.length > MAX_TEXT_LENGTH ? pdfText.substring(0, MAX_TEXT_LENGTH) : pdfText;


    const result: GenerateMcqsOutput = await generateMcqs({ pdfText: truncatedText });
    
    if (!result || !result.mcqs) {
        return { error: 'AI could not generate MCQs from the provided PDF.' };
    }

    const mcqsWithIds: GeneratedMcqItem[] = result.mcqs.map((mcq, index) => ({
      ...mcq,
      id: `mcq-${Date.now()}-${index}`,
    }));
    
    return { mcqs: mcqsWithIds };

  } catch (e: any) {
    console.error('Error processing PDF and generating MCQs:', e);
    return { error: e.message || 'An unexpected error occurred while processing the PDF.' };
  }
}

export async function generateMockTest(params: MockTestCreationParams): Promise<{ testPaper?: string; error?: string }> {
  const { mcqQuestions, topic, numQuestions } = params;

  if (!mcqQuestions || mcqQuestions.length === 0) {
    return { error: 'No MCQs provided to create a test.' };
  }
  if (!topic.trim()) {
    return { error: 'Test topic cannot be empty.' };
  }
  if (numQuestions <= 0) {
    return { error: 'Number of questions must be greater than 0.' };
  }

  try {
    const result: CreateMockTestPaperOutput = await createMockTestPaper({ 
      mcqs: mcqQuestions, 
      topic, 
      numQuestions 
    });

    if (!result || !result.testPaper) {
        return { error: 'AI could not generate the mock test paper.' };
    }
    
    return { testPaper: result.testPaper };

  } catch (e: any) {
    console.error('Error generating mock test:', e);
    return { error: e.message || 'An unexpected error occurred while creating the mock test.' };
  }
}