import { openai } from "@ai-sdk/openai";
import { UIMessage, streamText, convertToModelMessages, tool, InferUITool, InferUITools, UIDataTypes, stepCountIs } from "ai";
import { z } from 'zod'

const tools = {
    getWeatherTool: tool({
        description: 'Get the weather of a given location',
        inputSchema: z.object({
            city: z.string().describe('The location to get the weather for'),
        }),
        execute: async ({ city }) => {
            const res = await fetch(`http://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${city}`)
            const data = await res.json()
            console.log('data of api', data)
            const weatherData = {
                location: {
                    name: data?.location?.name,
                    country: data?.location?.country,
                    localtime: data?.location.localtime
                },
                current: {
                    temp_c: data?.current?.temp_c,
                    condition: {
                        text: data?.current?.condition?.text,
                        code: data?.current?.condition?.code
                    },
                }
            }
            return weatherData
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