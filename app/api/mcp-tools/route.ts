import { openai } from "@ai-sdk/openai";
import {
    UIMessage, streamText, convertToModelMessages, tool,
    InferUITool, InferUITools, UIDataTypes, stepCountIs,
} from "ai";
import { z } from 'zod'
import { createMCPClient } from "@ai-sdk/mcp";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp";

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

    const httpTransport = new StreamableHTTPClientTransport(
        new URL("https://app.mockmcp.com/servers/TU7cZQhLtWzB/mcp"),
        {
            requestInit: {
                headers: {
                    Authorization: "Bearer mcp_m2m_U8-Ug9-fr4-e73SvtSZ_ztcQj9C-A-sue1II4Ou8VhE_5d2c5eea560aedb1"
                }
            }
        }
    )

    const mcpClient = await createMCPClient({
        transport: httpTransport
    })

    const mcpTools = await mcpClient.tools()
    try {
        const res = streamText({
            model: openai("gpt-5-mini"),
            messages: await convertToModelMessages(messages),
            tools: { ...mcpTools, ...tools },
            stopWhen: stepCountIs(2),
            onFinish: async () => {
                await mcpClient.close()
            },
            onError: async (error) => {
                await mcpClient.close()
                console.error('Error ---', error)

            }
        })

        return res.toUIMessageStreamResponse()
    } catch (err) {
        console.log('Error while generating the text', err)
        return new Response("Failed to stream chat completion", { status: 500 })
    }
}