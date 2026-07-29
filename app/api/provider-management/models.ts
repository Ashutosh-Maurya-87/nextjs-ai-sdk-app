import { createProviderRegistry, customProvider, defaultSettingsMiddleware, wrapLanguageModel } from "ai";
import { openai as originalOpenAI } from "@ai-sdk/openai"
import { anthropic } from "@ai-sdk/anthropic";

// openai:fast
export const customOpenAi = customProvider({
    languageModels: {
        fast: originalOpenAI("gpt-5-nano"),
        slow: originalOpenAI("gpt-5-mini"),
        reasoning: wrapLanguageModel({
            model: originalOpenAI("gpt-5-nano"),
            middleware: defaultSettingsMiddleware({
                settings: {
                    providerOptions: {
                        openai: {
                            reasoningEffort: "high"
                        }
                    }
                }
            })
        })
    },
    fallbackProvider: originalOpenAI
})

// anthropic:smart
const customAnthropic = customProvider({
    languageModels: {
        fast: anthropic("claude-3-5-haiku-20241022"),
        smart: anthropic("clause-sonnet-4-20250514")
    }
})

export const registry = createProviderRegistry({
    openai: customOpenAi,
    anthropic: customAnthropic
})