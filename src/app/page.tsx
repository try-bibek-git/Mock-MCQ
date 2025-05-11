'use client';

import { useState } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import PdfUploadForm from '@/components/pdf-prep/pdf-upload-form';
import GeneratedMcqList from '@/components/pdf-prep/generated-mcq-list';
import MockTestRequestForm from '@/components/pdf-prep/mock-test-request-form';
import ViewMockTestDialog from '@/components/pdf-prep/view-mock-test-dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import type { GeneratedMcqItem } from '@/types';

export default function PdfPrepPage() {
  const [mcqs, setMcqs] = useState<GeneratedMcqItem[]>([]);
  const [mockTestContent, setMockTestContent] = useState<string | null>(null);
  const [mockTestTopic, setMockTestTopic] = useState<string>('');
  const [isViewMockTestDialogOpen, setIsViewMockTestDialogOpen] = useState(false);
  
  const [isLoadingMcqs, setIsLoadingMcqs] = useState(false);
  const [isLoadingMockTest, setIsLoadingMockTest] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { toast } = useToast();

  const handleMcqsGenerated = (generatedMcqs: GeneratedMcqItem[]) => {
    setMcqs(generatedMcqs);
    setError(null); // Clear previous errors
    toast({
      title: "MCQs Generated!",
      description: `Successfully generated ${generatedMcqs.length} multiple-choice questions.`,
      variant: "default",
      action: <CheckCircle className="text-green-500" />,
    });
  };

  const handleMockTestGenerated = (testPaper: string, topic: string) => {
    setMockTestContent(testPaper);
    setMockTestTopic(topic);
    setIsViewMockTestDialogOpen(true);
    setError(null); // Clear previous errors
     toast({
      title: "Mock Test Created!",
      description: `Your mock test on "${topic}" is ready.`,
      variant: "default",
      action: <CheckCircle className="text-green-500" />,
    });
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    if(errorMessage){ // Only show toast if there's an actual error message
        toast({
        title: "An Error Occurred",
        description: errorMessage,
        variant: "destructive",
        });
    }
  };

  return (
    <div className="flex flex-col items-center space-y-10 py-6">
      {error && (
        <Alert variant="destructive" className="w-full max-w-xl">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <PdfUploadForm 
        onMcqsGenerated={handleMcqsGenerated} 
        onError={handleError}
        setIsLoading={setIsLoadingMcqs}
        isLoading={isLoadingMcqs}
      />

      {mcqs.length > 0 && !isLoadingMcqs && (
        <>
          <GeneratedMcqList mcqs={mcqs} />
          <MockTestRequestForm 
            mcqs={mcqs}
            onMockTestGenerated={(testPaper) => handleMockTestGenerated(testPaper, (document.getElementById('topic') as HTMLInputElement)?.value || 'Generated Test')}
            onError={handleError}
            setIsLoading={setIsLoadingMockTest}
            isLoading={isLoadingMockTest}
          />
        </>
      )}
      
      {mockTestContent && (
        <ViewMockTestDialog 
          isOpen={isViewMockTestDialogOpen}
          onOpenChange={setIsViewMockTestDialogOpen}
          testPaperContent={mockTestContent}
          testTopic={mockTestTopic}
        />
      )}
    </div>
  );
}