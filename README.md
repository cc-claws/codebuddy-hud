# codebuddy-hud

A HUD-style status line for [CodeBuddy Code](https://cnb.cool/codebuddy/codebuddy-code), showing model, context usage, project, git status, tool stats, token usage, session duration, and output speed.

Based on [t-code-agent-plugins](https://github.com/tyanxie/t-code-agent-plugins) by tyanxie and inspired by [claude-hud](https://github.com/jarrodwatts/claude-hud) by jarrodwatts.

## Features

- **Model + Context Bar** — Current model name with context window usage progress bar (green/yellow/red)
- **Project + Git** — Project path with git branch and dirty status
- **Tool Stats** — Cumulative tool call counts for the entire session (`✓ Bash ×102 | ✓ Read ×79 | ...`)
- **Token Usage** — Session token stats (`tok: 841k (in: 12k, out: 5k)`)
- **Session Duration** — Time since session start (`⏱️ 14h 43m`)
- **Output Speed** — Tokens per second (`out: 170.4 tok/s`)
- **Running Tools** — Live spinner for in-progress tool calls (`◐ Bash`)
- **Compact Layout** — Two-line display: session info + tool stats
- **Fully Configurable** — All display elements, colors, and thresholds customizable

## Screenshot

```
[hy3-preview] █░░░░░░░░░ 5% | nt_order git:(main*) | tok: 841k (in: 12k, out: 5k) | ⏱️  14h 43m | out: 166.7 tok/s
✓ Bash ×102 | ✓ Read ×79 | ✓ Edit ×56 | ✓ Grep ×4 | +4 more
```

## Installation

### Via Plugin Marketplace

```bash
/plugin marketplace add your-username/codebuddy-hud
/plugin install codebuddy-hud@codebuddy-hud
```

### Manual Installation

```bash
git clone https://github.com/your-username/codebuddy-hud.git ~/.codebuddy-hud
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
| `model` | boolean | `true` | Show model name |
| `project` | boolean | `true` | Show project path |
| `projectDepth` | number | `1` | Path depth (1-3) |
| `git` | boolean | `false` | Show git branch + status |
| `version` | boolean | `false` | Show CodeBuddy Code version |
| `cost` | boolean | `false` | Show session cost |
| `duration` | boolean | `false` | Show session duration |
| `diff` | boolean | `false` | Show code changes (+/-) |
| `tools` | boolean | `false` | Show tool call statistics |
| `toolsMaxVisible` | number | `4` | Max tools to show (0 = all) |
| `toolNameMaxLength` | number | `0` | Tool name truncation length (0 = no limit) |
| `agents` | boolean | `false` | Show agent statistics |
| `tasks` | boolean | `false` | Show task progress |
| `contextUsage` | boolean | `true` | Show context window progress bar |
| `contextValues` | boolean | `false` | Show token values in context bar |
| `showSpeed` | boolean | `false` | Show output speed (tok/s) |
| `showSessionTokens` | boolean | `false` | Show session token stats |

### Color Options

Colors support named colors (`red`, `green`, `yellow`, `blue`, `magenta`, `cyan`, `dim`), 256-color indices (0-255), and hex strings (`#FF5500`).

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

## Compatibility

- **CodeBuddy Code** — Full support (including `function_call_result` transcript format)
- **Claude Code** — Compatible (supports Anthropic `tool_use` transcript format)

## Credits

- **Original code**: [tyanxie/t-code-agent-plugins](https://github.com/tyanxie/t-code-agent-plugins)
- **Color/format inspiration**: [jarrodwatts/claude-hud](https://github.com/jarrodwatts/claude-hud)
- **CodeBuddy Code format support**: Added `function_call_result` parsing for CodeBuddy Code compatibility

## License

[MIT](LICENSE)
