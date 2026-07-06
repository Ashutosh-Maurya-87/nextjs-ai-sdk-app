import { openai } from "@ai-sdk/openai"
import { Output, streamText } from "ai"
import { recipeSchema } from "./schema"

export async function POST(req: Request) {
    const { dish } = await req.json()
    console.log('dishes in api', dish)
    const result = streamText({
        model: openai('gpt-4.1-nano'),
        output: Output.object({
            schema: recipeSchema,
            name: "Recipe_Schema",
            description: "You are an expert in dishes to give the guidence about the recipe."
        }),
        prompt: `Generate the recipe for ${dish}.
            Return ONLY data matching the provided schema
            `
    })
    try {
        // const obj = await result.ou
        console.log('stream text result', result)
        return result.toTextStreamResponse()
    } catch (error) {
        console.log('error in response', error)
        throw new Response("Failed to generate the ai resposne", { status: 500 })
    }
}