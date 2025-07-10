import React from 'react';
import { SearchX } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface NoResultFoundProps {
  toolName: string;
  message: string;
}

export default function NoResultFound({ toolName, message }: NoResultFoundProps) {
  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <Card className="bg-[#18181B] border-zinc-800">
        <CardHeader>
          <CardTitle className="text-xl text-zinc-400 flex items-center gap-2">
            <SearchX className="w-6 h-6" />
            {toolName} - No Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-zinc-300">{message}</p>
        </CardContent>
      </Card>
    </div>
  );
} 