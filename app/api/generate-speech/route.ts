import { openai } from "@ai-sdk/openai"
import { experimental_generateSpeech as generateSpeech } from "ai"

export async function POST(req: Request) {
    try {
        const { text } = await req.json()

        const { audio } = await generateSpeech({
            model: openai?.speech('tts-1'),
            text
        })
        return new Response(audio.uint8Array as BodyInit, {
            headers: {
                "Content-Type": audio.mediaType || "audio/mpeg"
            }
        })
    } catch (error) {
        console.log('Error while generating speech', error)
        return new Response('Error while generating speech', { status: 500 })
    }
}