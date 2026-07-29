import { UIMessage, streamText, convertToModelMessages } from "ai";
import { registry } from "./models";

export async function POST(req: Request) {
    const { messages }: { messages: UIMessage[] } = await req.json()

    try {
        const res = streamText({
            model: registry.languageModel('openai:fast'),
            messages: await convertToModelMessages(messages)
        })
        return res.toUIMessageStreamResponse()
    } catch (err) {
        console.log('Error while generating the text', err)
        return new Response("Failed to stream chat completion", { status: 500 })
    }
}