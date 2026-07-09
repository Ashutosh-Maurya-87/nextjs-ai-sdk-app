"use client"
import { useState } from "react";
import ChatInput from "../common component/ChatInput";


export default function StructuredEnum() {
    const [text, setText] = useState("")
    const [sentiment, setSentiment] = useState("")
    const [error, setError] = useState<String | null>(null)
    const [loading, setLoading] = useState(false)

    const analyzeSentiment = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setText('')
        try {
            const res = await fetch('/api/structured-enum', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text })
            })
            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || "Something went wrong")
            }
            setSentiment(data)
        } catch (error) {
            console.log('api calling error', error)
            setError(error instanceof Error ? error.message : 'Something went wrong')
            throw new Error()
        } finally {
            setLoading(false)
        }
    }
    return (
        <main className="flex h-screen flex-col bg-[#131314] text-white overflow-hidden">

            <div className="flex-1 overflow-y-auto w-full max-w-2xl mx-auto px-4 py-8">
                {/* API RESPONSES WILL BE HERE */}
                <div className="w-full max-w-sm mx-auto p-6 bg-white rounded-2xl shadow-xl border border-gray-100 transition-all duration-300">
                    {error && (
                        <div className="p-3 mb-4 text-sm text-red-600 bg-red-50 rounded-lg border border-red-200 animate-pulse">
                            {error}
                        </div>
                    )}

                    <div className="flex flex-col items-center justify-center min-h-[100px]">
                        {loading ? (
                            <div className="flex flex-col items-center gap-3 text-indigo-600">
                                {/* A simple spinner animation */}
                                <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                                <p className="font-medium text-sm animate-pulse">Analyzing sentiment...</p>
                            </div>
                        ) : sentiment ? (
                            <div className="text-center transform transition-all duration-500 scale-100">
                                <p className="text-sm text-gray-500 mb-2 uppercase tracking-wider font-semibold">Result</p>
                                <div className={`px-6 py-3 rounded-full text-lg font-bold shadow-sm ${sentiment === 'positive' ? 'bg-green-100 text-green-700' :
                                        sentiment === 'negative' ? 'bg-red-100 text-red-700' :
                                            'bg-gray-100 text-gray-700'
                                    }`}>
                                    {sentiment === 'positive' && "😊 Positive"}
                                    {sentiment === 'negative' && "😒 Negative"}
                                    {sentiment === 'neutral' && "😐 Neutral"}
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-400 text-sm">Enter text to see sentiment</p>
                        )}
                    </div>
                </div>

            </div>
            <div className="w-full pb-8 pt-4 bg-[#131314]">
                <ChatInput
                    handleInputChange={(e) => setText(e.target.value)}
                    onSubmit={analyzeSentiment}
                    input={text}
                    onStop={() => console.log('stop click')}
                    isLoading={loading}
                    onActionSelect={() => console.log("Mic toggled")}
                    onMicToggle={() => console.log("Mic toggled")}
                />
            </div>
        </main>
    )
}