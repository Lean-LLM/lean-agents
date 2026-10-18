// Child-session adapter: run existing Markdown agents with native tools available.
import { spawn } from "node:child_process";
import { readFileSync, mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const home = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const names = ["general"];

export default function (pi) {
  pi.registerTool({
    name: "subagent",
    label: "Lean subagent",
    description: "Run one CODER (general) in a foreground child session and await its result.",
    parameters: {
      type: "object",
      properties: {
        agent: { type: "string", enum: names },
        task: { type: "string" },
        prompt: { type: "string" }
      },
      required: ["agent"],
      additionalProperties: false
    },
    async execute(_id, params, signal, _update, ctx) {
      const task = params.task || params.prompt;
      if (!task) return { content: [{ type: "text", text: "Missing task/prompt" }] };
      let source;
      try { source = readFileSync(join(home, "agents", `${params.agent}.md`), "utf8"); }
      catch (e) { return { content: [{ type: "text", text: `Agent not found: ${params.agent}: ${e.message}` }] }; }
      const body = source.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, "");
      const dir = mkdtempSync(join(tmpdir(), "lean-pi-"));
      const promptFile = join(dir, "prompt.md");
      writeFileSync(promptFile, body);
      const args = ["--mode", "json", "-p", "--no-session", "--append-system-prompt", promptFile];
      if (ctx.model?.provider && ctx.model?.id) args.push("--model", `${ctx.model.provider}/${ctx.model.id}`);
      args.push(`Task: ${task}`);
      try {
        const result = await new Promise((done) => {
          const proc = spawn("pi", args, { cwd: ctx.cwd, stdio: ["ignore", "pipe", "pipe"] });
          const answers = [];
          let err = "", partial = "", bufferSize = 0;
          const onChunk = (chunk) => {
            bufferSize += chunk.length;
            if (bufferSize > 8 * 1024 * 1024) { proc.kill(); return; }
            partial += chunk.toString();
            const lines = partial.split("\n"); partial = lines.pop() || "";
            for (const line of lines) {
              try {
                const event = JSON.parse(line);
                if (event.type === "message_end" && event.message?.role === "assistant") {
                  const text = (event.message.content || []).filter(x => x.type === "text").map(x => x.text).join("\n");
                  if (text) answers.push(text);
                }
              } catch { /* ignore non-JSON progress */ }
            }
          };
          proc.stdout.on("data", onChunk);
          proc.stderr.on("data", c => { err = (err + c.toString()).slice(-4000); });
          proc.on("error", e => done({ error: e.message }));
          proc.on("close", code => done({ code, output: answers.at(-1), error: err }));
          if (signal) signal.addEventListener("abort", () => proc.kill(), { once: true });
        });
        const text = result.code === 0 ? (result.output || "Agent returned no response") : `Subagent failed: ${result.error || `exit ${result.code}`}`;
        return { content: [{ type: "text", text: text.slice(0, 20000) }] };
      } finally { rmSync(dir, { recursive: true, force: true }); }
    }
  });
}
