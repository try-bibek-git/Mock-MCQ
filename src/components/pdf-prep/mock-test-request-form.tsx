'use client';

import { useState } from 'react';
import { ClipboardList, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { GeneratedMcqItem, MockTestCreationParams } from '@/types';

interface MockTestRequestFormProps {
  mcqs: GeneratedMcqItem[];
  onMockTestGenerated: (testPaper: string) => void;
  onError: (message: string) => void;
  setIsLoading: (isLoading: boolean) => void;
  isLoading: boolean;
}

export default function MockTestRequestForm({ mcqs, onMockTestGenerated, onError, setIsLoading, isLoading }: MockTestRequestFormProps) {
  const [topic, setTopic] = useState('');
  const [numQuestions, setNumQuestions] = useState<number>(Math.min(10, mcqs.length));

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (mcqs.length === 0) {
      onError('Cannot generate a test without MCQs. Please upload a PDF first.');
      return;
    }
    if (!topic.trim()) {
      onError('Please provide a topic for the mock test.');
      return;
    }
    if (numQuestions <= 0 || numQuestions > mcqs.length) {
      onError(`Number of questions must be between 1 and ${mcqs.length}.`);
      return;
    }

    setIsLoading(true);
    onError(''); // Clear previous errors

    const mcqQuestions = mcqs.map(mcq => mcq.question);
    const params: MockTestCreationParams = { mcqQuestions, topic, numQuestions };

    const { generateMockTest } = await import('@/app/actions');
    const result = await generateMockTest(params);

    setIsLoading(false);

    if (result.error) {
      onError(result.error);
    } else if (result.testPaper) {
      onMockTestGenerated(result.testPaper);
    }
  };

  if (mcqs.length === 0) {
    return null; // Don't show this form if there are no MCQs
  }

  return (
    <Card className="w-full max-w-lg mt-8 shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl text-primary flex items-center gap-2">
          <ClipboardList className="w-7 h-7" />
          Create Mock Test
        </CardTitle>
        <CardDescription>
          Enter a topic and select the number of questions for your mock test.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="topic" className="text-base font-medium">Test Topic</Label>
            <Input
              id="topic"
              name="topic"
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Chapter 1 Review, Quantum Physics Basics"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="numQuestions" className="text-base font-medium">Number of Questions</Label>
            <Input
              id="numQuestions"
              name="numQuestions"
              type="number"
              value={numQuestions}
              onChange={(e) => setNumQuestions(parseInt(e.target.value, 10))}
              min="1"
              max={mcqs.length}
              required
            />
             <p className="text-sm text-muted-foreground">Available MCQs: {mcqs.length}</p>
          </div>
          <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-6" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Generating Test...
              </>
            ) : (
              'Generate Mock Test'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}