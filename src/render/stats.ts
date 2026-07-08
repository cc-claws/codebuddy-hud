import { getIcon } from './icons.js';
import { colorize, dim } from './colors.js';
import { getCost, getContextWindow } from '../stdin.js';
import { formatCost, formatDuration, formatDiff, formatTokenCount, formatPercentage } from '../utils/format.js';
import type { RenderContext } from '../types.js';

export function renderContextBar(ctx: RenderContext, options?: { showLabel?: boolean }): string | null {
  const { config, stdin } = ctx;
  const { display, colors } = config;
  const showLabel = options?.showLabel ?? false;

  if (!display.contextUsage) return null;

  const cw = getContextWindow(stdin);
  const pct = cw.usedPercentage ?? 0;
  const barLength = 10;
  const filled = Math.round((pct / 100) * barLength);
  const empty = barLength - filled;

  const filledChar = colors.barFilled ?? '\u2588';
  const emptyChar = colors.barEmpty ?? '\u2591';

  const bar = filledChar.repeat(filled) + emptyChar.repeat(empty);
  const pctStr = formatPercentage(pct);

  let color: string;
  if (pct >= colors.contextCritical) {
    color = 'red';
  } else if (pct >= colors.contextWarning) {
    color = 'yellow';
  } else {
    color = 'green';
  }

  let result = showLabel
    ? colorize(`Context ${bar} ${pctStr}`, color)
    : colorize(`${bar} ${pctStr}`, color);

  // Don't show (12k/1M) in context bar - only show percentage (like claude-hud)

  return result;
}

export function renderStatsLine(ctx: RenderContext, options?: { includeContext?: boolean }): string | null {
  const { config, stdin } = ctx;
  const { display, colors } = config;
  const cost = getCost(stdin);
  const includeContext = options?.includeContext ?? true;

  const segments: string[] = [];

  if (includeContext) {
    const contextBar = renderContextBar(ctx, { showLabel: true });
    if (contextBar) segments.push(contextBar);
  }

  if (display.cost && cost.totalCostUsd != null && cost.totalCostUsd > 0) {
    const icon = getIcon('cost');
    const formatted = formatCost(cost.totalCostUsd);
    let color: string;
    if (cost.totalCostUsd >= colors.costCritical) {
      color = 'red';
    } else if (cost.totalCostUsd >= colors.costWarning) {
      color = 'yellow';
    } else {
      color = 'cyan';
    }
    segments.push(colorize(`${icon} ${formatted}`, color));
  }

  // Token usage: tok: 841k (in: 12k, out: 5k) — controlled by showSessionTokens or contextValues
  if (display.showSessionTokens || display.contextValues) {
    const cw = getContextWindow(stdin);
    if (cw.totalInputTokens != null || cw.totalOutputTokens != null) {
      const total = cw.totalInputTokens != null ? formatTokenCount(cw.totalInputTokens) : '0';
      const inTok = cw.currentInputTokens != null ? formatTokenCount(cw.currentInputTokens) : '0';
      const outTok = cw.currentOutputTokens != null ? formatTokenCount(cw.currentOutputTokens) : '0';
      segments.push(dim(`tok: ${total} (in: ${inTok}, out: ${outTok})`));
    }
  }

  // Duration: ⏱️ 14h 43m — AFTER tok (matching claude-hud order)
  if (display.duration && cost.totalDurationMs != null) {
    const formatted = formatDuration(cost.totalDurationMs);
    if (formatted) {
      segments.push(dim(`⏱️  ${formatted}`));
    }
  }

  // Output tokens per second: out: 170.4 tok/s — controlled by showSpeed
  if (display.showSpeed && cost.totalApiDurationMs != null && cost.totalApiDurationMs > 0) {
    const cw = getContextWindow(stdin);
    if (cw.totalOutputTokens != null && cw.totalOutputTokens > 0) {
      const seconds = cost.totalApiDurationMs / 1000;
      const tokPerSec = cw.totalOutputTokens / seconds;
      segments.push(dim(`out: ${tokPerSec.toFixed(1)} tok/s`));
    }
  }

  if (display.diff && (cost.totalLinesAdded != null || cost.totalLinesRemoved != null)) {
    const icon = getIcon('diff');
    const formatted = formatDiff(cost.totalLinesAdded, cost.totalLinesRemoved);
    if (formatted) {
      segments.push(`${icon} ${formatted}`);
    }
  }

  if (segments.length === 0) return null;

  return segments.join(' | ');
}
