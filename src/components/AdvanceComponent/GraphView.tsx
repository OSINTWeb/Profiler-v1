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

// Type guards for safe type checking
const isEmailNodeData = (
  data: Record<string, unknown>
): data is { email: string; platforms: number } => {
  return typeof data.email === "string" && typeof data.platforms === "number";
};

const isPlatformNodeData = (
  data: Record<string, unknown>
): data is { 
  platform: PlatformData; 
  userName?: string; 
  platformIndex?: number;
  isSelected?: boolean;
  showSelection?: boolean;
  enableselect?: boolean;
} => {
  return data.platform !== undefined && typeof data.platform === "object";
};

const isUserNodeData = (
  data: Record<string, unknown>
): data is {
  userInfo: Record<string, { value: string | boolean | number } | undefined>;
  platforms: string[];
} => {
  return data.userInfo !== undefined && Array.isArray(data.platforms);
};

// Email Node Component - Enhanced Design
const EmailNode: React.FC<NodeProps> = ({ data, selected }) => {
  if (!isEmailNodeData(data)) return null;

  return (
    <div
      className={`px-4 py-3 border rounded-full bg-gray-900 shadow-lg transition-all duration-200 min-w-40 ${
        selected
          ? "border-blue-500 shadow-xl ring-2 ring-blue-500/30"
          : "border-gray-700 hover:border-blue-400 hover:shadow-xl"
      }`}
    >
      <Handle
        type="source"
        position={Position.Top}
        className="w-2.5 h-2.5 bg-blue-500 border border-gray-800"
      />
      <Handle
        type="target"
        position={Position.Bottom}
        className="w-2.5 h-2.5 bg-blue-500 border border-gray-800"
      />
      <div className="text-center flex gap-4 justify-center items-center">
        <div className="text-gray-100 font-medium text-sm mb-1 truncate">{data.email}</div>
        <div className="text-xs bg-gray-800 rounded-full px-2 py-1 inline-flex items-center">
          <span className="text-gray-400 mr-1">Platforms:</span>
          <span className="text-blue-400 font-medium">{data.platforms}</span>
        </div>
      </div>
    </div>
  );
};

