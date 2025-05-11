'use client';

import { Lightbulb, ChevronDown, CheckCircle2, XCircle } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { GeneratedMcqItem } from '@/types';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useState } from 'react';
import { Button } from '../ui/button';

interface GeneratedMcqListProps {
  mcqs: GeneratedMcqItem[];
}

interface McqSelection {
  [mcqId: string]: string; // mcqId: selectedOption
}

interface McqResult {
  [mcqId: string]: boolean; // mcqId: isCorrect
}

export default function GeneratedMcqList({ mcqs }: GeneratedMcqListProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<McqSelection>({});
  const [revealedAnswers, setRevealedAnswers] = useState<{[key: string]: boolean}>({});
  const [results, setResults] = useState<McqResult>({});

  if (!mcqs || mcqs.length === 0) {
    return null;
  }

  const handleOptionChange = (mcqId: string, option: string) => {
    setSelectedAnswers(prev => ({ ...prev, [mcqId]: option }));
    // If answer was previously revealed for this MCQ, clear its result
    if (revealedAnswers[mcqId]) {
      setResults(prev => {
        const newResults = {...prev};
        delete newResults[mcqId];
        return newResults;
      });
      setRevealedAnswers(prev => ({ ...prev, [mcqId]: false }));
    }
  };

  const toggleRevealAnswer = (mcqId: string, correctAnswer: string) => {
    setRevealedAnswers(prev => ({ ...prev, [mcqId]: !prev[mcqId] }));
    if (!revealedAnswers[mcqId]) { // If revealing for the first time after selection or without selection
      const selectedOption = selectedAnswers[mcqId];
      if (selectedOption) {
        setResults(prev => ({ ...prev, [mcqId]: selectedOption === correctAnswer }));
      }
    } else { // Hiding answer
       setResults(prev => {
        const newResults = {...prev};
        delete newResults[mcqId];
        return newResults;
      });
    }
  };


  return (
    <Card className="w-full mt-8 shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl text-primary flex items-center gap-2">
          <Lightbulb className="w-7 h-7" />
          Generated Multiple-Choice Questions
        </CardTitle>
        <CardDescription>
          Review the MCQs generated from your document. Select an option and click "Reveal Answer" to check.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full space-y-4">
          {mcqs.map((mcq, index) => (
            <AccordionItem key={mcq.id} value={`item-${index}`} className="bg-background/50 rounded-lg border border-border p-1">
              <AccordionTrigger className="text-left hover:no-underline px-4 py-3 text-base font-medium text-foreground [&[data-state=open]>svg]:text-accent">
                <div className="flex items-center w-full">
                  <span className="font-semibold mr-2 text-primary">{index + 1}.</span>
                  <span className="flex-1">{mcq.question}</span>
                  {results[mcq.id] !== undefined && (
                    results[mcq.id] ? 
                    <CheckCircle2 className="w-5 h-5 text-green-500 ml-2" /> : 
                    <XCircle className="w-5 h-5 text-red-500 ml-2" />
                  )}
                  <ChevronDown className="h-5 w-5 shrink-0 transition-transform duration-200 ml-auto" />
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pt-2 pb-4 space-y-3">
                <RadioGroup 
                  value={selectedAnswers[mcq.id] || ""}
                  onValueChange={(value) => handleOptionChange(mcq.id, value)}
                  className="space-y-2"
                >
                  {mcq.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value={option} id={`${mcq.id}-option-${optionIndex}`} />
                      <Label htmlFor={`${mcq.id}-option-${optionIndex}`} className="flex-1 cursor-pointer text-foreground/90">
                        {option}
                      </Label>
                       {revealedAnswers[mcq.id] && option === mcq.answer && (
                        <Badge variant="default" className="bg-green-500 hover:bg-green-600 text-white">Correct</Badge>
                      )}
                      {revealedAnswers[mcq.id] && option !== mcq.answer && selectedAnswers[mcq.id] === option && (
                        <Badge variant="destructive">Incorrect</Badge>
                      )}
                    </div>
                  ))}
                </RadioGroup>
                <Button 
                  onClick={() => toggleRevealAnswer(mcq.id, mcq.answer)} 
                  variant="outline" 
                  className="mt-3 text-accent border-accent hover:bg-accent/10 hover:text-accent"
                  disabled={!selectedAnswers[mcq.id] && !revealedAnswers[mcq.id]}
                >
                  {revealedAnswers[mcq.id] ? 'Hide Answer' : 'Reveal Answer'}
                </Button>
                {revealedAnswers[mcq.id] && (
                  <p className="mt-2 text-sm font-semibold text-foreground">
                    Correct Answer: <span className="text-green-600">{mcq.answer}</span>
                  </p>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}