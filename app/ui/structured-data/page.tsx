"use client"
import { useState } from "react";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import ChatInput from "../common component/ChatInput";
import { recipeSchema } from "@/app/api/structured-output/schema";

export default function StructureDataPage() {
    const [dishName, setDishName] = useState('')

    const { submit, object, isLoading, error, stop } = useObject({
        api: '/api/structured-output',
        schema: recipeSchema
    })
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        submit({ dish: dishName })
        setDishName("")
    }

    const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDishName(e.target.value)
    }

    console.log('response-----', object, isLoading, "error", error)
    return (
        <main className="flex h-screen flex-col bg-[#131314] text-white overflow-hidden">
            {/* <div className="flex-1 overflow-y-auto w-full max-w-2xl mx-auto px-4 py-8">
                <div className="flex flex-col justify-center min-h-full">
                    {!isLoading && (
                        <h1 className="text-3xl font-semibold text-gray-300 text-center">
                            What's next, Ashutosh?
                        </h1>
                    )}
                </div>
            </div> */}
            <div className="flex-1 overflow-y-auto w-full max-w-2xl mx-auto px-4 py-8">
                {/* API RESPONSES WILL BE HERE */}


                {
                    error && <div className="text-red-500 mb-4">
                        {error.message}
                    </div>
                }
                {
                    object?.recipe &&
                    <div className="space-y-6 px-6 py-8 bg-[#18181b] rounded-xl border border-gray-800 shadow-lg">
                        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">
                            {object?.recipe?.name || "Loading recipe..."}
                        </h2>

                        {object?.recipe?.ingredients && (
                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold text-gray-200 border-b border-gray-700 pb-2">
                                    Ingredients
                                </h3>

                                <div className="grid gap-3">
                                    {object.recipe.ingredients.map((item, i) => (
                                        <div
                                            key={i}
                                            className="flex justify-between items-center p-3 bg-[#131314] rounded-lg hover:bg-gray-800/50 transition-colors border border-gray-800/50"
                                        >
                                            <span className="text-gray-300 font-medium">{item?.name}</span>
                                            <span className="px-3 py-1 bg-blue-900/30 text-blue-300 text-sm font-bold rounded-full border border-blue-800/50">
                                                {item?.amount}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {object?.recipe?.steps && (
                            <div className="space-y-4 pt-6">
                                <h3 className="text-xl font-semibold text-gray-200 border-b border-gray-700 pb-2">
                                    Steps
                                </h3>

                                <ol className="space-y-4">
                                    {object.recipe.steps.map((step, i) => (
                                        <li key={i} className="flex gap-4 items-start">
                                            {/* Number Circle */}
                                            <div className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-emerald-900/30 text-emerald-300 text-sm font-bold border border-emerald-800/50">
                                                {i + 1}
                                            </div>

                                            {/* Step Text */}
                                            <p className="text-gray-300 leading-relaxed pt-1">
                                                {step}
                                            </p>
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        )}
                    </div>

                }
            </div>
            <div className="w-full pb-8 pt-4 bg-[#131314]">
                <ChatInput
                    handleInputChange={onChangeInput}
                    onSubmit={handleSubmit}
                    input={dishName}
                    onStop={stop}
                    isLoading={isLoading}
                    onActionSelect={() => console.log("Mic toggled")}
                    onMicToggle={() => console.log("Mic toggled")}
                />
            </div>
        </main>
    )
}
