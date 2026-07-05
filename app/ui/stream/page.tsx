"use client";

import { useState } from "react";
import { useCompletion } from "@ai-sdk/react";
import ChatInput, { type ActionOption } from "../common component/ChatInput";

export default function StreamPage() {
    const { input, handleInputChange, handleSubmit, completion, isLoading, setInput, stop } =
        useCompletion({ api: "/api/completion/stream" });

    const handleAction = (action: ActionOption) => {
        console.log("Action chosen:", action);
    };

    const submitFun = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        handleSubmit(e);
        setInput("")
    };
    const onStopFun = () => {
        stop();
        setInput(input)
    }

    return (
        // h-screen + flex-col ensures the container takes full height
        <main className="flex h-screen flex-col bg-[#131314] text-white overflow-hidden">

            {/*  Response Area- flex-1 + overflow-y-auto makes it scroll internally */}
            <div className="flex-1 overflow-y-auto w-full max-w-2xl mx-auto px-4 py-8">
                <div className="flex flex-col justify-center min-h-full">
                    {!completion && !isLoading && (
                        <h1 className="text-3xl font-semibold text-gray-300 text-center">
                            What's next, Ashutosh?
                        </h1>
                    )}

                    {(completion || isLoading) && (
                        <div className="w-full text-left">
                            <p className="text-lg leading-relaxed text-gray-100 whitespace-pre-wrap">
                                {completion}
                            </p>
                            {isLoading && (
                                <span className="inline-block mt-2 animate-pulse text-blue-400">●</span>
                            )}
                        </div>
                    )}
                </div>
            </div>


            <div className="w-full pb-8 pt-4 bg-[#131314]">
                <ChatInput
                    input={input}
                    handleInputChange={handleInputChange}
                    onSubmit={submitFun}
                    onActionSelect={handleAction}
                    onStop={onStopFun}
                    onMicToggle={() => console.log("Mic toggled")}
                    isLoading={isLoading}
                />
            </div>
        </main>
    );
}