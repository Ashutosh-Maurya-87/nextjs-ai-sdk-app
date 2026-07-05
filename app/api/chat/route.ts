import { openai } from "@ai-sdk/openai";
import { UIMessage, streamText, convertToModelMessages } from "ai";

export async function POST(req: Request) {
    const { messages }: { messages: UIMessage[] } = await req.json()

    try {
        const res = streamText({
            model: openai("gpt-4.1-nano"),
            system: 'You are a helpful coding assistant.Keep Resources under 3 sentences and focus on practical example.',
            messages: await convertToModelMessages(messages)
        })
        res.usage.then((usage) => {
            console.log({
                messageCount: messages.length,
                inputTokens: usage.inputTokens,
                outputTokens: usage.outputTokens,
                outputTokenDetails: usage.outputTokenDetails,
                totalTokens: usage.totalTokens
            })
        })
        return res.toUIMessageStreamResponse()
    } catch (err) {
        console.log('Error while generating the text', err)
        return new Response("Failed to stream chat completion", { status: 500 })
    }
}