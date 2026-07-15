"use client"

import { useEffect, useRef, useState } from "react";
import ChatInput from "../common component/ChatInput";

export default function SpeechGeneration() {
    const [text, setText] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [hasAudio, setHasAudio] = useState(false)

    const audioUrlRef = useRef<string | null>(null)
    const audioRef = useRef<HTMLAudioElement | null>(null)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setText(e.target.value)
    };
    const submitFun = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setText("")
        setError(null)

        if (audioUrlRef.current) {
            URL.revokeObjectURL(audioUrlRef.current)
            audioUrlRef.current = null
        }

        // if audio is currently being played and if enter the new promt then it pause the audio and it set audio to null and that src to empty string
        if (audioRef.current) {
            audioRef.current.pause()
            audioRef.current.src = ""
            audioRef.current = null
        }

        try {
            const res = await fetch("/api/generate-speech", {
                method: "POST",
                headers: {
                    "Content-Type": 'application/json'
                },
                body: JSON.stringify({ text })
            })

            if (!res.ok) {
                throw new Error("Failed to generate Audio");
            }

            const blob = await res.blob()
            audioUrlRef.current = URL.createObjectURL(blob)
            audioRef.current = new Audio(audioUrlRef.current)
            setHasAudio(true)
            audioRef.current.play()

            // audio.current.addEventListener("ended", () => {
            //     URL.revokeObjectURL(audioUrl)
            // })
        } catch (err) {
            console.log('errors----', err)
            setHasAudio(false)

            setError(err instanceof Error ? err?.message : "Something Went wrong")
            // throw new Error("Something Went Wrong")
        } finally {
            setIsLoading(false)
        }
    }

    const replayFunction = () => {
        if (audioRef.current) {
            audioRef.current.currentTime = 0
            audioRef.current.play()
        }
    }

    useEffect(() => {
        // clearing the memory of the url after component unmount
        return () => {
            if (audioUrlRef.current) {
                URL.revokeObjectURL(audioUrlRef.current)
            }
            if (audioRef.current) {
                audioRef.current.pause()
                audioRef.current.src = ""
            }
        }

    }, [])
    return (
        <main className="flex h-screen flex-col bg-[#131314] text-white">
            {/* Chat/Content Area */}
            <div className="flex-1 overflow-y-auto w-full max-w-2xl mx-auto px-4 py-8">
                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-4 text-sm">
                        {error}
                    </div>
                )}

                {isLoading && (
                    <div className="flex items-center space-x-3 text-gray-400 mb-4 bg-white/5 px-4 py-3 rounded-2xl w-fit">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                        <span className="text-sm font-medium">Generating speech...</span>
                    </div>
                )}

                {hasAudio && !isLoading && (
                    <button
                        onClick={replayFunction}
                        className="group flex items-center gap-3 bg-blue-600 hover:bg-blue-500 transition-all px-5 py-3 rounded-2xl shadow-lg shadow-blue-900/20 font-medium"
                    >
                        <span className="text-lg">🔊</span>
                        <span>Replay Audio</span>
                    </button>
                )}
            </div>

            {/* Footer / Input Area */}
            <div className="w-full bg-[#131314] border-t border-white/10">
                <div className="max-w-2xl mx-auto py-6 px-4">
                    <ChatInput
                        input={text}
                        handleInputChange={handleInputChange}
                        onSubmit={submitFun}
                        onActionSelect={(action) => console.log('action clicked', action)}
                        onFileSelect={(file) => console.log(file)}
                        onMicToggle={() => console.log("Mic toggled")}
                        isLoading={isLoading}
                        placeholderText="Write text to generate speech..."
                    // Styling hint: Ensure ChatInput uses ring-0 and transparent backgrounds 
                    // to blend with the new border-t border-white/10 container
                    />
                    <p className="text-center text-[10px] text-gray-600 mt-4 uppercase tracking-widest">
                        AI Voice Engine v1.0
                    </p>
                </div>
            </div>
        </main>

    )
}