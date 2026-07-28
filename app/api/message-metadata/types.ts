import { UIMessage } from "ai";
import { z } from "zod"
export const messageMetadatSchema = z.object({
    createdAt: z.number().optional(),
    totalTokens: z.number().optional(),
})

export type MessageMetadata = z.infer<typeof messageMetadatSchema>;

export type MyUIMessage = UIMessage<MessageMetadata>
