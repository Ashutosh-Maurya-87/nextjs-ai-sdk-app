import { openai } from "@ai-sdk/openai";
import { UIMessage, streamText, convertToModelMessages, tool, InferUITool, InferUITools, UIDataTypes, stepCountIs } from "ai";
import { z } from 'zod'
import { weatherTool } from "./weatherTool";

const tools = {
    getWeatherTool: tool({
        description: 'Get the weather of a given location',
        inputSchema: z.object({
            location: z.string().describe('The location to get the weather for'),
        }),
        execute: async ({ location }) => {
            if (location === 'Ashu City') {
                return `The Weather of Ashu City is 20 C`
            }
            return `Unknown`
        }
    })
}

export type ChatTools = InferUITools<typeof tools>
export type ChatMessage = UIMessage<never, UIDataTypes, ChatTools>
export async function POST(req: Request) {
    const { messages }: { messages: ChatMessage[] } = await req.json()

    try {
        const res = streamText({
            model: openai("gpt-5-mini"),
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