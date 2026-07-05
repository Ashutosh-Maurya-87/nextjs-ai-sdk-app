import { streamText } from 'ai'
import { openai } from "@ai-sdk/openai"
export async function POST(req: Request) {
    try {
        const { prompt } = await req.json()
        const result = streamText({
            // to use different models only update the model
            // for ex- to use anthropic model use model: anthropic("claude-v1") like that and import it from @ai-sdk/anthropic
            model: openai("gpt-4.1-nano"),
            prompt
        })
        return result.toUIMessageStreamResponse()
    } catch (error) {
        console.error("error of streaming text", error)
        return new Response("Failed to generate stream response", { status: 500 })
    }
}