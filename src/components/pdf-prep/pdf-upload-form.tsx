'use client';

import { useRef, useState } from 'react';
import { UploadCloud, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface PdfUploadFormProps {
  onMcqsGenerated: (mcqs: any[]) => void;
  onError: (message: string) => void;
  setIsLoading: (isLoading: boolean) => void;
  isLoading: boolean;
}

export default function PdfUploadForm({ onMcqsGenerated, onError, setIsLoading, isLoading }: PdfUploadFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!fileInputRef.current?.files?.[0]) {
      onError('Please select a PDF file to upload.');
      return;
    }

    const formData = new FormData(event.currentTarget);
    setIsLoading(true);
    onError(''); // Clear previous errors

    // Server action is imported and used here, ensure actions.ts exports it.
    // For this example, assume `processPdfAndGenerateMcqs` is imported from '@/app/actions'
    const { processPdfAndGenerateMcqs } = await import('@/app/actions');
    const result = await processPdfAndGenerateMcqs(formData);
    
    setIsLoading(false);

    if (result.error) {
      onError(result.error);
    } else if (result.mcqs) {
      onMcqsGenerated(result.mcqs);
      setFileName(null); // Reset file name after successful upload
      if(fileInputRef.current) fileInputRef.current.value = ''; // Reset file input
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
    } else {
      setFileName(null);
    }
  };

  return (
    <Card className="w-full max-w-lg shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl text-primary flex items-center gap-2">
          <UploadCloud className="w-7 h-7" />
          Upload PDF Document
        </CardTitle>
        <CardDescription>
          Upload your PDF (chapter, book, research paper, lecture notes) to generate MCQs.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="pdfFile" className="text-base font-medium">PDF File</Label>
            <div className="relative">
              <Input
                id="pdfFile"
                name="pdfFile"
                type="file"
                accept=".pdf"
                ref={fileInputRef}
                onChange={handleFileChange}
                required
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-accent file:text-accent-foreground hover:file:bg-accent/90 px-4 h-13"
              />
            </div>
            {fileName && <p className="text-sm text-muted-foreground mt-1">Selected file: {fileName}</p>}
          </div>
          <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-lg py-6" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processing PDF...
              </>
            ) : (
              'Generate MCQs'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}