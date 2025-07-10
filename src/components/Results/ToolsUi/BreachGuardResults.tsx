import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BreachGuardData, BreachGuardEntry } from '@/types/breachguard';
import NoResultFound from './NoResultFound';
import { Shield, AlertCircle, Key, User, MapPin, Phone, CreditCard, Calendar, Globe, FileText, LayoutGrid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BreachGuardResultsProps {
  data: unknown;
  query: string;
}

// Helper function to format date
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Helper function to get icon for data class
const getIconForDataClass = (dataClass: string) => {
  const lowerClass = dataClass.toLowerCase();
  if (lowerClass.includes('email')) return <Shield className="w-4 h-4" />;
  if (lowerClass.includes('password')) return <Key className="w-4 h-4" />;
  if (lowerClass.includes('name') || lowerClass.includes('username')) return <User className="w-4 h-4" />;
  if (lowerClass.includes('address')) return <MapPin className="w-4 h-4" />;
  if (lowerClass.includes('phone')) return <Phone className="w-4 h-4" />;
  if (lowerClass.includes('credit') || lowerClass.includes('payment')) return <CreditCard className="w-4 h-4" />;
  if (lowerClass.includes('date')) return <Calendar className="w-4 h-4" />;
  if (lowerClass.includes('url') || lowerClass.includes('website')) return <Globe className="w-4 h-4" />;
  return <FileText className="w-4 h-4" />;
};

export default function BreachGuardResults({ data, query }: BreachGuardResultsProps) {
  const [isGridView, setIsGridView] = useState(true);

  if (!data) {
    return <NoResultFound toolName="Breach Guard" message={`No breach data found for ${query}`} />;
  }

  const typedData = data as BreachGuardData;
  const breaches = typedData.breaches || [];

  if (breaches.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-xl text-emerald-400 flex items-center gap-2">
              <Shield className="w-6 h-6" />
              No Breaches Found
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Good news! We could not find any breaches associated with {query}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const renderBreachCard = (breach: BreachGuardEntry) => (
    <Card key={breach.Name}  className=" bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors">
      <CardHeader>
        <div className="flex items-center gap-4">
          {breach.LogoPath && (
            <img 
              src={breach.LogoPath} 
              alt={`${breach.Name} logo`} 
              className="w-12 h-12 object-contain rounded bg-white/10 p-1"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://placehold.co/100x100?text=${breach.Name.charAt(0)}`;
              }}
            />
          )}
          <div>
            <CardTitle className="text-lg text-zinc-100">{breach.Title}</CardTitle>
            <CardDescription className="text-zinc-400">
              Breach Date: {formatDate(breach.BreachDate)} • {breach.PwnCount.toLocaleString()} records affected
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-zinc-500">Added: {formatDate(breach.AddedDate)}</p>
            <div className="mt-2 text-sm text-zinc-300 prose prose-zinc prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: breach.Description }} />
          </div>

          <div>
            <h4 className="text-sm font-medium mb-3 text-zinc-300">Compromised Data:</h4>
            <div className="grid grid-cols-2 gap-2">
              {breach.DataClasses.map((dataClass: string, index: number) => (
                <div 
                  key={index}
                  className="flex items-center gap-2 p-2 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 transition-colors"
                >
                  <span className="text-zinc-400">
                    {getIconForDataClass(dataClass)}
                  </span>
                  <span className="text-sm text-zinc-300">{dataClass}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>

      {breach.Domain && (
        <CardFooter className="text-xs text-zinc-600">
          Domain: {breach.Domain}
        </CardFooter>
      )}
    </Card>
  );

  return (
    <div className="w-full max-w-6xl mx-auto p-6 ">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-zinc-100 flex items-center gap-2">
            <AlertCircle className="w-6 h-6 text-red-400" />
            Found {breaches.length} Breaches
          </h2>
          <p className="text-zinc-400 mt-2">
            The following breaches were found associated with {query}
          </p>
        </div>
        <div className="flex gap-2 items-center bg-black/90 rounded-lg px-3 py-2 shadow-inner border border-white/10">
          <span className="text-xs text-white mr-2">View:</span>
          <Button
            variant={isGridView ? "secondary" : "ghost"}
            size="icon"
            aria-label="Grid view"
            onClick={() => setIsGridView(true)}
            className={`transition-colors border border-white/20 ${isGridView ? "bg-white text-black ring-2 ring-white" : "bg-black text-white hover:bg-white/10"}`}
          >
            <LayoutGrid className={`w-5 h-5 ${isGridView ? "text-black" : "text-white/70"}`} />
          </Button>
          <Button
            variant={!isGridView ? "secondary" : "ghost"}
            size="icon"
            aria-label="List view"
            onClick={() => setIsGridView(false)}
            className={`transition-colors border border-white/20 ${!isGridView ? "bg-white text-black ring-2 ring-white" : "bg-black text-white hover:bg-white/10"}`}
          >
            <List className={`w-5 h-5 ${!isGridView ? "text-black" : "text-white/70"}`} />
          </Button>
        </div>
      </div>

      <div className={isGridView ? "grid gap-6 md:grid-cols-2" : "flex flex-col gap-6"}>
        {breaches.map(renderBreachCard)}
      </div>
    </div>
  );
}
