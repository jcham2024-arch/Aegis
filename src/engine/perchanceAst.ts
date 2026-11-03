/**
 * Perchance-style Strict TypeScript AST Compiler Engine
 * Uses Composite and Strategy patterns to compile procedural text, chat rules, and weighted generation trees.
 */

import { Result } from './monad';
import { AstError, EvaluatorContext } from './types';

export interface IAstNode {
  id: string;
  type: 'text' | 'list' | 'variable' | 'composite';
  label?: string;
  evaluate(context: EvaluatorContext): Result<string, AstError>;
  toJSON(): Record<string, unknown>;
}

export class TextNode implements IAstNode {
  constructor(
    public id: string,
    public text: string,
    public label: string = 'Literal Text'
  ) {}

  type: 'text' = 'text';

  evaluate(_context: EvaluatorContext): Result<string, AstError> {
    return Result.success(this.text);
  }

  toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      type: this.type,
      label: this.label,
      text: this.text,
    };
  }
}

export interface WeightedOption {
  weight: number;
  node: IAstNode;
}

export class ListNode implements IAstNode {
  constructor(
    public id: string,
    public options: WeightedOption[],
    public label: string = 'Choice List'
  ) {}

  type: 'list' = 'list';

  evaluate(context: EvaluatorContext): Result<string, AstError> {
    if (context.depth > context.maxDepth) {
      return Result.failure({
        code: 'MAX_DEPTH_EXCEEDED',
        message: `Evaluation depth exceeded maximum threshold (${context.maxDepth})`,
        nodeId: this.id,
      });
    }

    if (!this.options || this.options.length === 0) {
      return Result.success('');
    }

    // Compute total weight
    const totalWeight = this.options.reduce((sum, opt) => sum + Math.max(0, opt.weight), 0);
    if (totalWeight <= 0) {
      return Result.success('');
    }

    // Weighted random selection
    let randomVal = Math.random() * totalWeight;
    let selectedOption: WeightedOption = this.options[0];

    for (const option of this.options) {
      if (randomVal < option.weight) {
        selectedOption = option;
        break;
      }
      randomVal -= option.weight;
    }

    context.depth += 1;
    context.callLogs.push({
      nodeId: this.id,
      type: 'list_select',
      timestamp: new Date().toISOString(),
    });

    const res = selectedOption.node.evaluate(context);
    context.depth -= 1;
    return res;
  }

  toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      type: this.type,
      label: this.label,
      options: this.options.map((opt) => ({
        weight: opt.weight,
        node: opt.node.toJSON(),
      })),
    };
  }
}

export class VariableReferenceNode implements IAstNode {
  constructor(
    public id: string,
    public variableName: string,
    public label: string = 'Variable Ref'
  ) {}

  type: 'variable' = 'variable';

  evaluate(context: EvaluatorContext): Result<string, AstError> {
    const val = context.variables[this.variableName];
    if (val === undefined || val === null) {
      return Result.failure({
        code: 'UNDEFINED_VARIABLE',
        message: `Variable '${this.variableName}' is not defined in evaluator context.`,
        nodeId: this.id,
      });
    }

    if (typeof val === 'object' && val !== null && 'evaluate' in val) {
      return (val as IAstNode).evaluate(context);
    }

    return Result.success(String(val));
  }

  toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      type: this.type,
      label: this.label,
      variableName: this.variableName,
    };
  }
}

export class CompositeNode implements IAstNode {
  constructor(
    public id: string,
    public children: IAstNode[],
    public separator: string = '',
    public label: string = 'Composite Sequence'
  ) {}

  type: 'composite' = 'composite';

  evaluate(context: EvaluatorContext): Result<string, AstError> {
    const results: string[] = [];

    for (const child of this.children) {
      const res = child.evaluate(context);
      if (res.isFailure()) {
        return res;
      }
      results.push(res.getValue());
    }

    return Result.success(results.join(this.separator));
  }

  toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      type: this.type,
      label: this.label,
      separator: this.separator,
      children: this.children.map((c) => c.toJSON()),
    };
  }
}

/**
 * Pre-built Default Perchance Generator Template for AI Agents
 */
export function createDefaultPerchanceRuleSet(): {
  rootNode: IAstNode;
  variables: Record<string, IAstNode>;
} {
  const greetingList = new ListNode('node_greeting', [
    { weight: 40, node: new TextNode('t1', 'System Alert: Zero-Trust Security Active.') },
    { weight: 30, node: new TextNode('t2', 'Aegis Orchestrator initialized. Virtual Loom threads mounted.') },
    { weight: 30, node: new TextNode('t3', 'Perchance AST Engine ready for prompt generation.') },
  ], 'Greeting Selector');

  const agentRoleList = new ListNode('node_role', [
    { weight: 50, node: new TextNode('r1', 'Autonomous Cyber Defense Agent') },
    { weight: 30, node: new TextNode('r2', 'Monadic AST Code Generator') },
    { weight: 20, node: new TextNode('r3', 'Project Loom Thread Auditor') },
  ], 'Agent Persona Role');

  const actionList = new ListNode('node_action', [
    { weight: 40, node: new TextNode('a1', 'evaluating incoming DAG rules and deep-freezing bridge payloads.') },
    { weight: 35, node: new TextNode('a2', 'routing multimodal vision frames to Ollama/Gemini providers.') },
    { weight: 25, node: new TextNode('a3', 'enforcing role-based access control and salted credential safety.') },
  ], 'Current Action');

  const rootSequence = new CompositeNode('node_root', [
    new VariableReferenceNode('v1', 'greeting'),
    new TextNode('space1', ' Operating as '),
    new VariableReferenceNode('v2', 'agentRole'),
    new TextNode('space2', ' - currently '),
    new VariableReferenceNode('v3', 'action'),
  ], '', 'Main Perchance Output');

  return {
    rootNode: rootSequence,
    variables: {
      greeting: greetingList,
      agentRole: agentRoleList,
      action: actionList,
    },
  };
}
