import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  IAstNode,
  TextNode,
  ListNode,
  VariableReferenceNode,
  CompositeNode,
  createDefaultPerchanceRuleSet
} from '../engine/perchanceAst';
import { Result } from '../engine/monad';
import { EvaluatorContext } from '../engine/types';
import {
  Play,
  RotateCcw,
  Sparkles,
  Layers,
  Code2,
  Terminal,
  Send,
  Plus,
  Trash2,
  ListFilter,
  CheckCircle2,
  ShieldCheck,
  Bot
} from 'lucide-react';

export const IdeWorkspace: React.FC = () => {
  const { user, openModal, showToast } = useAuth();

  // Initial Perchance Rule Set
  const initialSet = createDefaultPerchanceRuleSet();
  const [rootNode, setRootNode] = useState<IAstNode>(initialSet.rootNode);
  const [variables, setVariables] = useState<Record<string, IAstNode>>(initialSet.variables);

  // Evaluated Monadic Result
  const [monadicResult, setMonadicResult] = useState<Result<string, any> | null>(null);
  const [evaluationLogs, setEvaluationLogs] = useState<string[]>([]);

  // Embedded WebEngine Chat Output Stream
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'agent'; text: string; timestamp: string }>>([
    {
      sender: 'agent',
      text: 'System Alert: Zero-Trust Security Active. Operating as Autonomous Cyber Defense Agent - currently evaluating incoming DAG rules and deep-freezing bridge payloads.',
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);

  const [promptInput, setPromptInput] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [activeRightTab, setActiveRightTab] = useState<'preview' | 'ast' | 'monad'>('preview');

  // Execute Monadic AST Rule Engine
  const handleExecuteAst = (customPrompt?: string) => {
    setIsEvaluating(true);
    const context: EvaluatorContext = {
      variables,
      depth: 0,
      maxDepth: 20,
      callLogs: [],
    };

    const res = rootNode.evaluate(context);
    setMonadicResult(res);

    if (res.isSuccess()) {
      const outputText = res.getValue();
      setEvaluationLogs((prev) => [
        `[${new Date().toLocaleTimeString()}] MONAD_SUCCESS: Evaluated AST root. Generated text length: ${outputText.length}`,
        ...prev,
      ]);

      // Append to WebEngine Chat
      if (customPrompt) {
        setChatMessages((prev) => [
          ...prev,
          { sender: 'user', text: customPrompt, timestamp: new Date().toLocaleTimeString() },
          { sender: 'agent', text: outputText, timestamp: new Date().toLocaleTimeString() },
        ]);
      }
    } else {
      const err = res.getError();
      setEvaluationLogs((prev) => [
        `[${new Date().toLocaleTimeString()}] MONAD_FAILURE: ${err.message} (Code: ${err.code})`,
        ...prev,
      ]);
      showToast(`Monadic AST Error: ${err.message}`, 'error');
    }

    setIsEvaluating(false);
  };

  // AI Prompt Generation via Multi-Provider Gateway
  const handleSendPrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptInput.trim()) return;

    const userInput = promptInput.trim();
    setPromptInput('');

    // Add user message to preview
    setChatMessages((prev) => [
      ...prev,
      { sender: 'user', text: userInput, timestamp: new Date().toLocaleTimeString() },
    ]);

    setIsEvaluating(true);

    try {
      // Evaluate local Perchance AST first
      const context: EvaluatorContext = {
        variables,
        depth: 0,
        maxDepth: 20,
        callLogs: [],
      };
      const astRes = rootNode.evaluate(context);
      const perchancePrefix = astRes.isSuccess() ? astRes.getValue() : 'Aegis Orchestrator Active.';

      // Route to Server Proxy AI Provider
      const aiResponse = await api.generateChatResponse(
        `[Perchance Context: ${perchancePrefix}] User prompt: ${userInput}`
      );

      setChatMessages((prev) => [
        ...prev,
        { sender: 'agent', text: aiResponse, timestamp: new Date().toLocaleTimeString() },
      ]);
    } catch (err: any) {
      showToast(err.message || 'AI Generation error.', 'error');
    } finally {
      setIsEvaluating(false);
    }
  };

  // Reset AST to Default Rule Set
  const handleResetAst = () => {
    const def = createDefaultPerchanceRuleSet();
    setRootNode(def.rootNode);
    setVariables(def.variables);
    showToast('AST Generator reset to default Perchance rule set.', 'info');
  };

  // Preset Loaders
  const loadPreset = (presetType: 'cyber' | 'fantasy' | 'tech') => {
    if (presetType === 'cyber') {
      const g = new ListNode('g_cyber', [
        { weight: 50, node: new TextNode('c1', 'Cyber Directive 2026 initialized.') },
        { weight: 50, node: new TextNode('c2', 'Zero-Trust intrusion detection alert.') },
      ]);
      const r = new ListNode('r_cyber', [
        { weight: 60, node: new TextNode('r1', 'Quantum Encryption Sentinel') },
        { weight: 40, node: new TextNode('r2', 'Virtual Thread Security Auditor') },
      ]);

      const root = new CompositeNode('root_cyber', [
        new VariableReferenceNode('v1', 'greeting'),
        new TextNode('s1', ' Assigned unit: '),
        new VariableReferenceNode('v2', 'agentRole'),
      ]);

      setRootNode(root);
      setVariables({ greeting: g, agentRole: r });
    } else if (presetType === 'fantasy') {
      const g = new ListNode('g_fan', [
        { weight: 50, node: new TextNode('f1', 'Greetings, Traveler of the Digital Realm.') },
        { weight: 50, node: new TextNode('f2', 'Halt! The Monadic Boundary guards this gate.') },
      ]);
      const r = new ListNode('r_fan', [
        { weight: 60, node: new TextNode('rf1', 'Alchemical AST Specialist') },
        { weight: 40, node: new TextNode('rf2', 'High Loom Thread Wizard') },
      ]);

      const root = new CompositeNode('root_fan', [
        new VariableReferenceNode('v1', 'greeting'),
        new TextNode('s1', ' I am the '),
        new VariableReferenceNode('v2', 'agentRole'),
      ]);

      setRootNode(root);
      setVariables({ greeting: g, agentRole: r });
    }
    showToast(`Loaded preset AST rule set: [${presetType.toUpperCase()}].`, 'success');
  };

  return (
    <div className="flex-1 flex overflow-hidden bg-[#0b0f17]">
      {/* LEFT PANEL: Perchance Chat Generator AST Rule Builder */}
      <div className="w-1/2 border-r border-slate-800 flex flex-col bg-[#0f172a]/60">
        {/* Left Toolbar */}
        <div className="h-11 border-b border-slate-800 px-4 flex items-center justify-between bg-slate-900/60 shrink-0">
          <div className="flex items-center gap-2">
            <Code2 className="h-4 w-4 text-sky-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Perchance AST Rule Builder
            </span>
          </div>

          <div className="flex items-center gap-2">
            <select
              onChange={(e) => loadPreset(e.target.value as any)}
              className="rounded bg-slate-800 border border-slate-700 px-2 py-1 text-[11px] text-slate-300 cursor-pointer focus:outline-none"
            >
              <option value="cyber">Preset: Cyber Defense</option>
              <option value="fantasy">Preset: Procedural Fantasy</option>
            </select>

            <button
              onClick={handleResetAst}
              className="p-1 rounded bg-slate-800 border border-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Reset AST Rules"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>

            <button
              onClick={() => handleExecuteAst()}
              className="px-3 py-1 rounded bg-sky-600 hover:bg-sky-500 text-xs font-semibold text-white transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Play className="h-3 w-3 fill-current" />
              <span>Evaluate AST</span>
            </button>
          </div>
        </div>

        {/* AST Node Tree & Rule Inspector */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-sky-400 flex items-center gap-2">
                <Layers className="h-4 w-4" />
                Root Composite Node Sequence: [node_root]
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/20 text-sky-300">
                CompositeNode
              </span>
            </div>

            <p className="text-xs text-slate-400">
              Combines global variable references (`$greeting`, `$agentRole`, `$action`) into a unified Perchance procedural output string.
            </p>
          </div>

          {/* Variables Inspector */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <ListFilter className="h-4 w-4 text-sky-400" />
              Perchance Variable Choice Lists
            </h3>

            {Object.entries(variables).map(([varName, node]) => (
              <div key={varName} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                  <span className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-amber-400" />${varName}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                    {node.type === 'list' ? 'ListNode (Weighted)' : 'TextNode'}
                  </span>
                </div>

                {/* Option Choice Weights */}
                {node instanceof ListNode && (
                  <div className="space-y-2">
                    {node.options.map((opt, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs">
                        <span className="text-slate-500 font-mono w-8 text-right shrink-0">{opt.weight}%</span>
                        <div className="flex-1 rounded bg-slate-950 border border-slate-800 px-2 py-1 text-slate-200 truncate">
                          {opt.node instanceof TextNode ? opt.node.text : 'Complex Node'}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: Embedded JavaFX WebEngine Live Preview */}
      <div className="w-1/2 flex flex-col bg-[#070a11]">
        {/* Right Toolbar */}
        <div className="h-11 border-b border-slate-800 px-4 flex items-center justify-between bg-slate-900/80 shrink-0">
          <div className="flex items-center gap-2">
            <Bot className="h-4 w-4 text-emerald-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Embedded JavaFX WebEngine Preview
            </span>
          </div>

          <div className="flex items-center gap-1 text-xs">
            <button
              onClick={() => setActiveRightTab('preview')}
              className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                activeRightTab === 'preview' ? 'bg-emerald-500/20 text-emerald-300 font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Chat UI
            </button>
            <button
              onClick={() => setActiveRightTab('ast')}
              className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                activeRightTab === 'ast' ? 'bg-emerald-500/20 text-emerald-300 font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              AST Schema
            </button>
            <button
              onClick={() => setActiveRightTab('monad')}
              className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                activeRightTab === 'monad' ? 'bg-emerald-500/20 text-emerald-300 font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Monad Logs
            </button>
          </div>
        </div>

        {/* Tab 1: Live WebEngine Perchance Chat Preview */}
        {activeRightTab === 'preview' && (
          <div className="flex-1 flex flex-col justify-between overflow-hidden p-4">
            {/* Chat Stream Viewport */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-2">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-1.5 mb-1 text-[10px] text-slate-500 font-mono">
                    <span>{msg.sender === 'user' ? user?.name || 'Operator' : 'Aegis Perchance Engine'}</span>
                    <span>·</span>
                    <span>{msg.timestamp}</span>
                  </div>
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs ${
                      msg.sender === 'user'
                        ? 'bg-sky-600 text-white rounded-br-none'
                        : 'bg-slate-900 border border-slate-800 text-slate-100 rounded-bl-none shadow-md'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Prompt Input Form */}
            <form onSubmit={handleSendPrompt} className="mt-3 relative flex items-center">
              <input
                type="text"
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                placeholder="Type a prompt to trigger the Perchance AST & AI provider..."
                className="w-full rounded-xl border border-slate-800 bg-slate-900/90 py-2.5 pl-4 pr-12 text-xs text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none shadow-lg"
              />
              <button
                type="submit"
                disabled={isEvaluating}
                className="absolute right-2 p-1.5 rounded-lg bg-sky-600 text-white hover:bg-sky-500 transition-colors cursor-pointer disabled:opacity-50"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>
        )}

        {/* Tab 2: AST Schema JSON */}
        {activeRightTab === 'ast' && (
          <div className="flex-1 p-4 overflow-y-auto font-mono text-xs text-slate-300">
            <pre className="bg-[#0b0f17] p-4 rounded-xl border border-slate-800 overflow-x-auto text-[11px]">
              {JSON.stringify(rootNode.toJSON(), null, 2)}
            </pre>
          </div>
        )}

        {/* Tab 3: Monadic Result Logs */}
        {activeRightTab === 'monad' && (
          <div className="flex-1 p-4 overflow-y-auto font-mono text-xs text-slate-300 space-y-2">
            {evaluationLogs.length === 0 ? (
              <div className="text-slate-600 italic">No monadic execution logs recorded yet. Click "Evaluate AST" to trigger evaluation.</div>
            ) : (
              evaluationLogs.map((log, idx) => (
                <div key={idx} className="p-2 rounded bg-slate-900/80 border border-slate-800 text-[11px]">
                  {log}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
