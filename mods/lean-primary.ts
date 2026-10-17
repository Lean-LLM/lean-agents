// Command Code bridge. Uses the shared build prompt; no duplicate agent definitions.
import { readFileSync } from 'node:fs';

const prompt = readFileSync(new URL('../agents/build.md', import.meta.url), 'utf8')
  .replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '')
  .trim();

export default function (cmd: { getActiveTools(): readonly string[]; hooks(h: { appendSystemPrompt(): string | undefined }): void }) {
  cmd.hooks({
    appendSystemPrompt() {
      // Workers do not have Command Code's agent delegation tool.
      // Never inject the primary role into worker prompts.
      return cmd.getActiveTools().includes('agent') ? prompt : undefined;
    },
  });
}
