import { openai } from "@ai-sdk/openai";
import {
    UIMessage, streamText, convertToModelMessages,
    generateImage, tool, stepCountIs, InferUITools,
    UIDataTypes
} from "ai";
import { z } from "zod";
import ImageKit from "imagekit";

const uploadImage = async (image: string) => {
    const imageKit = new ImageKit({
        urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT as string,
        publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY as string,
        privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string
    })
    console.log('image---', image)
    const response = await imageKit.upload({
        file: image,
        fileName: "generated_image.jpg"
    })
    console.log('after gene', response)
    return response.url
}
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
            const imageUrl = await uploadImage(image.base64)
            console.log('imageutl', imageUrl)
            return imageUrl
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
    }),
    changeBackground: tool({
        description: 'Replace image background with AI-generated scenes based on the text prompt',
        inputSchema: z.object({
            backgroundPrompt: z.string().describe(`Description of the new background (e.g, "modern office", "tropical beach sunset", "mountain landscape")`),
            imageUrl: z.string().describe('URL of the uploaded image'),

        }),
        outputSchema: z.string().describe('The transform image url')
    }),
    removeBackground: tool({
        description: 'Remove the background of an image',
        inputSchema: z.object({
            imageUrl: z.string().describe('URL of the uploaded image'),

        }),
        outputSchema: z.string().describe('The transform image url')
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