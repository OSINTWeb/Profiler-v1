import { useState, useMemo, useEffect, useRef, useCallback } from "react";
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
import { Link } from "lucide-react";

interface LinkookResultsProps {
  data: OsintResult | null;
}

interface GraphNode {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  type: 'site' | 'account';
  label: string;
  connections: number;
  url?: string;
  linkedAccounts?: string[];
}

interface GraphConnection {
  source: string;
  target: string;
  strength: number;
  color: string;
}

export default function LinkookResults({ data }: LinkookResultsProps) {
  // State for expanded sites in accordion
  const [expandedSites, setExpandedSites] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [animationFrame, setAnimationFrame] = useState<number | null>(null);
  const [isStable, setIsStable] = useState(false);
  const [iterationCount, setIterationCount] = useState(0);
  
  // Canvas refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const expandedCanvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<GraphNode[]>([]);
  const connectionsRef = useRef<GraphConnection[]>([]);

  // Toggle site expansion
  const toggleSite = (site: string) => {
    setExpandedSites((prev) => 
      prev.includes(site) 
        ? prev.filter(s => s !== site) 
        : [...prev, site]
    );
  };

  // Generate nodes and connections from data
  const generateGraphData = useCallback(() => {
    if (!data) return { nodes: [], connections: [] };

    const nodes: GraphNode[] = [];
    const connections: GraphConnection[] = [];
    const nodeMap = new Map<string, GraphNode>();
    const accountNodeMap = new Map<string, GraphNode>();
    
    // Create site nodes
    data.sites.forEach((site) => {
      const siteNode: GraphNode = {
        id: site.site,
        x: Math.random() * 600 + 300, // Increased initial spread
        y: Math.random() * 500 + 250,
        vx: 0,
        vy: 0,
        radius: Math.max(30, Math.min(55, (site.linked_accounts?.length || 0) * 6 + 30)),
        color: '#ffffff', // white
        type: 'site',
        label: site.site,
        connections: site.linked_accounts?.length || 0,
        url: site.url,
        linkedAccounts: site.linked_accounts
      };
      nodes.push(siteNode);
      nodeMap.set(site.site, siteNode);
    });

    // Create account nodes and connections
    data.sites.forEach((site) => {
      if (site.linked_accounts) {
        site.linked_accounts.forEach((accountStr) => {
          const parts = accountStr.split(": ");
          if (parts.length === 2) {
            const platform = parts[0].trim();
            const accountUrl = parts[1].trim();
            
            // Create unique ID for account node
            const accountId = `account_${platform}_${accountUrl}`;
            
            // Create account node if it doesn't exist
            if (!accountNodeMap.has(accountId)) {
              const accountNode: GraphNode = {
                id: accountId,
                x: Math.random() * 600 + 300,
                y: Math.random() * 500 + 250,
                vx: 0,
                vy: 0,
                radius: Math.max(18, Math.min(28, 22)), // Slightly larger radius for account nodes
                color: '#e5e5e5', // light gray for account nodes
                type: 'account',
                label: `${platform}: ${accountUrl}`,
                connections: 1,
                url: accountUrl
              };
              nodes.push(accountNode);
              accountNodeMap.set(accountId, accountNode);
            } else {
              // Increment connection count for existing account node
              const existingNode = accountNodeMap.get(accountId)!;
              existingNode.connections += 1;
            }
            
            // Create connection between site and account
            connections.push({
              source: site.site,
              target: accountId,
              strength: 1,
              color: '#666666' // gray
            });
          }
        });
      }
    });

    return { nodes, connections };
  }, [data]);

  // Physics simulation for force-directed layout with stabilization
  const runSimulation = useCallback((nodes: GraphNode[], connections: GraphConnection[], canvas: HTMLCanvasElement) => {
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    let totalMovement = 0;
    const dampingFactor = 0.85; // Adjusted for smoother movement
    const velocityThreshold = 0.05; // Lower threshold for better stability

    // Apply forces
    nodes.forEach((node) => {
      // Reset forces
      let fx = 0;
      let fy = 0;

      // Gentle center gravity
      const dx = centerX - node.x;
      const dy = centerY - node.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance > 0) {
        fx += (dx / distance) * 0.005; // Reduced center gravity
        fy += (dy / distance) * 0.005;
      }

      // Improved node repulsion
      nodes.forEach((other) => {
        if (node.id !== other.id) {
          const dx = node.x - other.x;
          const dy = node.y - other.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const minDistance = node.radius + other.radius + 80; // Significantly increased minimum distance
          
          if (distance < minDistance && distance > 0) {
            const force = (minDistance - distance) / distance * 0.2; // Increased repulsion strength
            fx += (dx / distance) * force;
            fy += (dy / distance) * force;
          }
        }
      });

      // Refined connection forces
      connections.forEach((connection) => {
        if (connection.source === node.id || connection.target === node.id) {
          const other = nodes.find(n => 
            n.id === (connection.source === node.id ? connection.target : connection.source)
          );
          
          if (other) {
            const dx = other.x - node.x;
            const dy = other.y - node.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const optimalDistance = 250; // Significantly increased optimal distance
            
            if (distance > 0) {
              const force = (distance - optimalDistance) / distance * 0.02; // Gentler spring force
              fx += (dx / distance) * force;
              fy += (dy / distance) * force;
            }
          }
        }
      });

      // Apply improved damping and update velocity
      node.vx = (node.vx + fx) * dampingFactor;
      node.vy = (node.vy + fy) * dampingFactor;

      // Limit maximum velocity
      const maxVelocity = 2;
      const currentVelocity = Math.sqrt(node.vx * node.vx + node.vy * node.vy);
      if (currentVelocity > maxVelocity) {
        node.vx = (node.vx / currentVelocity) * maxVelocity;
        node.vy = (node.vy / currentVelocity) * maxVelocity;
      }

      // Track total movement for stability detection
      totalMovement += Math.abs(node.vx) + Math.abs(node.vy);

      // Update position with smoother movement
      node.x += node.vx;
      node.y += node.vy;

      // Improved boundary constraints with padding
      const padding = Math.max(80, node.radius + 40);
      node.x = Math.max(padding, Math.min(width - padding, node.x));
      node.y = Math.max(padding, Math.min(height - padding, node.y));
    });

    // Check for stability with averaged movement
    const avgMovement = totalMovement / (nodes.length || 1);
    return avgMovement < velocityThreshold;
  }, []);

  // Enhanced draw function with stabilization control
  const drawGraph = useCallback((canvas: HTMLCanvasElement, isExpanded = false) => {
    const ctx = canvas.getContext("2d");
    if (!ctx || !data) return;

    const { nodes, connections } = generateGraphData();
    
    // Only update refs if nodes have changed (on first render or data change)
    if (nodesRef.current.length === 0 || nodesRef.current.length !== nodes.length) {
      nodesRef.current = nodes;
      connectionsRef.current = connections;
      setIsStable(false);
      setIterationCount(0);
    }

    // Use existing nodes for consistency
    const currentNodes = nodesRef.current;
    const currentConnections = connectionsRef.current;

    // Clear canvas with gradient background
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Enhanced background gradient - Dark theme with subtle pattern
    const gradient = ctx.createRadialGradient(
      canvas.width / 2, canvas.height / 2, 0,
      canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) / 2
    );
    gradient.addColorStop(0, '#0a0a0a');
    gradient.addColorStop(0.3, '#111111');
    gradient.addColorStop(0.7, '#0d0d0d');
    gradient.addColorStop(1, '#000000');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add subtle grid pattern for better visual depth
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 0.5;
    ctx.globalAlpha = 0.3;
    
    const gridSize = 50;
    for (let x = 0; x < canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // Apply zoom and offset
    ctx.save();
    ctx.translate(offset.x, offset.y);
    ctx.scale(zoom, zoom);

    // Run physics simulation only if not stable
    let simulationStable = isStable;
    if (!isStable && iterationCount < 300) { // Max 300 iterations
      simulationStable = runSimulation(currentNodes, currentConnections, canvas);
      setIterationCount(prev => prev + 1);
      
      if (simulationStable || iterationCount >= 299) {
        setIsStable(true);
      }
    }

    // Draw connections with black and white styling
    currentConnections.forEach((connection) => {
      const source = currentNodes.find(n => n.id === connection.source);
      const target = currentNodes.find(n => n.id === connection.target);
      
      if (source && target) {
        ctx.save();
        
        // Highlight connection if related node is hovered
        const isHighlighted = hoveredNode === source.id || hoveredNode === target.id;
        
        ctx.globalAlpha = isHighlighted ? 0.9 : 0.3;
        ctx.strokeStyle = isHighlighted ? '#ffffff' : '#444444'; // white for highlight, darker gray for normal
        ctx.lineWidth = isHighlighted ? 3 : 1.5;
        
        // Animated dash for highlighted connections (only when stable)
        if (isHighlighted && isStable) {
          ctx.setLineDash([8, 4]);
          ctx.lineDashOffset = Date.now() / 80;
        }
        
        ctx.beginPath();
        ctx.moveTo(source.x, source.y);
        
        // Curved connections for better visual appeal
        const midX = (source.x + target.x) / 2;
        const midY = (source.y + target.y) / 2;
        const curveOffset = 35; // Increased curve for better spacing
        ctx.quadraticCurveTo(midX + curveOffset, midY - curveOffset, target.x, target.y);
        ctx.stroke();
        
        // Draw arrow head for highlighted connections
        if (isHighlighted) {
          const angle = Math.atan2(target.y - source.y, target.x - source.x);
          const arrowLength = 15;
          const arrowAngle = Math.PI / 6;
          
          ctx.save();
          ctx.translate(target.x, target.y);
          ctx.rotate(angle);
          ctx.beginPath();
          ctx.moveTo(-target.radius, 0);
          ctx.lineTo(-target.radius - arrowLength, -arrowLength * Math.tan(arrowAngle));
          ctx.lineTo(-target.radius - arrowLength, arrowLength * Math.tan(arrowAngle));
          ctx.closePath();
          ctx.fillStyle = '#ffffff'; // white arrow
          ctx.fill();
          ctx.restore();
        }
        
        ctx.restore();
      }
    });

    // Draw nodes with black and white styling
    currentNodes.forEach((node) => {
      const isHovered = hoveredNode === node.id;
      const isSelected = selectedNode === node.id;
      
      ctx.save();
      
      // Enhanced node glow effect
      if (isHovered || isSelected) {
        ctx.shadowColor = '#ffffff'; // white glow
        ctx.shadowBlur = 30;
        ctx.globalAlpha = 1;
      } else {
        // Subtle glow for all nodes
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 8;
        ctx.globalAlpha = 0.8;
      }
      
      // Enhanced outer ring for hovered/selected nodes
      if (isHovered || isSelected) {
        // Primary ring
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius + 10, 0, 2 * Math.PI);
        ctx.strokeStyle = '#ffffff'; // white ring
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // Secondary glow ring
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius + 15, 0, 2 * Math.PI);
        ctx.strokeStyle = '#cccccc'; // light gray
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.6;
        ctx.stroke();
        
        // Tertiary outer ring
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius + 20, 0, 2 * Math.PI);
        ctx.strokeStyle = '#999999'; // darker gray
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.3;
        ctx.stroke();
      }
      
      // Enhanced main node circle with improved gradients
      const nodeGradient = ctx.createRadialGradient(
        node.x - node.radius / 3, node.y - node.radius / 3, 0,
        node.x, node.y, node.radius
      );
      
      if (node.type === 'site') {
        // Site nodes - Enhanced white to light gray gradient
        nodeGradient.addColorStop(0, '#ffffff'); // white
        nodeGradient.addColorStop(0.4, '#f8f8f8'); // very light gray
        nodeGradient.addColorStop(0.8, '#e8e8e8'); // light gray
        nodeGradient.addColorStop(1, '#d8d8d8'); // medium light gray
      } else {
        // Account nodes - Enhanced light gray to gray gradient
        nodeGradient.addColorStop(0, '#f0f0f0'); // very light gray
        nodeGradient.addColorStop(0.4, '#e0e0e0'); // light gray
        nodeGradient.addColorStop(0.8, '#d0d0d0'); // medium gray
        nodeGradient.addColorStop(1, '#c0c0c0'); // darker gray
      }
      
      ctx.globalAlpha = 1;
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, 2 * Math.PI);
      ctx.fillStyle = nodeGradient;
      ctx.fill();
      
      // Enhanced node border
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Inner highlight border
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.stroke();
      
      // Additional subtle inner border for depth
      ctx.strokeStyle = '#e0e0e0';
      ctx.lineWidth = 0.5;
      ctx.stroke();
      
      ctx.restore();
      
      // Enhanced node label
      ctx.save();
      ctx.fillStyle = '#000000'; // Black text
      ctx.font = `bold ${Math.max(11, Math.min(18, node.radius / 2.2))}px Inter, Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Enhanced text shadow for better readability
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 3;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;
      
      // Enhanced multi-line text for long labels
      const maxWidth = node.radius * 1.6;
      const words = node.label.split(' ');
      let line = '';
      let y = node.y;
      
      if (ctx.measureText(node.label).width <= maxWidth) {
        ctx.fillText(node.label, node.x, y);
      } else {
        for (let n = 0; n < words.length; n++) {
          const testLine = line + words[n] + ' ';
          if (ctx.measureText(testLine).width > maxWidth && n > 0) {
            ctx.fillText(line, node.x, y - 10);
            line = words[n] + ' ';
            y += 18;
          } else {
            line = testLine;
          }
        }
        ctx.fillText(line, node.x, y);
      }
      
      // Enhanced connection count badge
      if (node.connections > 0) {
        const badgeX = node.x + node.radius * 0.7;
        const badgeY = node.y - node.radius * 0.7;
        
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        
        // Badge background with gradient
        const badgeGradient = ctx.createRadialGradient(
          badgeX - 8, badgeY - 8, 0,
          badgeX, badgeY, 12
        );
        badgeGradient.addColorStop(0, '#000000');
        badgeGradient.addColorStop(1, '#333333');
        
        ctx.beginPath();
        ctx.arc(badgeX, badgeY, 12, 0, 2 * Math.PI);
        ctx.fillStyle = badgeGradient;
        ctx.fill();
        
        // Badge border
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Badge text
        ctx.fillStyle = '#ffffff'; // white text
        ctx.font = 'bold 13px Inter, Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.connections.toString(), badgeX, badgeY);
      }
      
      ctx.restore();
    });

    ctx.restore();

    // Continue animation only if not stable or if there are user interactions
    if (!simulationStable || hoveredNode || isDragging) {
      const frameId = requestAnimationFrame(() => drawGraph(canvas, isExpanded));
      setAnimationFrame(frameId);
    } else {
      setAnimationFrame(null);
    }
  }, [data, generateGraphData, runSimulation, hoveredNode, selectedNode, zoom, offset, isStable, iterationCount, isDragging]);

  // Restart simulation when user interacts



  // Handle canvas resize and drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !data) return;

    const updateCanvasSize = () => {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.clientWidth;
        const height = window.innerWidth < 640 ? 600 : 800; // Increased height
        canvas.height = height;
        
        // Start animation
        const frameId = requestAnimationFrame(() => drawGraph(canvas, false));
        setAnimationFrame(frameId);
      }
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);

    return () => {
      window.removeEventListener("resize", updateCanvasSize);
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [data, drawGraph]);

  useEffect(() => {
    if (!isExpanded || !data) return;

    const expandedCanvas = expandedCanvasRef.current;
    if (!expandedCanvas) return;

    expandedCanvas.width = expandedCanvas.parentElement?.clientWidth || 1400;
    expandedCanvas.height = expandedCanvas.parentElement?.clientHeight || 900;

    const frameId = requestAnimationFrame(() => drawGraph(expandedCanvas, true));
    setAnimationFrame(frameId);

    return () => {
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
    };
  }, [isExpanded, data, drawGraph]);

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

  if (!data) return (
    <div className="w-full flex flex-col items-center justify-center py-16">
      <div className="text-gray-400 text-lg">No Linkook data found.</div>
    </div>
  );

  return (
    <div className="w-full flex flex-col items-center space-y-8">
      {/* Main Results Card */}
      <div className="w-full max-w-3xl mx-auto">
        <Card className="bg-black/50 text-white border border-white/20 overflow-hidden backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-black/50 to-black/30 border-b border-white/20">
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
                  
                  <AccordionContent className="px-3 sm:px-6 py-2 bg-black/30 backdrop-blur-sm">
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
                                <div className="w-8 h-8 rounded-full bg-teal-400/50 flex items-center justify-center flex-shrink-0">
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
          <Card className="bg-black/50 text-white border border-white/20 overflow-hidden backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-black/50 to-black/30 border-b border-white/20">
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
                    <div className="w-8 h-8 rounded-full bg-teal-400/70 flex items-center justify-center flex-shrink-0">
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

      {/* Enhanced Interactive Account Connection Map */}
      <div className="w-full max-w-3xl mx-auto h-fit">
        <Card className="bg-black/50 text-white border border-white/20 overflow-hidden backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-black/50 to-black/30 border-b border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold">Interactive Connection Map</CardTitle>
                <CardDescription className="text-muted-foreground mt-1">
                  Force-directed graph showing sites and their linked accounts • Click nodes to visit • Drag to pan • Scroll to zoom
                </CardDescription>
              </div>

            </div>
          </CardHeader>

          <CardContent className="p-0 relative">
            <div className="p-2 sm:p-4">
              <canvas 
                ref={canvasRef} 
                className="w-full border border-white/20 rounded-lg bg-black shadow-2xl"

                style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
              />
              
              {/* Legend */}
              <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-400">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-white border border-white/20"></div>
                  <span className="text-gray-300">Sites</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-gray-400 border border-white/20"></div>
                  <span className="text-gray-300">Linked Accounts</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-0.5 bg-white/50"></div>
                  <span className="text-gray-300">Connections</span>
                </div>
              </div>
              
              {/* Info panel for selected node */}
              {selectedNode && (
                <div className="mt-4 p-4 bg-black/50 rounded-lg border border-white/20 backdrop-blur-sm">
                  {(() => {
                    const node = nodesRef.current.find(n => n.id === selectedNode);
                    if (!node) return null;
                    
                    return (
                      <div>
                        <h4 className="font-semibold text-white mb-2">{node.label}</h4>
                        <p className="text-sm text-gray-300 mb-1">
                          Type: <span className="text-gray-100">{node.type === 'site' ? 'Website/Platform' : 'Linked Account'}</span>
                        </p>
                        <p className="text-sm text-gray-300 mb-2">
                          Connections: <span className="text-white font-semibold">{node.connections}</span>
                        </p>
                        {node.url && (
                          <a 
                            href={node.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-gray-100 hover:text-white text-sm underline transition-colors duration-200"
                          >
                            Visit Profile →
                          </a>
                        )}
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Dialog open={isExpanded} onOpenChange={setIsExpanded}>
          <DialogContent className="max-w-[95vw] w-[95vw] sm:max-w-[90vw] sm:w-[1200px] h-[80vh] sm:h-[90vh] p-0 bg-black/90 border-white/20 backdrop-blur-sm">
            <DialogTitle className="sr-only">Expanded Interactive Connection Map</DialogTitle>
            <div className="w-full h-full p-2 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white">Interactive Connection Map</h3>

              </div>
              <canvas 
                ref={expandedCanvasRef} 
                className="w-full h-[calc(100%-60px)] border border-white/20 rounded-lg bg-black shadow-2xl"
               
                style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}