import { getIcon } from './icons.js';
import { dim, green, yellow, cyan } from './colors.js';
import type { RenderContext, ToolEntry, AgentEntry, TaskItem } from '../types.js';

function truncatePath(pathStr: string, maxLen: number = 20): string {
  const normalized = pathStr.replace(/\\/g, '/');
  if (normalized.length <= maxLen) return normalized;
  const parts = normalized.split('/');
  const fileName = parts[parts.length - 1];
  if (fileName.length >= maxLen) {
    return fileName.slice(0, maxLen - 3) + '...';
  }
  return '.../' + fileName;
}

function shortenToolName(name: string, maxLen: number): string {
  if (maxLen === 0 || name.length <= maxLen) return name;
  return `${name.slice(0, Math.max(0, maxLen - 1))}…`;
}

function renderToolsSegment(tools: ToolEntry[], maxVisible: number = 4, nameMaxLength: number = 0): string | null {
  if (tools.length === 0) return null;

  const parts: string[] = [];

  // Running tools (show up to 2, using ◐ like claude-hud)
  const running = tools.filter(t => t.status === 'running');
  for (const tool of running.slice(-2)) {
    const target = tool.target ? truncatePath(tool.target) : '';
    const targetStr = target ? ` ${dim(`: ${target}`)}` : '';
    parts.push(`${yellow('◐')} ${cyan(shortenToolName(tool.name, nameMaxLength))}${targetStr}`);
  }

  // Completed tools (including error, show top N by frequency)
  const counts = new Map<string, number>();
  for (const t of tools) {
    if (t.status === 'completed' || t.status === 'error') {
      counts.set(t.name, (counts.get(t.name) ?? 0) + 1);
    }
  }

  if (counts.size > 0) {
    const sorted = Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
    const visible = maxVisible === 0 ? sorted : sorted.slice(0, maxVisible);
    const completedDisplay = visible.map(([name, count]) =>
      `${green('✓')} ${shortenToolName(name, nameMaxLength)} ${dim(`×${count}`)}`
    );
    parts.push(...completedDisplay);

    const remaining = maxVisible === 0 ? 0 : sorted.length - visible.length;
    if (remaining > 0) {
      parts.push(dim(`+${remaining} more`));
    }
  }

  if (parts.length === 0) return null;
  return parts.join(' | ');
}

function renderAgentsSegment(agents: AgentEntry[]): string | null {
  if (agents.length === 0) return null;

  const running = agents.filter(a => a.status === 'running');
  const icon = getIcon('agents');

  if (running.length > 0) {
    const parts = running.map(a => `${a.type}(run)`);
    return `${icon} ${parts.join(' ')}`;
  }

  // All completed — show most recent
  const last = agents[agents.length - 1];
  return `${icon} ${last.type}(done)`;
}

function renderTasksSegment(tasks: TaskItem[]): string | null {
  if (tasks.length === 0) return null;

  const total = tasks.length;
  const completed = tasks.filter(t => t.status === 'completed').length;
  const filled = Math.round((completed / total) * 5);
  const bar = '#'.repeat(filled) + '-'.repeat(5 - filled);

  const icon = getIcon('tasks');
  return `${icon} [${bar}] ${completed}/${total}`;
}

export function renderActivityLine(ctx: RenderContext): string | null {
  const { config, transcript } = ctx;
  const { display } = config;

  const segments: string[] = [];

  if (display.tools) {
    const seg = renderToolsSegment(
      transcript.tools,
      display.toolsMaxVisible,
      display.toolNameMaxLength,
    );
    if (seg) segments.push(seg);
  }

  if (display.agents) {
    const seg = renderAgentsSegment(transcript.agents);
    if (seg) segments.push(seg);
  }

  if (display.tasks) {
    const seg = renderTasksSegment(transcript.tasks);
    if (seg) segments.push(seg);
  }

  if (segments.length === 0) return null;

  return segments.join(' | ');
}
