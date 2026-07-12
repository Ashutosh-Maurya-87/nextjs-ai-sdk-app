"use client"
import { useState } from "react";
import ChatInput from "../common component/ChatInput";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";

export default function Chat() {
    // 1. Hook setup - removed manual states where useChat provides them
    const { messages, sendMessage, status, error, stop } = useChat({
        transport: new DefaultChatTransport({
            api: '/api/chat',
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
        <main className="flex h-screen flex-col bg-[#131314] text-white overflow-hidden">
            {error && <div className="text-red-500 mb-4 px-4">{error.message}</div>}

            <div className="flex-1 overflow-y-auto w-full max-w-2xl mx-auto px-4 py-8">
                <div className="flex flex-col gap-4 p-4">
                    {messages.map((msg, i) => (
                        <div key={msg.id || i} className="flex flex-col gap-1">
                            <div className={`font-bold text-sm ${msg.role === 'user' ? 'text-blue-600' : 'text-green-600'}`}>
                                {msg.role === 'user' ? "You :" : "AI :"}
                            </div>
                            <div className="pl-2">
                                {msg.parts.map((part, index) => {
                                    // Kept your IIFE switch structure
                                    return (() => {
                                        switch (part.type) {
                                            case "text":
                                                return (
                                                    <div key={`part-${index}`} className="bg-gray-100 p-3 rounded-lg text-gray-800 shadow-sm">
                                                        {part.text}
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

                    {/* Status Indicator */}
                    {isLoading && (
                        <div className="mb-4 pl-2">
                            <div className="flex items-center gap-2 text-sm text-gray-500 animate-pulse">
                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                <span>{status === 'submitted' ? "Preparing response..." : "AI is typing..."}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="w-full pb-8 pt-4 bg-[#131314]">
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
        </main>
    );
}