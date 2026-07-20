import { openai } from "@ai-sdk/openai";
import { UIMessage, streamText, convertToModelMessages, tool, InferUITool, InferUITools, UIDataTypes, stepCountIs } from "ai";
import { z } from 'zod'

const tools = {
    getLocationName: tool({
        description: 'Get the location name of the user.',
        inputSchema: z.object({
            name: z.string().describe('The name of the user'),
        }),
        execute: async ({ name }) => {
            if (name === 'Ashu') {
                return `Ashu City`
            }
            if(name === 'Khargosh'){
                return "Ashu & Khargosh Both City"
            }
            return `Unknown`
        }
    }),
    getWeatherTool: tool({
        description: 'Get the weather of a given location',
        inputSchema: z.object({
            city: z.string().describe('The location to get the weather for'),
        }),
        execute: async ({ city }) => {
            if (city === 'Ashu City') {
                return `The Weather of Ashu City is 20 C`
            }
            if (city === 'Ashu & Khargosh Both City') {
                return `The Weather of Ashu & Khargosh Both City is 18 C`
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
            stopWhen: stepCountIs(3)
        })

        return res.toUIMessageStreamResponse()
    } catch (err) {
        console.log('Error while generating the text', err)
        return new Response("Failed to stream chat completion", { status: 500 })
    }
}