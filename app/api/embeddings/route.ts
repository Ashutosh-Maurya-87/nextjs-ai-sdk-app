import { openai } from "@ai-sdk/openai";
import { embed, embedMany } from "ai";
export async function POST(req: Response) {
    const body = await req.json()
    if (Array.isArray(body.texts)) {
        const { values, embeddings, usage } = await embedMany({
            model: openai.embeddingModel('text-embedding-3-small'),
            values: body.texts,
            maxParallelCalls: 5 // this passes upto 5 embeddings at the same time- like multiple values at the same time
        })
        return Response.json({
            values, embeddings, usage,
            count: embeddings.length,
            dimensions: embeddings[0].length
        })
    }
    const { value, embedding, usage } = await embed({
        model: openai.embeddingModel('text-embedding-3-small'),
        value: body.text
        // value: "A movie about the time travelling"
    })
    return Response.json({
        value, embedding, usage,
        dimensions: embedding.length
    })
}