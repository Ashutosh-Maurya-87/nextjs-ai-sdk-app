import { openai } from "@ai-sdk/openai";
import {
    UIMessage, streamText, convertToModelMessages,
    generateImage, tool, stepCountIs, InferUITools,
    UIDataTypes
} from "ai";
import { z } from "zod";

const tools = {
    generateImage: tool({
        description: 'Generate an Image for a prompt',
        inputSchema: z.object({
            prompt: z.string().describe('Prompt which is given by user')
        }),
        execute: async function ({ prompt }) {
            const { image } = await generateImage({
                model: openai.imageModel("gpt-image-1"), // this model is generating the image instead of dalle-3 or dalle -2
                prompt,
                size: '1024x1024'
            })
            console.log('image base64', image.base64)
            return image.base64
        },
        toModelOutput: () => {
            return {
                type: "content",
                value: [{
                    type: 'text',
                    text: 'Generated image in base64'
                }]
            }
        }
    })
}

export type ChatTools = InferUITools<typeof tools>
export type ChatMessage = UIMessage<never, UIDataTypes, ChatTools>

export async function POST(req: Request) {
    const { messages }: { messages: ChatMessage[] } = await req.json()

    try {
        const res = streamText({
            model: openai("gpt-4.1-nano"),
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