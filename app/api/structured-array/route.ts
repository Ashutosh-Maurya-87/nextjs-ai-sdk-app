// app/api/structured-array/route.ts
import { openai } from "@ai-sdk/openai";
import { streamObject } from "ai";
import { pokemonSchema, pokemonUISchema } from "./schema"; // z.array(pokemonSchema)

export async function POST(req: Request) {
    try {
        const { type } = await req.json();

        const result = streamObject({
            model: openai("gpt-4.1-nano"),
            output: "array",
            schema: pokemonSchema,
            prompt: `Generate a list of 5 ${type} type Pokémon.`,
        });

        return result.toTextStreamResponse();
    } catch (error) {
        console.log("error are--", error)
        throw new Response("Error while generating the repsonse", { status: 500 })
    }
}