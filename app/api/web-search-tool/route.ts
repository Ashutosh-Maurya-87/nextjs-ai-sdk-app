import { openai } from "@ai-sdk/openai";
import { UIMessage, streamText, convertToModelMessages, InferUITool, InferUITools, UIDataTypes, stepCountIs } from "ai";

const tools = {
    web_search_preview: openai.tools.webSearchPreview({})
}

export type ChatTools = InferUITools<typeof tools>
export type ChatMessage = UIMessage<never, UIDataTypes, ChatTools>
export async function POST(req: Request) {
    const { messages }: { messages: ChatMessage[] } = await req.json()

    try {
        const res = streamText({
            model: openai.responses("gpt-5-mini"),
            messages: await convertToModelMessages(messages),
            tools,
            stopWhen: stepCountIs(2)
        })

        return res.toUIMessageStreamResponse()
    } catch (err) {
        console.log('Error while generating the text', err)
        return new Response("Failed to stream chat completion", { status: 500 })
    }
}