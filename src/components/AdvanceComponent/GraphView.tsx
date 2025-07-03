import React, { useMemo, useState, useCallback } from "react";
import {
  ReactFlow,
  addEdge,
  MiniMap,
  Controls,
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
): data is { platform: PlatformData; userName?: string } => {
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
        position={Position.Right}
        className="w-2.5 h-2.5 bg-blue-500 border border-gray-800"
      />
      <Handle
        type="target"
        position={Position.Left}
        className="w-2.5 h-2.5 bg-blue-500 border border-gray-800"
      />
      <div className="text-center flex  gap-4 justify-center items-center">
      
        <div className="text-gray-100 font-medium text-sm mb-1 truncate">{data.email}</div>
        <div className="text-xs bg-gray-800 rounded-full px-2 py-1 inline-flex items-center">
          <span className="text-gray-400 mr-1">Platforms:</span>
          <span className="text-blue-400 font-medium">{data.platforms}</span>
        </div>
      </div>
    </div>
  );
};

// Platform Node Component - Enhanced Design
const PlatformNode: React.FC<NodeProps> = ({ data, selected }) => {
  if (!isPlatformNodeData(data)) return null;

  const platform = data.platform;
  const isReliable = platform.reliable_source;
  const statusColor = platform.status === "valid" ? "bg-green-500" : "bg-yellow-500";

  return (
    <div
      className={`px-3 py-2 border rounded-full bg-gray-800 shadow-lg transition-all duration-200 min-w-36 ${
        selected
          ? "border-green-500 shadow-xl ring-2 ring-green-500/30"
          : "border-gray-600 hover:border-green-400 hover:shadow-xl"
      }`}
    >
      <Handle
        type="source"
        position={Position.Right}
        className="w-2.5 h-2.5 bg-green-500 border border-gray-700"
      />
      <Handle
        type="target"
        position={Position.Left}
        className="w-2.5 h-2.5 bg-green-500 border border-gray-700"
      />
      <div className="text-center  flex  gap-4 justify-center items-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="relative">
            {/* <div className="bg-gray-700/50 p-1.5 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                />
              </svg>
            </div> */}
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
        position={Position.Right}
        className="w-2.5 h-2.5 bg-purple-500 border border-gray-600"
      />
      <Handle
        type="target"
        position={Position.Left}
        className="w-2.5 h-2.5 bg-purple-500 border border-gray-600"
      />
      <div className="text-center text-center flex  gap-4 justify-center items-center">
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
}

const GraphView: React.FC<GraphViewProps> = ({ data }) => {
  const [selectedNodeData, setSelectedNodeData] = useState<Record<string, unknown> | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "email" | "platform" | "user">("all");

  // Transform PlatformData to React Flow format
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

    // Create email nodes with improved spacing
    const emails = Array.from(platformCounts.keys());
    emails.forEach((email, index) => {
      const x = 1400 + index * 1000;
      const y = 1500 + index * 1000;
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
    let platformIndex = 0;
    data.forEach((platform) => {
      const email = platform.query.includes("@") ? platform.query : null;
      if (!email) return;

      const emailPos = emailPositions.get(email);
      if (!emailPos) return;

      // Calculate platform position with improved distribution
      const platformsForEmail = data.filter((p) => p.query === email).length;
      const baseAngle = platformIndex * (360 / Math.max(platformsForEmail, 6)) * (Math.PI / 180);
      const angleVariation = (Math.random() - 0.5) * 0.6;
      const angle = baseAngle + angleVariation;
      const baseRadius = 500;
      const radiusVariation = Math.random() * 250;
      const radius = baseRadius + radiusVariation;
      const platformX = emailPos.x + Math.cos(angle) * radius;
      const platformY = emailPos.y + Math.sin(angle) * radius;

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
      nodes.push({
        id: platformNodeId,
        type: "platform",
        position: { x: platformX, y: platformY },
        data: {
          platform,
          userName,
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
        const userX = platformX + (Math.random() - 0.5) * 1000;
        const userY = platformY + 300 + Math.random() * 1000;

        nodes.push({
          id: userNodeId,
          type: "user",
          position: { x: userX, y: userY },
          data: {
            userInfo,
            platforms: [platform.pretty_name],
          },
          draggable: true,
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
        });
      }

      platformIndex++;
    });

    return { initialNodes: nodes, initialEdges: edges };
  }, [data]);

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNodeData(node.data);
  }, []);

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

      return matchesSearch && matchesFilter;
    });
  }, [nodes, searchTerm, activeFilter]);

  return (
    <div className="w-full h-[800px] bg-gray-950 relative overflow-hidden rounded-xl border border-gray-800">
      <ReactFlow
        nodes={filteredNodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-left"
        className="bg-gradient-to-br from-black to-gray-900"
        defaultViewport={{ x: 0, y: 0, zoom: 0.4 }}
        minZoom={0.1}
        maxZoom={1.5}
      >
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

      {/* Enhanced Node Details Panel */}
      {selectedNodeData && (
        <div className="absolute top-6 right-6 w-80 bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-xl shadow-xl overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <h3 className="text-gray-100 font-semibold text-base flex items-center">
              {isEmailNodeData(selectedNodeData) && (
                <>
                  {/* <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-blue-400 mr-2"
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
                  </svg> */}
                  Email Details
                </>
              )}
              {isPlatformNodeData(selectedNodeData) && (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-green-400 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                    />
                  </svg>
                  Platform Details
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

            {isPlatformNodeData(selectedNodeData) && (
              <>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Platform</label>
                    <div className="text-gray-100 text-sm font-medium bg-gray-800 rounded px-3 py-2">
                      {selectedNodeData.platform.pretty_name}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Status</label>
                      <div
                        className={`text-xs font-medium rounded-full px-3 py-1 capitalize ${
                          selectedNodeData.platform.status === "valid"
                            ? "bg-green-900/50 text-green-400"
                            : "bg-yellow-900/50 text-yellow-400"
                        }`}
                      >
                        {selectedNodeData.platform.status}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Reliability</label>
                      <div
                        className={`text-xs font-medium rounded-full px-3 py-1 ${
                          selectedNodeData.platform.reliable_source
                            ? "bg-green-900/50 text-green-400"
                            : "bg-gray-800 text-gray-400"
                        }`}
                      >
                        {selectedNodeData.platform.reliable_source ? "Verified" : "Unverified"}
                      </div>
                    </div>
                  </div>
                  {selectedNodeData.platform.category?.name && (
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Category</label>
                      <div className="text-gray-100 text-sm bg-gray-800 rounded px-3 py-1.5">
                        {selectedNodeData.platform.category.name}
                      </div>
                    </div>
                  )}
                  {selectedNodeData.userName && (
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Associated User</label>
                      <div className="text-gray-100 text-sm font-medium bg-gray-800 rounded px-3 py-2">
                        {selectedNodeData.userName}
                      </div>
                    </div>
                  )}
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
