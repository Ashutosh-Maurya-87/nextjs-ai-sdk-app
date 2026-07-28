import { openai } from "@ai-sdk/openai";
import { streamText, convertToModelMessages } from "ai";
import { MyUIMessage } from "./types";

export async function POST(req: Request) {
    const { messages }: { messages: MyUIMessage[] } = await req.json()

    try {
        const res = streamText({
            model: openai("gpt-4.1-nano"),
            messages: await convertToModelMessages(messages)
        })
        return res.toUIMessageStreamResponse({
            messageMetadata: ({ part }) => {
                if (part.type === 'start') {
                    return {
                        createdAt: Date.now()
                    }
                }
                if (part.type === 'finish') {
                    console.log('totalUsage--', part.totalUsage)
                    return {
                        totalTokens: part.totalUsage.totalTokens
                    }
                }
            }
        })
    } catch (err) {
        console.log('Error while generating the text', err)
        return new Response("Failed to stream chat completion", { status: 500 })
    }
}