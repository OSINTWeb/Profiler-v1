import React, { useMemo, useState, useCallback } from "react";
import {
  ReactFlow,
  addEdge,
  Background,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  Position,
  Handle,
  NodeProps,
  Connection,
  Panel,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { PlatformData } from "./InfocardList";

// Type Definitions
interface EmailNodeData {
  email: string;
  platforms: number;
}

interface PlatformNodeData {
  platform: PlatformData;
  userName?: string;
  platformIndex?: number;
  isSelected?: boolean;
  showSelection?: boolean;
  enableselect?: boolean;
}

interface UserNodeData {
  userInfo: Record<string, { value: string | boolean | number } | undefined>;
  platforms: string[];
}

// Type Guards with improved type safety
const isEmailNodeData = (data: unknown): data is EmailNodeData =>
  typeof data === 'object' && data !== null &&
  typeof (data as EmailNodeData).email === "string" && 
  typeof (data as EmailNodeData).platforms === "number";

const isPlatformNodeData = (data: unknown): data is PlatformNodeData =>
  typeof data === 'object' && data !== null &&
  (data as PlatformNodeData).platform !== undefined && 
  typeof (data as PlatformNodeData).platform === "object";

const isUserNodeData = (data: unknown): data is UserNodeData =>
  typeof data === 'object' && data !== null &&
  (data as UserNodeData).userInfo !== undefined && 
  Array.isArray((data as UserNodeData).platforms);

// Node Base Component with Enhanced Visual Design
const NodeBase: React.FC<{
  children: React.ReactNode;
  selected?: boolean;
  handleColor: string;
  bgColor: string;
  borderColor: string;
  additionalClasses?: string;
}> = ({ 
  children, 
  selected, 
  handleColor, 
  bgColor, 
  borderColor, 
  additionalClasses = '' 
}) => (
  <div
    className={`
      px-4 py-3 border rounded-xl shadow-lg transition-all duration-300 
      min-w-40 relative overflow-hidden group
      ${selected 
        ? `${borderColor} shadow-xl ring-2 ring-opacity-50` 
        : 'border-gray-700 hover:border-opacity-400 hover:shadow-xl'}
      ${bgColor} 
      ${additionalClasses}
    `}
  >
    {/* Gradient overlay for subtle depth */}
    <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/10 opacity-0 group-hover:opacity-20 transition-opacity"></div>
    
    <Handle
      type="source"
      position={Position.Top}
      className={`
        w-3 h-3 rounded-full ${handleColor} 
        border border-gray-700 
        transform scale-90 group-hover:scale-100 
        transition-all duration-300
      `}
    />
    <Handle
      type="target"
      position={Position.Bottom}
      className={`
        w-3 h-3 rounded-full ${handleColor} 
        border border-gray-700 
        transform scale-90 group-hover:scale-100 
        transition-all duration-300
      `}
    />
    {children}
  </div>
);

// Enhanced Node Components with More Refined Design
const EmailNode: React.FC<NodeProps> = ({ data, selected }) => {
  if (!isEmailNodeData(data)) return null;

  return (
    <NodeBase 
      selected={selected} 
      handleColor="bg-blue-500" 
      bgColor="bg-gray-900/80 backdrop-blur-sm" 
      borderColor="border-blue-500"
      additionalClasses="hover:scale-105"
    >
      <div className="text-center flex flex-col gap-2 justify-center items-center">
        <div className="text-gray-100 font-semibold text-sm mb-1 truncate flex items-center">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-4 w-4 mr-2 text-blue-400" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
            />
          </svg>
          {data.email}
        </div>
        <div className="text-xs bg-gray-800/50 rounded-full px-3 py-1 inline-flex items-center">
          <span className="text-gray-400 mr-2">Platforms:</span>
          <span className="text-blue-300 font-medium">{data.platforms}</span>
        </div>
      </div>
    </NodeBase>
  );
};

const PlatformNode: React.FC<NodeProps> = ({ data, selected }) => {
  if (!isPlatformNodeData(data)) return null;

  const { platform, userName, isSelected, showSelection, enableselect } = data;

  return (
    <NodeBase 
      selected={selected} 
      handleColor="bg-green-500" 
      bgColor="bg-gray-800/80 backdrop-blur-sm" 
      borderColor="border-green-500"
      additionalClasses="hover:scale-105"
    >
      {showSelection && (
        <div className="absolute -top-2 -right-2 cursor-pointer z-10">
          <div
            className={`
              w-6 h-6 rounded-full border-2 flex items-center justify-center 
              transition-all duration-300 shadow-md
              ${isSelected
                ? enableselect
                  ? "bg-white border-white text-black scale-110"
                  : "bg-gray-400 border-gray-400 text-black"
                : "border-gray-500 hover:border-white bg-gray-800/50"
              }`}
          >
            {isSelected && (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
        </div>
      )}
      <div className="text-center flex flex-col gap-2 justify-center items-center">
        <div className="text-gray-100 font-semibold text-sm mb-1 truncate flex items-center">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-4 w-4 mr-2 text-green-400" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
            />
          </svg>
          {platform.pretty_name || platform.module}
        </div>
        {userName && (
          <div className="text-xs text-gray-300 bg-gray-900/50 rounded-full px-3 py-1 truncate">
            {userName}
          </div>
        )}
      </div>
    </NodeBase>
  );
};

const UserNode: React.FC<NodeProps> = ({ data, selected }) => {
  if (!isUserNodeData(data)) return null;

  const userInfo = data.userInfo;
  const userName = userInfo.name?.value || userInfo.username?.value || "User";
  const location = userInfo.location?.value;

  return (
    <NodeBase 
      selected={selected} 
      handleColor="bg-purple-500" 
      bgColor="bg-gray-700/80 backdrop-blur-sm" 
      borderColor="border-purple-500"
      additionalClasses="hover:scale-105"
    >
      <div className="text-center flex flex-col gap-2 justify-center items-center">
        <div className="text-gray-100 font-semibold text-sm mb-1 truncate flex items-center">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-4 w-4 mr-2 text-purple-400" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
            />
          </svg>
          {String(userName)}
        </div>
        {location && (
          <div className="text-xs text-gray-400 flex items-center justify-center bg-gray-900/30 rounded-full px-3 py-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3 mr-1 text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            {String(location)}
          </div>
        )}
      </div>
    </NodeBase>
  );
};

const nodeTypes = {
  email: EmailNode,
  platform: PlatformNode,
  user: UserNode,
};

// Main GraphView Component
interface GraphViewProps {
  data: PlatformData[];
  selectedIndices: number[];
  handleCardSelect: (index: number) => void;
  enableselect: boolean;
  deletebutton: boolean;
}

const GraphView: React.FC<GraphViewProps> = ({ 
  data, 
  selectedIndices, 
  handleCardSelect, 
  enableselect, 
  deletebutton 
}) => {
  const [selectedNodeData, setSelectedNodeData] = useState<Record<string, unknown> | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "email" | "platform" | "user">("all");
  const [expandedPlatformId, setExpandedPlatformId] = useState<string | null>(null);

  // Memoized node and edge generation
  const { initialNodes, initialEdges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    const emailPositions = new Map<string, { x: number; y: number }>();
    const platformCounts = new Map<string, number>();

    // Count platforms per email and create email nodes
    const processEmails = () => {
      data.forEach((platform) => {
        const email = platform.query.includes("@") ? platform.query : null;
        if (email) {
          platformCounts.set(email, (platformCounts.get(email) || 0) + 1);
        }
      });

      const emails = Array.from(platformCounts.keys());
      const centerX = 5000;
      const centerY = 3000;
      const radius = 1800;
      
      emails.forEach((email, index) => {
        const angle = (index * (2 * Math.PI)) / emails.length;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        
        emailPositions.set(email, { x, y });

        nodes.push({
          id: `email-${email}`,
          type: "email",
          position: { x, y },
          data: {
            email,
            platforms: platformCounts.get(email) || 0,
          },
          draggable: true,
        });
      });
    };

    // Create platform and user nodes
    const processPlatforms = () => {
      data.forEach((platform, platformIndex) => {
        const email = platform.query.includes("@") ? platform.query : null;
        if (!email) return;

        const emailPos = emailPositions.get(email);
        if (!emailPos) return;

        const platformsForEmail = data.filter((p) => p.query === email).length;
        const angle = (platformIndex % platformsForEmail) * (2 * Math.PI / platformsForEmail);
        const platformRadius = 1000 + (Math.random() * 800);
        
        const platformX = emailPos.x + platformRadius * Math.cos(angle);
        const platformY = emailPos.y + platformRadius * Math.sin(angle);

        // Extract user information
        const userInfo = platform.spec_format[0] || {};
        const userName = extractUserName(userInfo);
        
        // Create platform node
        const platformNodeId = `platform-${platform.module}-${platformIndex}`;
        const isSelected = selectedIndices.includes(platformIndex);
        const showSelection = enableselect || deletebutton;
        
        nodes.push({
          id: platformNodeId,
          type: "platform",
          position: { x: platformX, y: platformY },
          data: {
            platform,
            userName,
            platformIndex,
            isSelected,
            showSelection,
            enableselect,
          },
          draggable: true,
        });

        // Link email to platform
        edges.push({
          id: `edge-email-platform-${platformIndex}`,
          source: `email-${email}`,
          target: platformNodeId,
          type: "bezier",
          style: {
            stroke: "#4b5563",
            strokeWidth: 2,
          },
          animated: false,
        });

        // Create user node if detailed user info exists
        if (userName && Object.keys(userInfo).length > 3) {
          const userNodeId = `user-${userName}-${platformIndex}`;
          
          const emailCenterAngle = Math.atan2(platformY - emailPos.y, platformX - emailPos.x);
          const userAngle = emailCenterAngle + (Math.random() * 0.5 - 0.25);
          
          const userRadius = 1000 + (Math.random() * 300);
          
          const userX = platformX + userRadius * Math.cos(userAngle);
          const userY = platformY + userRadius * Math.sin(userAngle);

          nodes.push({
            id: userNodeId,
            type: "user",
            position: { x: userX, y: userY },
            data: {
              userInfo,
              platforms: [platform.pretty_name],
              parentPlatformId: platformNodeId,
            },
            draggable: true,
            hidden: true,
          });

          // Link platform to user
          edges.push({
            id: `edge-platform-user-${platformIndex}`,
            source: platformNodeId,
            target: userNodeId,
            type: "bezier",
            style: {
              stroke: "#6b46c1",
              strokeWidth: 1.5,
            },
            hidden: true,
          });
        }
      });
    };

    // Helper function to extract user name with improved type safety
    const extractUserName = (userInfo: Record<string, unknown>): string | null => {
      const getName = (nameObj: unknown): string | null => {
        if (typeof nameObj === 'object' && nameObj !== null && 'value' in nameObj) {
          const value = (nameObj as { value: string }).value;
          return typeof value === 'string' ? value : null;
        }
        return null;
      };

      return (
        getName(userInfo.name) ||
        getName(userInfo.username) ||
        (getName(userInfo.first_name) && getName(userInfo.last_name)
          ? `${getName(userInfo.first_name)} ${getName(userInfo.last_name)}`
          : null
      ))
    };

    processEmails();
    processPlatforms();

    return { initialNodes: nodes, initialEdges: edges };
  }, [data, selectedIndices, enableselect, deletebutton]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // New function to reset the graph view
  const resetGraphView = useCallback(() => {
    // Reset nodes to initial state
    setNodes(initialNodes);
    setEdges(initialEdges);
    
    // Reset other state variables
    setSearchTerm("");
    setActiveFilter("all");
    setExpandedPlatformId(null);
    setSelectedNodeData(null);
  }, [initialNodes, initialEdges]);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    if (node.type === "platform") {
      const showSelection = enableselect || deletebutton;
      
      if (showSelection) {
        // Handle selection when selection mode is enabled
        const platformIndex = node.data.platformIndex;
        if (typeof platformIndex === 'number') {
          handleCardSelect(platformIndex);
        }
      } else {
        // Handle expansion when selection mode is disabled (current behavior)
        // Toggle visibility of connected user nodes
        setNodes((nds) =>
          nds.map((n) => {
            if (n.data.parentPlatformId === node.id) {
              const isCurrentlyHidden = expandedPlatformId !== node.id;
              // Show the user details panel when expanding
              if (isCurrentlyHidden) {
                setSelectedNodeData(n.data);
              }
              return {
                ...n,
                hidden: !isCurrentlyHidden,
              };
            }
            return n;
          })
        );

        setEdges((eds) =>
          eds.map((e) => {
            if (e.source === node.id) {
              return {
                ...e,
                hidden: expandedPlatformId === node.id,
              };
            }
            return e;
          })
        );

        setExpandedPlatformId((prev) => {
          // Clear selected data when collapsing
          if (prev === node.id) {
            setSelectedNodeData(null);
          }
          return prev === node.id ? null : node.id;
        });
      }
    } else if (node.type === "email") {
      // Only show info panel for email nodes
      setSelectedNodeData(node.data);
    }
    // User nodes are no longer clickable - removed the user node case
  }, [expandedPlatformId, setNodes, setEdges, enableselect, deletebutton, handleCardSelect, setSelectedNodeData]);

  // Update nodes when selection state changes
  React.useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.type === "platform" && typeof node.data.platformIndex === 'number') {
          return {
            ...node,
            data: {
              ...node.data,
              isSelected: selectedIndices.includes(node.data.platformIndex),
              showSelection: enableselect || deletebutton,
              enableselect,
            },
          };
        }
        return node;
      })
    );
  }, [selectedIndices, enableselect, deletebutton, setNodes]);

  // Filter nodes based on search and active filter
  const filteredNodes = useMemo(() => {
    return nodes.filter((node) => {
      const matchesSearch = searchTerm
        ? JSON.stringify(node.data).toLowerCase().includes(searchTerm.toLowerCase())
        : true;

      const matchesFilter =
        activeFilter === "all" ||
        (activeFilter === "email" && node.type === "email") ||
        (activeFilter === "platform" && node.type === "platform") ||
        (activeFilter === "user" && node.type === "user");

      return matchesSearch && matchesFilter && !node.hidden;
    });
  }, [nodes, searchTerm, activeFilter]);

  const filteredEdges = useMemo(() => {
    return edges.filter((edge) => !edge.hidden);
  }, [edges]);

  return (
    <div className="h-[800px] bg-gray-950 relative overflow-hidden rounded-xl border border-gray-800">
      <ReactFlow
        nodes={filteredNodes}
        edges={filteredEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-left"
        className="bg-gradient-to-br from-black to-gray-900"
        defaultViewport={{ x: 0, y: 0, zoom: 0.2 }}
        minZoom={0.05}
        maxZoom={1.5}
      >
        <Background gap={24} color="#374151" />

        {/* Improved Top Control Panel with better accessibility and design */}
        <Panel position="top-center" className="flex justify-center w-full mt-4">
          <div className="bg-gray-900/90 border border-gray-700 backdrop-blur-sm rounded-xl shadow-xl p-2 flex items-center space-x-4">
            {/* Search Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg 
                  className="h-4 w-4 text-gray-500" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search nodes..."
                aria-label="Search nodes"
                className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-full text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filter Buttons with improved contrast and accessibility */}
            <div className="flex space-x-1">
              {["all", "email", "platform", "user"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter as typeof activeFilter)}
                  className={`px-3 py-1 text-xs rounded-full capitalize transition-colors ${
                    activeFilter === filter
                      ? `${
                          filter === "all" ? "bg-blue-600" : 
                          filter === "email" ? "bg-blue-600" : 
                          filter === "platform" ? "bg-green-600" : 
                          "bg-purple-600"
                        } text-white`
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                  aria-pressed={activeFilter === filter}
                >
                  {filter}
                </button>
              ))}
              
              {/* Refresh Button with improved icon */}
              <button
                onClick={resetGraphView}
                className="px-3 py-1 text-xs rounded-full bg-gray-800 text-gray-300 hover:bg-gray-700 flex items-center"
                title="Reset Graph View"
                aria-label="Reset Graph View"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-4 w-4 mr-1" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
                  />
                </svg>
                Refresh
              </button>
            </div>
          </div>
        </Panel>
      </ReactFlow>

      {/* Node Details Panel - Simplified and more consistent */}
      {selectedNodeData && (isEmailNodeData(selectedNodeData) || isUserNodeData(selectedNodeData)) && (
        <div className="absolute top-6 right-6 w-80 bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-xl shadow-xl overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <h3 className="text-gray-100 font-semibold text-base flex items-center">
              {isEmailNodeData(selectedNodeData) ? "Email Details" : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-purple-400 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  User Details
                </>
              )}
            </h3>
            <button
              onClick={() => setSelectedNodeData(null)}
              className="text-gray-400 hover:text-gray-200 transition-colors p-1 rounded-md hover:bg-gray-800"
              aria-label="Close details"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="p-4 space-y-4 max-h-[500px] overflow-y-auto">
            {isEmailNodeData(selectedNodeData) ? (
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Email Address</label>
                  <div className="text-gray-100 text-sm font-medium bg-gray-800 rounded px-3 py-2">
                    {selectedNodeData.email}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Connected Platforms</label>
                  <div className="flex items-center">
                    <div className="text-gray-100 text-sm font-medium bg-gray-800 rounded-full px-3 py-1">
                      {selectedNodeData.platforms}
                    </div>
                    <div className="ml-2 text-xs text-gray-400">
                      {selectedNodeData.platforms === 1 ? "platform" : "platforms"} found
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {Object.entries(selectedNodeData.userInfo).map(([key, value]) => {
                  if (key === "platform_variables" || !value?.value) return null;
                  return (
                    <div key={key}>
                      <label className="text-xs text-gray-400 block mb-1 capitalize">
                        {key.replace(/_/g, " ")}
                      </label>
                      <div className="text-gray-100 text-sm bg-gray-800 rounded px-3 py-2 truncate">
                        {String(value.value)}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GraphView;