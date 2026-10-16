import { Plugin } from "@opencode/plugin"

// Enforce synchronous child execution even when a model requests background mode.
export default Plugin.define({
  id: "opencode-lean-foreground-subagents",
  async setup(ctx) {
    await ctx.tool.transform((editor) => {
      editor.update("subagent", (tool) => {
        const execute = tool.execute
        tool.execute = (input, context) => execute({ ...input, background: false }, context)
        tool.description += " All child calls run foreground; background mode is disabled."
      })
    })
  },
})
