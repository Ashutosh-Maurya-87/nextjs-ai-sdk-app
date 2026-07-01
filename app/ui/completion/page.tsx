"use client"
import { useState } from "react"
export default function CompletionPage() {
    const [prompt, setPrompt] = useState("")
    const [aiResponse, setAiResponse] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const completion = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setPrompt("")
        setError(null)
        try {
            const res = await fetch("/api/completion", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ prompt })
            })
            const data = await res.json()
            if (!res.ok) {
                throw new Error(data.error || "Something went wrong")
            }

            setAiResponse(data.response) // here in data.response the response is the key  which is the key of post api return response key if that eould any other then use that same other key

        } catch (error) {
            console.error("Error fetching ai response", error)
            setError(error instanceof Error ? error.message : "An unknown error occurred")
        } finally {
            setLoading(false)
        }

    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            {error &&
                <div className="p-4 bg-red-100 text-red-700 border border-red-400 rounded mb-4">
                    <p>{error}</p>
                </div>
            }
            {/* Main Content Area (this pushes the input to the bottom) */}
            {loading ? <p className="text-gray-500">Loading...</p> :
                aiResponse && <div className="p-4 bg-white border-b border-gray-200">
                    <p className="text-gray-800">{aiResponse}</p>
                </div>
            }
            {/* <main className="flex-grow flex items-center justify-center p-4">
                <p className="text-gray-500">Your chat conversation will appear here...</p>
            </main> */}

            {/* Input Area (Centered at the bottom) */}
            <footer className="w-full p-6 bg-white border-t border-gray-200">
                <div className="max-w-2xl mx-auto">
                    <form className="flex gap-3 w-full" onSubmit={completion}>
                        <input
                            type="text"
                            placeholder="Ask me anything..."
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            className="flex-1 px-4 py-3 text-black rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                        />
                        <button
                            type="submit"
                            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
                            disabled={loading}
                        >
                            Send
                        </button>
                    </form>
                </div>
            </footer>
        </div>

    )
}