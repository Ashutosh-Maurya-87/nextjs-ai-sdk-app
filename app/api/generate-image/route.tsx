import { generateImage } from 'ai';
import {
    openai,
    type OpenAIImageModelGenerationOptions,
} from '@ai-sdk/openai';

export async function POST(req: Request) {
    try {
        const { prompt } = await req.json()
        const { image } = await generateImage({
            model: openai.image('gpt-image-1'),
            prompt,
            size: '1024x1024',
            // providerOptions: {
            //     openai: {
            //         // style: 'vivid',
            //         quality: 'hd',
            //     } satisfies OpenAIImageModelGenerationOptions,
            // },
        });
        console.log('image res', image)
        // return Response.json(image.base64)
        return Response.json({
            image: image.base64,
        });
    } catch (error) {
        console.log('error while generation of image', error)
        return Response.json(
            { error: "Failed to generate image" },
            { status: 500 }
        );
    }
}