"use client"
import { useState } from "react";
import ChatInput from "../common component/ChatInput";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import type { ChatMessage } from "@/app/api/tools/route";

export default function ToolChatPage() {
    // 1. Hook setup - removed manual states where useChat provides them
    const { messages, sendMessage, status, error, stop } = useChat<ChatMessage>({
        transport: new DefaultChatTransport({
            api: '/api/tools',
        }),
    });
    const [input, setInput] = useState("");

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };

    const submitFun = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!input.trim()) return;

        sendMessage({ "text": input });
        setInput(""); // Clear input after sending
    };

    // Derived loading state
    const isLoading = status === 'submitted' || status === 'streaming';

    console.log("status--", status, 'm', messages, 'er', error)
    return (
        <main className="flex h-screen flex-col bg-[#0f0f10] text-gray-100 overflow-hidden">
            {error && (
                <div className="bg-red-500/10 border-b border-red-500/20 text-red-400 px-4 py-3 text-sm font-medium">
                    {error.message}
                </div>
            )}

            <div className="flex-1 overflow-y-auto w-full max-w-2xl mx-auto px-4 py-8">
                <div className="flex flex-col gap-6">
                    {messages.map((msg, i) => (
                        <div key={msg.id || i} className={`flex flex-col gap-1 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                            <div className={`font-bold text-xs uppercase tracking-wider ${msg.role === 'user' ? 'text-blue-500' : 'text-emerald-500'}`}>
                                {msg.role === 'user' ? "You :" : "AI :"}
                            </div>

                            <div className="w-full max-w-[85%]">
                                {msg.parts.map((part, index) => {
                                    return (() => {
                                        switch (part.type) {
                                            case "text":
                                                return (
                                                    <div key={`part-${index}`} className={`p-4 rounded-2xl shadow-sm ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-[#1c1c1e] text-gray-200 rounded-bl-none border border-gray-800'}`}>
                                                        {part.text}
                                                    </div>
                                                );
                                            case "tool-getWeatherTool":
                                                return (
                                                    <div key={`${msg?.id}-getWeather-tool-${index}`} className="bg-[#18181b] border border-gray-700 p-4 rounded-xl mt-2">
                                                        {(() => {
                                                            switch (part.state) {
                                                                case "input-streaming":
                                                                    return (
                                                                        <div key={`${msg?.id}-getWeather-tool`}>
                                                                            <div className="text-sm text-blue-400 mb-2">Receiving weather data...</div>
                                                                            <pre className="text-xs bg-black/30 p-2 rounded text-gray-400 overflow-x-auto">{JSON.stringify(part.input, null, 2)}</pre>
                                                                        </div>
                                                                    );
                                                                case "input-available":
                                                                    return (
                                                                        <div key={`${msg?.id}-getWeather-tool-${index}`}>
                                                                            <div className="text-sm text-gray-400">Getting weather data for {part.input.location}...</div>
                                                                        </div>
                                                                    );
                                                                case "output-available":
                                                                    return (
                                                                        <div key={`${msg?.id}-getWeather-${index}`}>
                                                                            <div className="text-sm font-bold text-emerald-400 mb-1">Weather:</div>
                                                                            <div className="text-gray-200">{part.output}</div>
                                                                        </div>
                                                                    );
                                                                case "output-error":
                                                                    return (
                                                                        <div key={`${msg?.id}-getWeather-${index}-tool`} className="text-red-400 text-sm">
                                                                            <span className="font-bold">Error:</span> <div>{part.errorText}</div>
                                                                        </div>
                                                                    );
                                                                default:
                                                                    return null;
                                                            }
                                                        })()}
                                                    </div>
                                                );
                                            default:
                                                return null;
                                        }
                                    })();
                                })}
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="mb-4 pl-2">
                            <div className="flex items-center gap-2 text-sm text-gray-500 animate-pulse">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                                <span>{status === 'submitted' ? "Preparing response..." : "AI is typing..."}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="w-full pb-8 pt-4 bg-[#131314] border-t border-gray-800">
                <div className="max-w-2xl mx-auto px-4">
                    <ChatInput
                        input={input}
                        handleInputChange={handleInputChange}
                        onSubmit={submitFun}
                        onActionSelect={() => console.log('action clicked')}
                        onStop={stop}
                        onMicToggle={() => console.log("Mic toggled")}
                        isLoading={isLoading || status !== "ready"}
                    />
                </div>
            </div>
        </main>
    );
}