import { openai } from "@ai-sdk/openai"
import { generateObject } from "ai"


export async function POST(req: Response) {
    try {
        const { text } = await req.json()
        const result = await generateObject({
            model: openai('gpt-4.1-mini'), // gpt-4.1-mini supports enum better than gpt-4.1-nano
            output: 'enum',
            enum: ["positive", "negative", "neutral"],
            prompt: `Classify the sentiments in this text: ${text}`
        })
        return result.toJsonResponse()
    } catch (error) {
        console.log('error of ai:', error)
        throw new Response("Failed to generate sentiments", { status: 500 })
    }
}