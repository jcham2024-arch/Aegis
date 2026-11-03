/**
 * Aegis-Agent Core Types & Domain Definitions
 */

export type UserRole = 'admin' | 'engineer' | 'auditor' | 'user';
export type UserStatus = 'active' | 'disabled';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  avatarUrl?: string;
  createdAt: string;
  lastLoginAt: string;
  bio?: string;
  preferences?: {
    theme: 'dark' | 'light';
    defaultModelProvider: 'gemini' | 'ollama' | 'custom';
    autoSaveAst: boolean;
  };
}

export interface SystemMetrics {
  uptimeSeconds: number;
  memoryUsageMb: {
    heapUsed: number;
    heapTotal: number;
    rss: number;
  };
  activeVirtualThreads: number;
  totalThreadsSpawned: number;
  llmRequestsTotal: number;
  llmSuccessCount: number;
  llmErrorCount: number;
  zeroTrustViolationsBlocked: number;
  cpuLoadPercentage: number;
  timestamp: string;
}

export interface SystemLogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'security';
  module: string;
  message: string;
  details?: Record<string, unknown>;
  userEmail?: string;
}

export interface AppConfigSettings {
  defaultProvider: 'gemini' | 'ollama' | 'custom';
  geminiModel: string;
  ollamaBaseUrl: string;
  ollamaModel: string;
  customBaseUrl: string;
  customApiKey: string;
  customModelName: string;
  maxTokens: number;
  temperature: number;
  zeroTrustPolicyLevel: 'strict' | 'moderate' | 'permissive';
  rateLimitPerMinute: number;
  requireEmailVerification: boolean;
  enableVirtualThreadSimulation: boolean;
  enableVisionFrameCapture: boolean;
}

export interface AstError {
  code: string;
  message: string;
  nodeId?: string;
  path?: string;
}

export interface EvaluatorContext {
  variables: Record<string, unknown>;
  depth: number;
  maxDepth: number;
  seed?: number;
  callLogs: Array<{ nodeId: string; type: string; timestamp: string }>;
}

export interface AgentRuleDagNode {
  id: string;
  title: string;
  type: 'policy' | 'action' | 'constraint' | 'trigger';
  content: string;
  children: string[];
  status: 'active' | 'blocked' | 'pending';
}

export interface LoomThreadInfo {
  threadId: number;
  name: string;
  state: 'RUNNING' | 'WAITING' | 'BLOCKED' | 'TERMINATED' | 'CARRIER_MOUNTED';
  taskName: string;
  cpuOverheadMs: number;
  stackDepth: number;
  memoryAllocatedKb: number;
  timestamp: string;
}
