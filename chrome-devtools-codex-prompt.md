# Chrome DevTools MCP for Codex CLI
## Complete install and usage context for browser automation, debugging, and performance workflows

Use this guide when running Codex with the official Chrome DevTools MCP server from `ChromeDevTools/chrome-devtools-mcp`.

---

## Setup (once per machine)

Official requirements from the upstream repo:

- Node.js `v20.19+`
- Google Chrome current stable or newer
- `npm`
- Codex CLI configured locally

Quick verification:

```bash
node --version
npm --version
google-chrome --version    # Linux, if available
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --version  # macOS
codex --version
```

---

## Register Chrome DevTools MCP in Codex

Official Codex install command from the upstream README:

```bash
codex mcp add chrome-devtools -- npx chrome-devtools-mcp@latest
codex mcp list
```

This uses the official MCP server directly from npm and keeps the install path aligned with the upstream project.

---

## Standard MCP config shape

The upstream repo documents this as the baseline MCP configuration:

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

In Codex, the `codex mcp add ...` command above is the easiest path. Use the config shape when you need to reason about custom arguments.

---

## Best launch modes

### Default mode

Use the standard install when you want the full toolset and are fine with the MCP server launching its own Chrome profile.

```bash
codex mcp add chrome-devtools -- npx chrome-devtools-mcp@latest
```

### Slim headless mode

Use this when you only need basic browser tasks and want a lighter tool surface.

Upstream example:

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

`--slim` exposes only a small tool subset for navigation, script execution, and screenshots.

### Clean isolated browser profile

Use this when you want temporary browser state that is deleted after the session:

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

Use this when Codex is sandboxed, when you need to preserve login state, or when you want to debug a browser you started manually:

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

For Chrome `144+`, the upstream repo supports `--autoConnect` after you enable remote debugging in `chrome://inspect/#remote-debugging`:

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

This is best when you want to alternate between manual browser testing and Codex-driven testing in the same profile.

---

## Windows 11 note for Codex

The upstream README includes a Windows-specific `.codex/config.toml` example because Chrome startup can need explicit environment variables and a longer timeout:

```toml
[mcp_servers.chrome-devtools]
command = "cmd"
args = [
    "/c",
    "npx",
    "-y",
    "chrome-devtools-mcp@latest",
]
env = { SystemRoot="C:\\Windows", PROGRAMFILES="C:\\Program Files" }
startup_timeout_ms = 20_000
```

---

## Core execution truth

- Connecting the MCP server does not immediately launch Chrome.
- Chrome starts automatically only when Codex invokes a tool that requires a running browser.
- If you use `--browser-url` or `--autoConnect`, you are responsible for having the target browser ready.

---

## First prompt to verify the install

The upstream repo recommends this exact smoke test:

```txt
Check the performance of https://developers.chrome.com
```

Expected result:

- Codex uses the Chrome DevTools MCP server
- Chrome opens or connects
- a performance trace is recorded
- Codex returns a performance-oriented summary

---

## Best-use workflow in Codex

### 1. Start your local app

```bash
npm run dev
```

### 2. Give Codex a browser-aware task

Examples:

```bash
codex "Use chrome-devtools MCP to open http://127.0.0.1:4321, inspect console errors, and fix the root cause."
```

```bash
codex "Use chrome-devtools MCP to test the mobile layout of http://127.0.0.1:4321/en, capture a screenshot, and fix any obvious overlap or spacing bugs."
```

```bash
codex "Use chrome-devtools MCP to analyze the performance of http://127.0.0.1:4321/en and improve the largest bottlenecks."
```

### 3. Ask for explicit browser actions

Prompt pattern:

```txt
Use chrome-devtools MCP.
1. Open <url>.
2. Reproduce the issue.
3. Inspect console, network, DOM, and screenshots as needed.
4. Make the code change.
5. Re-run the browser flow to verify the fix.
```

This produces more reliable behavior than a vague “check the page” prompt.

---

## Highest-value Chrome DevTools MCP tasks

Use this MCP when the task depends on a real browser:

- UI regressions and responsive bugs
- Console errors and stack traces
- Network failures and request inspection
- Screenshot capture and visual verification
- Lighthouse audits
- Performance tracing and memory inspection

Key tool groups from the upstream README:

- Input automation: `click`, `fill`, `hover`, `press_key`, `type_text`, `upload_file`
- Navigation: `navigate_page`, `new_page`, `select_page`, `wait_for`
- Performance: `performance_start_trace`, `performance_stop_trace`, `performance_analyze_insight`, `take_memory_snapshot`
- Debugging: `evaluate_script`, `list_console_messages`, `get_console_message`, `lighthouse_audit`, `take_screenshot`, `take_snapshot`

---

## Recommended operating patterns

### Debugging a frontend bug

```txt
Use chrome-devtools MCP to open http://127.0.0.1:4321/en.
Reproduce the issue in the hero section.
Inspect console errors, DOM structure, computed layout, and take a screenshot.
Fix the issue in code and verify the page after the patch.
```

### Checking responsiveness

```txt
Use chrome-devtools MCP to open http://127.0.0.1:4321/en.
Test desktop and mobile layouts.
Focus on overlaps, touch targets, hidden text, and scroll behavior.
Take screenshots and fix the problems you find.
```

### Performance pass

```txt
Use chrome-devtools MCP to analyze the performance of http://127.0.0.1:4321/en.
Record a trace, summarize LCP/CLS/INP-related issues, and implement the highest-impact improvements.
```

---

## Guardrails

- The upstream repo warns that this MCP exposes browser contents to the MCP client. Do not use it on sensitive sessions unless that exposure is acceptable.
- Usage statistics are enabled by default. To opt out, add `--no-usage-statistics`.
- Performance analysis may query CrUX by URL. To disable that, add `--no-performance-crux`.
- If you open a remote debugging port manually, use a non-default Chrome user-data directory.
- If you need authentication headers for a remote WebSocket Chrome target, the upstream repo supports `--wsEndpoint` and `--wsHeaders`.

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
- [OpenAI Codex MCP Guide](https://developers.openai.com)
