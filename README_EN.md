<div align="center">

English | [中文](README.md)

# codebuddy-hud

**A HUD-style status line for CodeBuddy Code — real-time model, context, git, tool stats, token usage**

Compatible with both CodeBuddy Code and Claude Code transcript formats, colors aligned with claude-hud.

[![npm](https://img.shields.io/npm/v/codebuddy-hud)](https://www.npmjs.com/package/codebuddy-hud)
[![GitHub stars](https://img.shields.io/github/stars/cc-claws/codebuddy-hud?style=social)](https://github.com/cc-claws/codebuddy-hud/stargazers)
[![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](LICENSE)
[![tests](https://img.shields.io/badge/tests-131%20passing-brightgreen?style=flat-square)](tests)

<p align="center"><code>/plugin marketplace add cc-claws/codebuddy-hud</code></p>

[Why codebuddy-hud](#why-codebuddy-hud) · [Features](#features) · [Installation](#installation) · [Configuration](#configuration) · [Credits](#credits)

</div>

## ❤️Sponsor

> [Want to appear here?](mailto:wismyzhizi2018@gmail.com)

<details open>
<summary>Click to collapse</summary>

[![Kimi K2.6](assets/partners/logos/kimi.png)](https://platform.moonshot.cn/console?aff=cc-code)

Kimi K2.6 is an open-source native multimodal Agent model by Moonshot AI, designed for long-horizon programming, design-driven coding, and group task orchestration. Supports frontend, DevOps, performance optimization, full-stack engineering.[Register](https://platform.moonshot.cn/console?aff=cc-code)

---

<table>
<tr>
<td width="180"><a href="https://platform.xiaomimimo.com?ref=JBEYTF"><img src="assets/partners/logos/mimo.jpg" alt="Xiaomi MiMo" width="150"></a></td>
<td>Xiaomi's top model MiMo V2.5 — register with invite code: both parties get ¥10 API credit + 10% off first order. Invite code: JBEYTF.<a href="https://platform.xiaomimimo.com?ref=JBEYTF">Register</a>（auto-filled · credit valid 40 days）</td>
</tr>

<tr>
<td width="180"><a href="https://www.bigmodel.cn/glm-coding?ic=MR7BVITFAY"><img src="assets/partners/logos/glm.png" alt="GLM" width="150"></a></td>
<td>Zhipu GLM Coding Plan — China's top coding LLM, 20+ mainstream tools supported, unbeatable value.<a href="https://www.bigmodel.cn/glm-coding?ic=MR7BVITFAY">Join now</a></td>
</tr>

<tr>
<td width="180"><a href="https://opencode.ai/go?ref=GVX7W8XST0"><img src="assets/partners/logos/opencode.png" alt="OpenCode" width="150"></a></td>
<td>OpenCode — Get ¥35 API credit on registration. Everyone can register to claim.<a href="https://opencode.ai/go?ref=GVX7W8XST0">Register</a>（invite code: GVX7W8XST0）</td>
</tr>
</table>

</details>

---

## Why codebuddy-hud?

| Feature | claude-hud | t-code-agent-plugins | codebuddy-hud |
|---------|-----------|---------------------|---------------|
| CodeBuddy Code format | ❌ Not supported | ❌ Not supported | ✅ Native `function_call_result` |
| Claude Code format | ✅ Supported | ✅ Supported | ✅ `tool_use` supported |
| Tool stats | Last 20 only | Last 20 only | ✅ Full session cumulative |
| Startup speed | ~0.35s | ~1.1s | ✅ ~0.2s |
| Colors aligned with claude-hud | — | ❌ | ✅ Fully aligned |
| stdin timeout | 250ms | 1000ms | ✅ No timeout (`for await`) |
| Git commands | Sequential | Sequential | ✅ Parallel (`Promise.all`) |
| Cache | None | Write-only (bug) | ✅ Full read/write |
| Tests | 131 passing | 0 tests (script bug) | ✅ 131 passing |

---

## Features

| Feature | Description |
|---------|-------------|
| **Dual format support** | Both CodeBuddy Code `function_call_result` and Claude Code `tool_use` transcripts |
| **Real-time tool stats** | Cumulative session tool call counts (`✓ Bash ×102 \| ✓ Read ×79 \| ...`) |
| **Running tools** | Live indicator for in-progress tools (`◐ Bash`) |
| **Token usage** | Session token stats (`tok: 841k (in: 12k, out: 5k)`) |
| **Output speed** | Output tokens per second (`out: 170.4 tok/s`) |
| **Session duration** | Time since session start (`⏱️ 14h 43m`) |
| **Context progress bar** | Color changes with usage (green < 70% < yellow < 85% < red) |
| **Git status** | Branch name + dirty marker (`git:(main*)`) |
| **Fully configurable** | All display elements, colors, thresholds customizable |
| **Compact two-line** | First line session info, second line tool stats |

### Preview

```
[hy3-preview] █░░░░░░░░░ 5% | nt_order git:(main*) | tok: 841k (in: 12k, out: 5k) | ⏱️  14h 43m | out: 166.7 tok/s
✓ Bash ×102 | ✓ Read ×79 | ✓ Edit ×56 | ✓ Grep ×4 | +4 more
```

---

## Installation

### Plugin Marketplace (recommended)

```bash
/plugin marketplace add cc-claws/codebuddy-hud
/plugin install codebuddy-hud@codebuddy-hud
```

### Manual Installation

```bash
git clone https://github.com/cc-claws/codebuddy-hud.git ~/.codebuddy-hud
cd ~/.codebuddy-hud
npm install
npm run build
```

Add to `~/.codebuddy/settings.json`:

```json
{
  "statusLine": {
    "type": "command",
    "command": "node ~/.codebuddy-hud/dist/index.js",
    "padding": 0
  }
}
```

Restart CodeBuddy Code.

---

## Configuration

Edit `~/.codebuddy/plugins/codebuddy-hud/config.json`:

```json
{
  "layout": "compact",
  "display": {
    "model": true,
    "project": true,
    "projectDepth": 1,
    "git": true,
    "version": false,
    "cost": false,
    "duration": true,
    "diff": false,
    "tools": true,
    "toolsMaxVisible": 4,
    "toolNameMaxLength": 0,
    "agents": false,
    "tasks": false,
    "contextUsage": true,
    "contextValues": false,
    "showSpeed": true,
    "showSessionTokens": true
  },
  "colors": {
    "model": "cyan",
    "project": "yellow",
    "git": "magenta",
    "gitBranch": "cyan",
    "label": "dim",
    "cost": "cyan",
    "costWarning": 0.10,
    "costCritical": 0.50,
    "contextWarning": 70,
    "contextCritical": 85,
    "barFilled": "█",
    "barEmpty": "░"
  },
  "git": {
    "dirty": true,
    "aheadBehind": false
  }
}
```

### Display Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `model` | boolean | `true` | Model name |
| `project` | boolean | `true` | Project path |
| `projectDepth` | number | `1` | Path depth (1-3) |
| `git` | boolean | `false` | Git branch + status |
| `version` | boolean | `false` | CodeBuddy Code version |
| `cost` | boolean | `false` | Session cost |
| `duration` | boolean | `false` | Session duration |
| `diff` | boolean | `false` | Code changes (+/-) |
| `tools` | boolean | `false` | Tool call statistics |
| `toolsMaxVisible` | number | `4` | Max tools to show (0 = all) |
| `toolNameMaxLength` | number | `0` | Tool name truncation length (0 = no limit) |
| `agents` | boolean | `false` | Agent statistics |
| `tasks` | boolean | `false` | Task progress |
| `contextUsage` | boolean | `true` | Context window progress bar |
| `contextValues` | boolean | `false` | Token values in context bar |
| `showSpeed` | boolean | `false` | Output speed (tok/s) |
| `showSessionTokens` | boolean | `false` | Session token stats |

### Color Options

Supports named colors (`red`, `green`, `yellow`, `blue`, `magenta`, `cyan`, `dim`), 256-color indices (0-255), HEX strings (`#FF5500`).

| Option | Default | Description |
|--------|---------|-------------|
| `model` | `"cyan"` | Model name color |
| `project` | `"yellow"` | Project path color |
| `git` | `"magenta"` | Git prefix/suffix color `git:( )` |
| `gitBranch` | `"cyan"` | Git branch name color |
| `label` | `"dim"` | Label color (tok, duration, speed) |
| `contextWarning` | `70` | Context % warning threshold (yellow) |
| `contextCritical` | `85` | Context % critical threshold (red) |
| `barFilled` | `"█"` | Progress bar filled character |
| `barEmpty` | `"░"` | Progress bar empty character |

---

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Watch mode
npm run dev

# Run tests
npm test
```

---

## Repository Structure

```
codebuddy-hud/
├── src/
│   ├── index.ts              # Main entry
│   ├── stdin.ts              # stdin reading
│   ├── transcript.ts         # Transcript parsing (dual format)
│   ├── config.ts             # Config loading
│   ├── git.ts                # Git status (parallel)
│   ├── types.ts              # Type definitions
│   ├── render/
│   │   ├── index.ts          # Render logic
│   │   ├── stats.ts          # Stats (tok/duration/speed)
│   │   ├── activity.ts       # Tool stats rendering
│   │   ├── colors.ts         # Color functions
│   │   ├── identity.ts       # Identity line
│   │   ├── icons.ts          # Icons
│   │   └── width.ts          # Terminal width
│   └── utils/
│       └── format.ts         # Formatting utilities
├── tests/                    # 131 tests
├── skills/                   # CodeBuddy Code Skills
├── package.json
├── tsconfig.json
├── LICENSE
└── README.md
```

---

## Compatibility

| Platform | Support | Notes |
|----------|---------|-------|
| **CodeBuddy Code** | ✅ Full support | Native `function_call_result` transcript format |
| **Claude Code** | ✅ Compatible | Supports Anthropic `tool_use` transcript format |

---

## Credits

| Project | Description |
|---------|-------------|
| [t-code-agent-plugins (tyanxie)](https://github.com/tyanxie/t-code-agent-plugins) | Based on tyanxie's original codebuddy-hud |
| [claude-hud (jarrodwatts)](https://github.com/jarrodwatts/claude-hud) | Color scheme and rendering format reference |
| [CodeBuddy Code](https://cnb.cool/codebuddy/codebuddy-code) | CodeBuddy Code CLI tool |

---

## License

[MIT](LICENSE) — Free to use, modify, and distribute, including commercial use.
