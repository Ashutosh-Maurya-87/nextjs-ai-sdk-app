import { openai } from "@ai-sdk/openai";
import { UIMessage, streamText, convertToModelMessages } from "ai";

export async function POST(req: Request) {
    const { messages }: { messages: UIMessage[] } = await req.json()

    try {
        const res = streamText({
            model: openai("gpt-4.1-nano"),
            messages: await convertToModelMessages(messages)
        })

        return res.toUIMessageStreamResponse()
    } catch (err) {
        console.log('Error while generating the text', err)
        return new Response("Failed to stream chat completion", { status: 500 })
    }
}