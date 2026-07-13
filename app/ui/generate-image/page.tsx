"use client"

import { useState } from "react";
import ChatInput from "../common component/ChatInput";
import Image from "next/image";

export default function ImageGenerationPage() {
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [imageSrc, setImageSrc] = useState<string | null>(null)
    const [error, setError] = useState<String | null>(null)
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value)
    };
    const submitFun = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setImageSrc(null)
        setInput("")
        setError(null)

        try {
            const res = await fetch("/api/generate-image", {
                method: "POST",
                headers: {
                    "Content-Type": 'application/json'
                },
                body: JSON.stringify({ prompt: input })
            })
            console.log('res0', res)
            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || "Something went wrong");
            }
            console.log('data o img--', data)
            setImageSrc(`data:image/png;base64,${data?.image}`)

        } catch (err) {
            console.log('errors----', err)
            setError(err instanceof Error ? err?.message : "Something Went wrong")
            // throw new Error("Something Went Wrong")
        } finally {
            setIsLoading(false)
        }
    }
    console.log('image src', imageSrc)
    return (
        <main className="flex h-screen flex-col bg-[#131314] text-white">
            <div className="flex-1 overflow-y-auto w-full max-w-2xl mx-auto px-4 py-8">
                {error && <div className="text-red-500 mb-4">{error}</div>}
                {isLoading ? <div className="text-gray-400 mb-4 animate-pulse bg-gray-300 rounded-lg">Generating...</div>
                    :
                    imageSrc && (
                        <Image
                            alt="Generate image"
                            className="w-full h-full object-cover rounded-lg shadow-lg"
                            src={imageSrc}
                            width={1024}
                            height={1024}
                        />
                    )
                }


            </div>
            <div className="w-full pb-8 pt-4 bg-[#131314]">

                <ChatInput
                    input={input}
                    handleInputChange={handleInputChange}
                    onSubmit={submitFun}
                    onActionSelect={(action) => console.log('action clicked', action)}
                    onFileSelect={(file) => console.log(file)}
                    // onStop={stop}
                    onMicToggle={() => console.log("Mic toggled")}
                    isLoading={isLoading}
                />
            </div>
        </main>

    )
}