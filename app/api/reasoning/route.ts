import { openai } from "@ai-sdk/openai";
import { UIMessage, streamText, convertToModelMessages } from "ai";

export async function POST(req: Request) {
    const { messages }: { messages: UIMessage[] } = await req.json()

    try {
        const res = streamText({
            model: openai("gpt-5-nano"),
            messages: await convertToModelMessages(messages),
            providerOptions: {
                openai: {
                    reasoningSummary: "auto", // if want short summary of reasoning then change it from auto to concise
                    reasoningEffort: 'low'
                }
            }
        })

        return res.toUIMessageStreamResponse({
            sendReasoning: true
        })
    } catch (err) {
        console.log('Error while generating the text', err)
        return new Response("Failed to stream chat completion", { status: 500 })
    }
}