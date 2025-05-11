'use client';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { FileText, Printer, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ViewMockTestDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  testPaperContent: string | null;
  testTopic?: string;
}

export default function ViewMockTestDialog({ isOpen, onOpenChange, testPaperContent, testTopic }: ViewMockTestDialogProps) {
  const { toast } = useToast();

  const handlePrint = () => {
    const printableContent = testPaperContent || "";
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`<html><head><title>Mock Test: ${testTopic || 'Test'}</title>`);
      printWindow.document.write('<style>body{font-family: sans-serif; white-space: pre-wrap; word-wrap: break-word;} h1{text-align:center;}</style></head><body>');
      if(testTopic) printWindow.document.write(`<h1>Mock Test: ${testTopic}</h1>`);
      printWindow.document.write(printableContent.replace(/\n/g, '<br/>'));
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      printWindow.print();
    } else {
      toast({ title: "Print Error", description: "Could not open print window. Please check your browser's pop-up blocker.", variant: "destructive" });
    }
  };
  
  const handleCopy = () => {
    if (testPaperContent) {
      navigator.clipboard.writeText(testPaperContent)
        .then(() => toast({ title: "Copied to clipboard!", description: "Mock test content has been copied." }))
        .catch(err => toast({ title: "Copy Error", description: "Could not copy text.", variant: "destructive" }));
    }
  };

  if (!testPaperContent) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl md:max-w-3xl lg:max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl text-primary flex items-center gap-2">
            <FileText className="w-7 h-7" />
            Mock Test Paper {testTopic ? `- ${testTopic}` : ''}
          </DialogTitle>
          <DialogDescription>
            Here is your generated mock test. You can review it, print, or copy the content.
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="flex-grow p-1 rounded-md border bg-muted/30 max-h-[65vh] my-4">
          <pre className="text-sm whitespace-pre-wrap p-4 break-words leading-relaxed">
            {testPaperContent}
          </pre>
        </ScrollArea>
        
        <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={handleCopy} className="text-primary border-primary hover:bg-primary/10">
            <Copy className="mr-2 h-4 w-4" /> Copy Text
          </Button>
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" /> Print Test
          </Button>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}