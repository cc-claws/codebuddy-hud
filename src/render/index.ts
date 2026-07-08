import type { RenderContext } from '../types.js';
import { renderIdentityLine } from './identity.js';
import { renderStatsLine, renderContextBar } from './stats.js';
import { renderActivityLine } from './activity.js';
import { getTerminalWidth, wrapLineToWidth } from './width.js';
import { getModelName, getProjectPath } from '../stdin.js';
import { colorize, dim, RESET } from './colors.js';

function renderExpanded(ctx: RenderContext): string[] {
  const lines: string[] = [];
  const identity = renderIdentityLine(ctx);
  if (identity) lines.push(identity);
  const stats = renderStatsLine(ctx);
  if (stats) lines.push(stats);
  const activity = renderActivityLine(ctx);
  if (activity) lines.push(activity);
  return lines;
}

function renderCompact(ctx: RenderContext): string[] {
  const { config, stdin, gitStatus } = ctx;
  const { display, colors } = config;

  const parts: string[] = [];

  // Model + context bar (ONE part, space-separated, no | between them)
  const modelBar: string[] = [];
  if (display.model) {
    const name = getModelName(stdin);
    modelBar.push(colorize(`[${name}]`, colors.model));
  }
  const contextBar = renderContextBar(ctx);
  if (contextBar) modelBar.push(contextBar);
  if (modelBar.length > 0) parts.push(modelBar.join(' '));

  // Project + git part
  if (display.project) {
    const project = getProjectPath(stdin, display.projectDepth);
    let segment = colorize(project, colors.project);
    if (display.git && gitStatus) {
      const dirty = gitStatus.isDirty && config.git.dirty ? '*' : '';
      const gitPrefix = colorize('git:(', colors.git);
      const gitBranchStr = colorize(`${gitStatus.branch}${dirty}`, colors.gitBranch ?? colors.git);
      const gitSuffix = colorize(')', colors.git);
      segment += ' ' + gitPrefix + gitBranchStr + gitSuffix;
    }
    parts.push(segment);
  }

  // Version
  if (display.version) {
    const ver = stdin.version;
    if (ver) parts.push(`v${ver}`);
  }

  // Stats: tok → duration → speed (order matching claude-hud)
  const stats = renderStatsLine(ctx, { includeContext: false });
  if (stats) parts.push(stats);

  // First line: model, context, project, stats
  const lines: string[] = [];
  if (parts.length > 0) lines.push(parts.join(' | '));

  // Second line: activity (tools/agents/tasks)
  const activity = renderActivityLine(ctx);
  if (activity) lines.push(activity);

  return lines;
}

export function render(ctx: RenderContext): void {
  const layout = ctx.config.layout;
  const lines = layout === 'expanded'
    ? renderExpanded(ctx)
    : renderCompact(ctx);

  const terminalWidth = getTerminalWidth();
  const outputLines = terminalWidth
    ? lines.flatMap(line => wrapLineToWidth(line, terminalWidth))
    : lines;

  for (const line of outputLines) {
    console.log(`${RESET}${line}`);
  }
}
