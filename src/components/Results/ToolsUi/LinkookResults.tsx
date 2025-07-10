import { useState, useEffect, useCallback } from "react";
import { Link } from "lucide-react";
import { Button } from "@/components/ui/button";
import NoResultFound from "./NoResultFound";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface LinkookSite {
  site: string;
  url: string;
  linked_accounts?: string[];
}

interface LinkookData {
  username: string;
  found_accounts: number;
  sites: LinkookSite[];
}

interface LinkookResultsProps {
  data: unknown;
}

export default function LinkookResults({ data }: LinkookResultsProps) {
  if (!data) {
    return <NoResultFound toolName="Linkook" message="No Linkook data found." />;
  }

  const typedData = data as LinkookData;
  const [expandedSites, setExpandedSites] = useState<string[]>([]);
  const [aggregatedAccounts, setAggregatedAccounts] = useState<Map<string, Set<string>>>(new Map());

  // Function to aggregate accounts by site
  const aggregateAccounts = useCallback((sites: LinkookSite[]) => {
    const accountMap = new Map<string, Set<string>>();
    
    sites.forEach((site) => {
      if (site.linked_accounts) {
        site.linked_accounts.forEach((accountStr: string) => {
          const accounts = accountMap.get(site.site) || new Set<string>();
          accounts.add(accountStr);
          accountMap.set(site.site, accounts);
        });
      }
    });
    
    return accountMap;
  }, []);

  useEffect(() => {
    setAggregatedAccounts(aggregateAccounts(typedData.sites));
  }, [typedData.sites, aggregateAccounts]);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="bg-[#18181B] border-zinc-800">
        <CardHeader className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold">
                Results for @{typedData.username}
              </CardTitle>
              <CardDescription className="text-muted-foreground mt-1">
                Found {typedData.found_accounts} connected accounts
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Accordion type="multiple" value={expandedSites} className="w-full">
            {typedData.sites.map((site: LinkookSite, index: number) => (
              <AccordionItem 
                key={`${site.site}-${index}`} 
                value={site.site}
                className="border-b border-zinc-800 last:border-0"
              >
                <AccordionTrigger className="px-6 py-4 hover:bg-zinc-800/50 hover:no-underline">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
                      <Link className="w-4 h-4 text-zinc-400" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-sm font-semibold text-zinc-200">
                        {site.site}
                      </h3>
                      <p className="text-xs text-zinc-400">
                        {site.linked_accounts?.length || 0} linked accounts
                      </p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 py-4">
                  <div className="space-y-4">
                    {site.linked_accounts?.map((account: string, idx: number) => (
                      <div
                        key={`${account}-${idx}`}
                        className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/50 border border-zinc-700"
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-sm text-zinc-300 font-mono">
                            {account}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-zinc-400 hover:text-zinc-200"
                          onClick={() => window.open(site.url, "_blank")}
                        >
                          View
                        </Button>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}