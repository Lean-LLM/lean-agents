// Command Code: inject only the primary ORCHESTRATOR role. Shared policy is AGENTS.md.
import { readFileSync } from 'node:fs';

const prompt = readFileSync(new URL('../agents/build.md', import.meta.url), 'utf8')
  .replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '')
  .trim();

export default function (cmd: { getActiveTools(): readonly string[]; hooks(h: { appendSystemPrompt(): string | undefined }): void }) {
  cmd.hooks({
    appendSystemPrompt() {
      // Command Code removes agent delegation from workers; never inject a primary role there.
      return cmd.getActiveTools().includes('agent') ? prompt : undefined;
    },
  });
}
