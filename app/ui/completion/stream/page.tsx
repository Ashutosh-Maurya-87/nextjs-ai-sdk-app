"use client"
import { useState } from "react"
import { useCompletion } from '@ai-sdk/react'

export default function StreamPage() {
    const { input, handleInputChange, handleSubmit, completion, isLoading, error } = useCompletion({ api: "/api/completion/stream" })

    return (
        <div className="flex flex-col min-h-screen bg-gray-50" >

            {error &&
                <div className="p-4 bg-red-100 text-red-700 border border-red-400 rounded mb-4">
                    <p>{error.message}</p>
                </div>
            }
            {
                isLoading && <p className="text-black mb-2">Loading...</p>
            }

            {
                completion && <div className="text-black mb-4">{completion}</div>
            }
            {/* Input Area (Centered at the bottom) */}
            < footer className="w-full p-6 bg-white border-t border-gray-200" >
                <div className="max-w-2xl mx-auto" >
                    <form className="flex gap-3 w-full" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Ask me what you want..."
                            value={input}
                            onChange={handleInputChange}
                            className="flex-1 px-4 py-3 text-black rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                        />
                        <button
                            type="submit"
                            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
                            disabled={isLoading}
                        >
                            Send
                        </button>
                    </form>
                </div>
            </footer>
        </div>
    )
}