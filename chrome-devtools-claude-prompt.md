# Chrome DevTools MCP for Claude Code CLI
## Complete install and usage context for interactive browser debugging, automation, and performance analysis

Use this guide when working in Claude Code with the official Chrome DevTools MCP server from `ChromeDevTools/chrome-devtools-mcp`.

---

## Setup (once per machine)

Official requirements from the upstream repo:

- Node.js `v20.19+`
- Google Chrome current stable or newer
- `npm`
- Claude Code installed locally

Quick verification:

```bash
node --version
npm --version
claude --version
```

---

## Install Chrome DevTools MCP in Claude Code

### Option 1: MCP only

Official upstream install command:

```bash
claude mcp add chrome-devtools --scope user npx chrome-devtools-mcp@latest
```

This is the simplest path if you only want the MCP server.

### Option 2: Plugin install (MCP + Skills)

Official upstream plugin flow:

```txt
/plugin marketplace add ChromeDevTools/chrome-devtools-mcp
/plugin install chrome-devtools-mcp
```

Then restart Claude Code and verify with:

```txt
/skills
```

Important upstream note:

- If Chrome DevTools MCP was installed previously in Claude Code, remove the old installation first before switching to the plugin install path.

---

## Standard MCP config shape

The upstream repo documents this baseline MCP configuration:

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": ["-y", "chrome-devtools-mcp@latest"]
    }
  }
}
```

Claude Code’s CLI install command is the easiest route. Use this config shape when you need to reason about advanced flags.

---

## Best launch modes

### Default mode

Full Chrome DevTools MCP toolset:

```bash
claude mcp add chrome-devtools --scope user npx chrome-devtools-mcp@latest
```

### Slim headless mode

Use this when you only need lightweight browser automation and screenshots.

Upstream config example:

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": ["-y", "chrome-devtools-mcp@latest", "--slim", "--headless"]
    }
  }
}
```

### Isolated browser profile

Use this to prevent persistent browser state between runs:

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": [
        "-y",
        "chrome-devtools-mcp@latest",
        "--headless=true",
        "--isolated=true"
      ]
    }
  }
}
```

### Connect to an already running Chrome

Useful when you want to preserve logged-in state, reuse a browser outside Claude’s sandbox, or debug a session you started manually:

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": [
        "-y",
        "chrome-devtools-mcp@latest",
        "--browser-url=http://127.0.0.1:9222"
      ]
    }
  }
}
```

### Auto-connect to a running Chrome profile

For Chrome `144+`, the upstream repo supports `--autoConnect` after remote debugging is enabled from `chrome://inspect/#remote-debugging`:

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": ["-y", "chrome-devtools-mcp@latest", "--autoConnect"]
    }
  }
}
```

This is the best option when you want Claude to work against the same live browser profile you are already using manually.

---

## Core execution model

- Claude Code uses the MCP server only when a task actually requires browser interaction.
- Connecting the server alone does not launch Chrome.
- The MCP server starts a browser automatically only when Claude invokes a browser-dependent tool.
- If you configure `--browser-url` or `--autoConnect`, you must have the target browser running and reachable.

---

## First prompt to verify the install

The upstream README recommends this smoke test:

```txt
Check the performance of https://developers.chrome.com
```

Expected result:

- Claude invokes the Chrome DevTools MCP server
- Chrome opens or connects
- a performance trace is recorded
- Claude returns performance findings

---

## Best-use workflow in Claude Code

### 1. Start your app

```bash
npm run dev
```

### 2. Give Claude an explicit browser task

Example:

```txt
Use chrome-devtools MCP to open http://127.0.0.1:4321/en.
Inspect the hero, nav, and gallery for layout bugs.
Check console and network errors.
Fix the issues you find and verify the page after the patch.
```

### 3. Prefer stepwise prompts

Prompt pattern:

```txt
Use chrome-devtools MCP.
1. Open <url>.
2. Reproduce the bug or audit target flow.
3. Inspect console, network, DOM, screenshots, and performance as needed.
4. Make the code change.
5. Re-run the browser flow and confirm the fix.
```

This is more reliable than asking Claude to “look at the page” without clear browser tasks.

---

## Highest-value Chrome DevTools MCP tasks in Claude

Use the MCP when the task depends on a real browser, not just static code inspection:

- debugging layout and interaction bugs
- capturing screenshots during review
- tracing performance issues
- checking network failures and request payloads
- reading console errors with source-mapped traces
- running Lighthouse audits

Key tool groups from the upstream README:

- Input automation: `click`, `drag`, `fill`, `fill_form`, `hover`, `press_key`, `type_text`, `upload_file`
- Navigation: `navigate_page`, `new_page`, `select_page`, `wait_for`, `list_pages`
- Performance: `performance_start_trace`, `performance_stop_trace`, `performance_analyze_insight`, `take_memory_snapshot`
- Debugging: `evaluate_script`, `list_console_messages`, `get_console_message`, `take_screenshot`, `take_snapshot`, `lighthouse_audit`

---

## Recommended prompt templates

### Reproduce and fix a UI bug

```txt
Use chrome-devtools MCP to open http://127.0.0.1:4321/en.
Reproduce the overlap bug in the hero.
Inspect DOM, computed layout, and any console issues.
Fix the bug in code and verify with a new screenshot.
```

### Responsive audit

```txt
Use chrome-devtools MCP to audit http://127.0.0.1:4321/en for mobile and desktop issues.
Focus on touch targets, hidden text, overflow, sticky navigation behavior, and gallery layout.
Take screenshots and fix the highest-impact issues.
```

### Performance pass

```txt
Use chrome-devtools MCP to record a performance trace for http://127.0.0.1:4321/en.
Summarize the biggest LCP, CLS, and interaction bottlenecks.
Implement the highest-value fixes and verify the result.
```

### Debugging a logged-in flow

```txt
Use chrome-devtools MCP with my running Chrome profile.
Open the current app state, inspect the authenticated flow, reproduce the issue, and fix it without resetting the logged-in session.
```

This last pattern is best with `--browser-url` or `--autoConnect`.

---

## Guardrails

- The upstream repo warns that this MCP can inspect and modify anything in the connected browser session. Do not use it on sensitive browsing sessions unless you accept that exposure.
- Usage statistics are enabled by default. Add `--no-usage-statistics` to opt out.
- Performance workflows may send trace URLs to the CrUX API. Add `--no-performance-crux` to disable that.
- If you manually expose a remote debugging port, use a non-default Chrome profile via `--user-data-dir`.
- For remote WebSocket targets, the upstream repo supports `--wsEndpoint` and `--wsHeaders`.

Example hardened args:

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": [
        "-y",
        "chrome-devtools-mcp@latest",
        "--isolated=true",
        "--no-usage-statistics",
        "--no-performance-crux"
      ]
    }
  }
}
```

---

## Canonical references

- [Chrome DevTools MCP README](https://github.com/ChromeDevTools/chrome-devtools-mcp/blob/main/README.md)
- [Tool Reference](https://github.com/ChromeDevTools/chrome-devtools-mcp/blob/main/docs/tool-reference.md)
- [Troubleshooting](https://github.com/ChromeDevTools/chrome-devtools-mcp/blob/main/docs/troubleshooting.md)
- [Design Principles](https://github.com/ChromeDevTools/chrome-devtools-mcp/blob/main/docs/design-principles.md)
- [Claude Code MCP Guide](https://code.claude.com)
