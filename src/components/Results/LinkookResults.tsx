import { useState, useMemo, useEffect, useRef } from "react";
import { OsintResult, AggregatedAccount, Site } from "@/types/types";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link } from "lucide-react";

interface LinkookResultsProps {
  data: OsintResult | null;
}

export default function LinkookResults({ data }: LinkookResultsProps) {
  // State for expanded sites in accordion
  const [expandedSites, setExpandedSites] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Canvas refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const expandedCanvasRef = useRef<HTMLCanvasElement>(null);

  // Toggle site expansion
  const toggleSite = (site: string) => {
    setExpandedSites((prev) => 
      prev.includes(site) 
        ? prev.filter(s => s !== site) 
        : [...prev, site]
    );
  };

  // Draw map function (enhanced for better visualization)
  const drawMap = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext("2d");
    if (!ctx || !data) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Enhanced visualization: draw nodes for each site, connect linked accounts
    const width = canvas.width;
    const height = canvas.height;
    const sites = data.sites;
    const nodeRadius = 32;
    const centerX = width / 2;
    const centerY = height / 2;
    const angleStep = (2 * Math.PI) / sites.length;
    const nodePositions: { [site: string]: { x: number; y: number } } = {};

    // Draw nodes in a circle
    sites.forEach((site, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const x = centerX + Math.cos(angle) * (Math.min(width, height) / 2.5);
      const y = centerY + Math.sin(angle) * (Math.min(width, height) / 2.5);
      nodePositions[site.site] = { x, y };
    });

    // Draw connections (edges) for linked accounts
    ctx.save();
    ctx.globalAlpha = 0.5;
    ctx.strokeStyle = "#14b8a6";
    ctx.lineWidth = 2;
    sites.forEach((site) => {
      if (site.linked_accounts) {
        site.linked_accounts.forEach((account) => {
          const parts = account.split(": ");
          if (parts.length === 2) {
            const platform = parts[0];
            // Try to find a site node for the platform
            if (nodePositions[platform]) {
              ctx.beginPath();
              ctx.moveTo(nodePositions[site.site].x, nodePositions[site.site].y);
              ctx.lineTo(nodePositions[platform].x, nodePositions[platform].y);
              ctx.stroke();
            }
          }
        });
      }
    });
    ctx.restore();

    // Draw nodes (sites)
    sites.forEach((site) => {
      const { x, y } = nodePositions[site.site];
      // Node shadow
      ctx.save();
      ctx.beginPath();
      ctx.arc(x, y, nodeRadius + 6, 0, 2 * Math.PI);
      ctx.fillStyle = "rgba(20, 184, 166, 0.10)";
      ctx.shadowColor = "#14b8a6";
      ctx.shadowBlur = 16;
      ctx.fill();
      ctx.restore();
      // Node circle
      ctx.beginPath();
      ctx.arc(x, y, nodeRadius, 0, 2 * Math.PI);
      ctx.fillStyle = "#23272f";
      ctx.strokeStyle = "#14b8a6";
      ctx.lineWidth = 3;
      ctx.fill();
      ctx.stroke();
      // Site name
      ctx.fillStyle = "#fff";
      ctx.font = "bold 16px Inter, Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(site.site, x, y);
    });
  };

  // Aggregate linked accounts from all sites
  const aggregatedAccounts = useMemo(() => {
    if (!data) return [];
    
    const accountMap = new Map<string, AggregatedAccount>();

    data.sites.forEach((site: Site) => {
      if (site.linked_accounts) {
        site.linked_accounts.forEach((accountStr: string) => {
          const parts = accountStr.split(": ");
          if (parts.length === 2) {
            const platform = parts[0].trim();
            const url = parts[1].trim();
            
            const key = `${platform}-${url}`;
            if (accountMap.has(key)) {
              const account = accountMap.get(key)!;
              if (!account.sources.includes(site.site)) {
                account.sources.push(site.site);
              }
            } else {
              accountMap.set(key, {
                platform,
                url,
                sources: [site.site]
              });
            }
          }
        });
      }
    });

    return Array.from(accountMap.values());
  }, [data]);

  // Group accounts by platform
  const groupedAccounts = useMemo(() => {
    const groups = new Map<string, AggregatedAccount[]>();
    
    aggregatedAccounts.forEach(account => {
      if (!groups.has(account.platform)) {
        groups.set(account.platform, []);
      }
      groups.get(account.platform)!.push(account);
    });
    
    return groups;
  }, [aggregatedAccounts]);

  // Handle canvas resize and drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !data) return;

    const updateCanvasSize = () => {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.clientWidth;
        const height = window.innerWidth < 640 ? 400 : 600;
        canvas.height = height;
        drawMap(canvas);
      }
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);

    return () => {
      window.removeEventListener("resize", updateCanvasSize);
    };
  }, [data, drawMap]);

  useEffect(() => {
    if (!isExpanded || !data) return;

    const expandedCanvas = expandedCanvasRef.current;
    if (!expandedCanvas) return;

    expandedCanvas.width = expandedCanvas.parentElement?.clientWidth || 1200;
    expandedCanvas.height = expandedCanvas.parentElement?.clientHeight || 800;

    drawMap(expandedCanvas);
  }, [isExpanded, data, drawMap]);

  if (!data) return (
    <div className="w-full flex flex-col items-center justify-center py-16">
      <div className="text-gray-400 text-lg">No Linkook data found.</div>
    </div>
  );

  return (
    <div className="w-full flex flex-col items-center space-y-8">
      {/* Main Results Card */}
      <div className="w-full max-w-3xl mx-auto">
        <Card className="bg-black text-white border border-zinc-800 overflow-hidden">
          <CardHeader className="osint-gradient">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <CardTitle className="text-xl font-bold">
                  Results for @{data.username}
                </CardTitle>
                <CardDescription className="text-muted-foreground mt-1">
                  Found {data.found_accounts} connected accounts
                </CardDescription>
              </div>
              
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <Accordion type="multiple" value={expandedSites} className="w-full">
              {data.sites.map((site, index) => (
                <AccordionItem 
                  key={`${site.site}-${index}`} 
                  value={site.site}
                  className="border-b border-border/50 last:border-0"
                >
                  <AccordionTrigger 
                    className="py-3 px-3 sm:py-4 sm:px-6 hover:bg-osint-accent/10"
                    onClick={() => toggleSite(site.site)}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-2">
                      <span className="font-medium text-left">{site.site}</span>
                      <a 
                        href={site.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-sm text-teal-400 underline hover:text-teal-300 sm:mr-4 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        View Profile
                      </a>
                    </div>
                  </AccordionTrigger>
                  
                  <AccordionContent className="px-3 sm:px-6 py-2 bg-black/80">
                    {site.linked_accounts && site.linked_accounts.length > 0 ? (
                      <div className="space-y-2 py-2">
                        <h4 className="text-sm text-zinc-400 mb-2">Linked Accounts:</h4>
                        <ul className="space-y-3">
                          {site.linked_accounts.map((account, accIndex) => {
                            const parts = account.split(": ");
                            const platform = parts[0];
                            const url = parts[1];
                            
                            return (
                              <li key={accIndex} className="flex items-start gap-2">
                                <div className="w-8 h-8 rounded-full bg-osint-accent/50 flex items-center justify-center flex-shrink-0">
                                  <span className="text-xs font-bold">{platform.charAt(0)}</span>
                                </div>
                                <div className="overflow-hidden">
                                  <p className="text-sm font-medium text-white">{platform}</p>
                                  <a 
                                    href={url} 
                                    target="_blank"  
                                    rel="noopener noreferrer"
                                    className="text-xs text-teal-400 hover:text-teal-300 hover:underline break-all transition-colors"
                                  >
                                    {url}
                                  </a>
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    ) : (
                      <p className="text-sm text-zinc-400 py-2">No linked accounts found.</p>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>

      {/* Aggregated Linked Accounts */}
      {aggregatedAccounts.length > 0 && (
        <div className="w-full max-w-3xl mx-auto">
          <Card className="bg-black text-white border border-zinc-800 overflow-hidden">
            <CardHeader className="osint-gradient">
              <CardTitle className="text-xl font-bold">
                All Connected Accounts
              </CardTitle>
              <CardDescription className="text-muted-foreground mt-1">
                Found {aggregatedAccounts.length} unique connected accounts across {groupedAccounts.size} platforms
              </CardDescription>
            </CardHeader>

            <CardContent className="p-3 sm:p-6">
              {Array.from(groupedAccounts.entries()).map(([platform, accounts]) => (
                <div key={platform} className="mb-6 last:mb-0">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-full bg-osint-accent/70 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold">{platform.charAt(0)}</span>
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold">{platform}</h3>
                  </div>
                  
                  <div className="space-y-3 pl-4 sm:pl-10">
                    {accounts.map((account, index) => (
                      <div key={index} className="flex flex-col">
                        <a 
                          href={account.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-teal-400 hover:text-teal-300 hover:underline flex items-center gap-2 text-sm sm:text-base break-all transition-colors"
                        >
                          <Link size={14} className="flex-shrink-0" />
                          <span className="break-all">{account.url}</span>
                        </a>
                        <div className="text-xs text-zinc-400 mt-1">
                          Found on: {account.sources.join(", ")}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <Separator className="mt-4 mb-4 last:hidden" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Account Connection Map */}
      <div className="w-full max-w-3xl mx-auto h-fit">
        <Card className="bg-black text-white border border-zinc-800 overflow-hidden">
          <CardHeader className="osint-gradient">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold">Account Connection Map</CardTitle>
                <CardDescription className="text-muted-foreground mt-1">
                  Visual representation of linked account relationships
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0 relative">
            <ScrollArea className="h-[400px] sm:h-[600px] w-full">
              <div className="p-2 sm:p-4">
                <canvas 
                  ref={canvasRef} 
                  className="w-full"
                />
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Dialog open={isExpanded} onOpenChange={setIsExpanded}>
          <DialogContent className="max-w-[95vw] w-[95vw] sm:max-w-[90vw] sm:w-[1200px] h-[80vh] sm:h-[90vh] p-0">
            <DialogTitle className="sr-only">Expanded Account Connection Map</DialogTitle>
            <ScrollArea className="w-full h-full">
              <div className="w-full h-full p-2 sm:p-6">
                <canvas 
                  ref={expandedCanvasRef} 
                  className="w-full h-full"
                />
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}