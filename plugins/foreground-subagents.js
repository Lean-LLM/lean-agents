import { Plugin } from "@opencode/plugin"

// Native subagents only: always fresh, foreground, and with a known leaf role.
export default Plugin.define({
  id: "opencode-lean-foreground-subagents",
  async setup(ctx) {
    await ctx.tool.transform((editor) => {
      editor.update("subagent", (tool) => {
        const execute = tool.execute
        tool.execute = (input, context) => {
          const { sessionID: _ignored, ...fresh } = input
          const valid = ["explore", "general", "lean-reviewer", "lean-profiler"]
          const agent = valid.includes(fresh.agent) ? fresh.agent : "general"
          return execute({ ...fresh, agent, background: false }, context)
        }
        tool.description += " Start a fresh foreground child only. Select explore, general, lean-reviewer or lean-profiler; do not use continuation IDs."
      })
    })
  },
})
