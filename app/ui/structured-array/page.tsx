"use client";

import { useState } from "react";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import ChatInput from "../common component/ChatInput";
import { pokemonUISchema } from "@/app/api/structured-array/schema";

export default function StructuredArray() {
    const [pokemonType, setPokemonType] = useState("");

    const { object, submit, isLoading, stop, error } = useObject({
        api: "/api/structured-array",
        schema: pokemonUISchema,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        submit({ type: pokemonType });
        setPokemonType("");
    };
    console.log('object', object)

    return (
        <main className="flex h-screen flex-col bg-[#131314] text-white overflow-hidden">
            <div className="flex-1 overflow-y-auto w-full max-w-2xl mx-auto px-4 py-8">
                {error && <div className="text-red-500 mb-4">{error.message}</div>}
                {isLoading && <div className="text-gray-400 mb-4">Generating...</div>}

                {object?.map((pokemon, i) => (
                    <div key={i} className="bg-white rounded-lg shadow-md p-4 mb-4">
                        <h2 className="text-xl font-bold text-blue-600">
                            Name: {pokemon?.name}
                        </h2>
                        <div className="flex gap-2 flex-wrap mt-3">
                            <span className="text-black">Abilities:</span>
                            {pokemon?.abilities?.map((ability, index) => (
                                <span
                                    key={index}
                                    className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                                >
                                    {ability}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <ChatInput
                input={pokemonType}
                handleInputChange={(e) => setPokemonType(e.target.value)}
                onSubmit={handleSubmit}
                isLoading={isLoading}
                onStop={stop}
                onMicToggle={() => { }}
                onActionSelect={() => { }}
            />
        </main>
    );
}