// Platform Node Component - Enhanced Design with selection support
const PlatformNode: React.FC<NodeProps> = ({ data, selected }) => {
  if (!isPlatformNodeData(data)) return null;

  const platform = data.platform;
  const isSelected = data.isSelected;
  const showSelection = data.showSelection;

  return (
    <div
      className={`px-3 py-2 border rounded-full bg-gray-800 shadow-lg transition-all duration-200 min-w-36 relative ${
        selected
          ? "border-green-500 shadow-xl ring-2 ring-green-500/30"
          : isSelected
          ? data.enableselect
            ? "border-white bg-gray-100/10 shadow-lg ring-2 ring-white/30"
            : "border-gray-400 bg-gray-400/10 shadow-lg ring-2 ring-gray-400/30"
          : "border-gray-600 hover:border-green-400 hover:shadow-xl"
      }`}
    >
      <Handle
        type="source"
        position={Position.Top}
        className="w-2.5 h-2.5 bg-green-500 border border-gray-700"
      />
      <Handle
        type="target"
        position={Position.Bottom}
        className="w-2.5 h-2.5 bg-green-500 border border-gray-700"
      />

      {/* Selection checkbox */}
      {showSelection && (
        <div className="absolute -top-2 -right-2 cursor-pointer">
          <div
            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
              isSelected
                ? data.enableselect
                  ? "bg-white border-white text-black"
                  : "bg-gray-400 border-gray-400 text-black"
                : "border-gray-500 hover:border-white bg-gray-800"
            }`}
          >
            {isSelected && (
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
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

      <div className="text-center flex gap-4 justify-center items-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="relative">
            {/* Platform icon removed for cleaner look */}
          </div>
        </div>
        <div className="text-gray-100 font-medium text-sm mb-1 truncate">
          {platform.pretty_name || platform.module}
        </div>

        {data.userName && (
          <div className="text-xs text-gray-300 bg-gray-900/50 rounded px-2 py-1 truncate">
            {data.userName}
          </div>
        )}
      </div>
    </div>
  );
};

// User Node Component - Enhanced Design
const UserNode: React.FC<NodeProps> = ({ data, selected }) => {
  if (!isUserNodeData(data)) return null;

  const userInfo = data.userInfo;
  const userName = userInfo.name?.value || userInfo.username?.value || "User";
  const location = userInfo.location?.value;

  return (
    <div
      className={`px-3 py-2 border rounded-full bg-gray-700 shadow-lg transition-all duration-200 min-w-32 ${
        selected
          ? "border-purple-500 shadow-xl ring-2 ring-purple-500/30"
          : "border-gray-500 hover:border-purple-400 hover:shadow-xl"
      }`}
    >
      <Handle
        type="source"
        position={Position.Top}
        className="w-2.5 h-2.5 bg-purple-500 border border-gray-600"
      />
      <Handle
        type="target"
        position={Position.Bottom}
        className="w-2.5 h-2.5 bg-purple-500 border border-gray-600"
      />
      <div className="text-center text-center flex gap-4 justify-center items-center">
        <div className="flex items-center justify-center mb-2"></div>
        <div className="text-gray-100 font-medium text-sm mb-1 truncate">{String(userName)}</div>
        {location && (
          <div className="text-xs text-gray-400 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3 mr-1"
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
    </div>
  );
};

const nodeTypes = {
  email: EmailNode,
  platform: PlatformNode,
  user: UserNode,
};

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

  // Transform PlatformData to React Flow format with improved positioning
  const { initialNodes, initialEdges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    const emailPositions = new Map<string, { x: number; y: number }>();
    const platformCounts = new Map<string, number>();

    // Count platforms per email
    data.forEach((platform) => {
      const email = platform.query.includes("@") ? platform.query : null;
      if (email) {
        platformCounts.set(email, (platformCounts.get(email) || 0) + 1);
      }
    });

    // Create email nodes with better initial positioning
    const emails = Array.from(platformCounts.keys());
    const centerX = 5000;
    const centerY = 3000;
    const radius = 1800;
    
    emails.forEach((email, index) => {
      // Position email nodes in a circle around the center
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

    // Create platform and user nodes with better scattering
    data.forEach((platform, platformIndex) => {
      const email = platform.query.includes("@") ? platform.query : null;
      if (!email) return;

      const emailPos = emailPositions.get(email);
      if (!emailPos) return;

      // Calculate platform position in a circular pattern around the email
      const platformsForEmail = data.filter((p) => p.query === email).length;
      const angle = (platformIndex % platformsForEmail) * (2 * Math.PI / platformsForEmail);
      const platformRadius = 1000 + (Math.random() * 800);
      
      const platformX = emailPos.x + platformRadius * Math.cos(angle);
      const platformY = emailPos.y + platformRadius * Math.sin(angle);

      // Get user information
      const userInfo = platform.spec_format[0] || {};
      const userName =
        userInfo.name && typeof userInfo.name === "object" && "value" in userInfo.name
          ? String(userInfo.name.value)
          : userInfo.username &&
            typeof userInfo.username === "object" &&
            "value" in userInfo.username
          ? String(userInfo.username.value)
          : userInfo.first_name &&
            typeof userInfo.first_name === "object" &&
            "value" in userInfo.first_name &&
            userInfo.last_name &&
            typeof userInfo.last_name === "object" &&
            "value" in userInfo.last_name
          ? `${userInfo.first_name.value} ${userInfo.last_name.value}`
          : null;

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
        
        // Calculate angle based on the platform's angle plus a slight offset
        // This ensures user nodes appear on the outer edge relative to the email center
        const emailCenterAngle = Math.atan2(platformY - emailPos.y, platformX - emailPos.x);
        const userAngle = emailCenterAngle + (Math.random() * 0.5 - 0.25); // Small random deviation
        
        // Position user node further out from the platform node
        const userRadius = 1000 + (Math.random() * 300); // More consistent radius with less randomness
        
        // Calculate position relative to platform node
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
          hidden: true, // Initially hidden
        });

        // Link platform to user with a curved edge
        edges.push({
          id: `edge-platform-user-${platformIndex}`,
          source: platformNodeId,
          target: userNodeId,
          type: "bezier", // Changed from bezier for better curved appearance
          style: {
            stroke: "#6b46c1",
            strokeWidth: 1.5,
          },
          hidden: true, // Initially hidden
        });
      }
    });

    return { initialNodes: nodes, initialEdges: edges };
  }, [data, selectedIndices, enableselect, deletebutton]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

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
  }, [expandedPlatformId, setNodes, setEdges, enableselect, deletebutton, handleCardSelect]);

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
    <div className="w-full h-[800px] bg-gray-950 relative overflow-hidden rounded-xl border border-gray-800">
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

        {/* Top Control Panel */}
        <Panel position="top-center" className="flex justify-center mt-4">
          <div className="bg-gray-900/90 backdrop-blur-sm border border-gray-800 rounded-xl shadow-xl p-2 flex items-center">
            <div className="relative mr-4">
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
                className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-full text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex space-x-1">
              <button
                onClick={() => setActiveFilter("all")}
                className={`px-3 py-1 text-xs rounded-full transition-colors ${
                  activeFilter === "all"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveFilter("email")}
                className={`px-3 py-1 text-xs rounded-full transition-colors ${
                  activeFilter === "email"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                Emails
              </button>
              <button
                onClick={() => setActiveFilter("platform")}
                className={`px-3 py-1 text-xs rounded-full transition-colors ${
                  activeFilter === "platform"
                    ? "bg-green-600 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                Platforms
              </button>
              <button
                onClick={() => setActiveFilter("user")}
                className={`px-3 py-1 text-xs rounded-full transition-colors ${
                  activeFilter === "user"
                    ? "bg-purple-600 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                Users
              </button>
            </div>
          </div>
        </Panel>
      </ReactFlow>

      {/* Enhanced Node Details Panel - Only show for email and user nodes */}
      {selectedNodeData && (isEmailNodeData(selectedNodeData) || isUserNodeData(selectedNodeData)) && (
        <div className="absolute top-6 right-6 w-80 bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-xl shadow-xl overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <h3 className="text-gray-100 font-semibold text-base flex items-center">
              {isEmailNodeData(selectedNodeData) && (
                <>
                  Email Details
                </>
              )}
              {isUserNodeData(selectedNodeData) && (
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
            {isEmailNodeData(selectedNodeData) && (
              <>
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
              </>
            )}

            {isUserNodeData(selectedNodeData) && (
              <>
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
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GraphView;