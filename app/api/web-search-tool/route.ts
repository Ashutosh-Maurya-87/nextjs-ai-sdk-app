import { openai } from "@ai-sdk/openai";
import { UIMessage, streamText, convertToModelMessages, tool, InferUITool, InferUITools, UIDataTypes, stepCountIs, ToolSet } from "ai";
import { anthropic } from "@ai-sdk/anthropic";

const tools = {
    web_search_preview: openai.tools.webSearchPreview({})
    // web_search: anthropic.tools.webSearch_20260209({
    //     maxUses: 1,
    // })
}
// as ToolSet

export type ChatTools = InferUITools<typeof tools>
export type ChatMessage = UIMessage<never, UIDataTypes, ChatTools>
export async function POST(req: Request) {
    const { messages }: { messages: ChatMessage[] } = await req.json()

    try {
        const res = streamText({
            model: openai.responses("gpt-5-mini"),
            // model: anthropic("claude-sonnet-4-20250514"),
            messages: await convertToModelMessages(messages),
            tools,
            stopWhen: stepCountIs(2)
        })

        return res.toUIMessageStreamResponse({
            sendSources: true
        })
    } catch (err) {
        console.log('Error while generating the text', err)
        return new Response("Failed to stream chat completion", { status: 500 })
    }
}