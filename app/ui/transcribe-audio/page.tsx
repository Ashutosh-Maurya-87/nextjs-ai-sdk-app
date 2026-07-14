"use client";

import React, { useState, useRef } from "react";
import ChatInput from "../common component/ChatInput"; // Tumhari file ka path

interface TranscriptResult {
    text: string,
    segments?: Array<{ start: number; end: number; text: string }>,
    language?: string,
    durationInSecond: number
}
export default function TranscribeAudio() {
    const [input, setInput] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    // const fileInputRef = useRef<HTMLInputElement>(null);
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const audioInputRef = useRef<HTMLInputElement>(null);
    const [transcript, setTranscript] = useState<TranscriptResult | null>(null)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log('====', e.target.value, e?.target.files?.[0])
        setInput(e.target.value);
        const file = e?.target.files?.[0]
        if (file) {
            setAudioFile(file)
            setTranscript(null)
            setError("")
        }

    };

    const handleAudioSelect = (file: File) => {
        setAudioFile(file);
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input && !audioFile) {
            setError("Please Select an audio file");
            return;
        }

        setIsLoading(true);
        setError('')
        let transcript = "";
        if (audioFile) {
            try {
                const formData = new FormData();
                formData.append("audio", audioFile);

                const res = await fetch("/api/transcribed-audio", {
                    method: "POST",
                    body: formData,
                });
                if (!res.ok) {
                    throw new Error("Failed to transcribe audio")
                }
                const data = await res.json();
                transcript = data.text;
                setTranscript(data)
                setAudioFile(null);
                if (audioInputRef.current) {
                    audioInputRef.current.value = ""
                }
            } catch (err) {
                console.log('error', error)
                setError(err instanceof Error ?
                    err?.message : "Something went wrong! Please try again later"
                )
            } finally {
                setIsLoading(false)
            }
        }
        setIsLoading(false);
        setInput("");
    };

    const handleFileSelect = (files: FileList) => {
        console.log("Files selected:", files);
        // Yahan files ko backend/state mein process karo
    };

    return (
        <main className="flex h-screen flex-col bg-[#131314] text-white">
            {/* Chat History / Content Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Error Handling */}
                {error && (
                    <div className="p-3 text-sm text-red-400 bg-red-950/30 rounded-lg border border-red-800 animate-pulse">
                        {error}
                    </div>
                )}

                {/* Loading State */}
                {isLoading && (
                    <div className="text-gray-400 text-sm flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Transcribing Audio...
                    </div>
                )}

                {/* Transcript Display */}
                {transcript && !isLoading && (
                    <div className="bg-[#1e1f20] p-4 rounded-xl border border-gray-800">
                        <h3 className="text-xs uppercase text-gray-500 font-bold mb-1">Transcript</h3>
                        <p className="text-gray-200">{transcript.text}</p>
                    </div>
                )}
            </div>

            {/* Input Area - Fixed at bottom */}
            <div className="p-4 bg-[#131314]">
                {/* Audio Preview Chip */}
                {audioFile && (
                    <div className="max-w-2xl mx-auto mb-3 flex justify-center">
                        <div className="bg-[#282a2c] px-4 py-2 rounded-full text-sm flex items-center gap-3 border border-gray-700 shadow-lg">
                            <span className="text-blue-400">🎵</span>
                            <span className="truncate max-w-50">{audioFile.name}</span>
                            <button onClick={() => setAudioFile(null)} className="hover:text-red-400 transition-colors">
                                ✕
                            </button>
                        </div>
                    </div>
                )}

                <ChatInput
                    input={input}
                    handleInputChange={handleInputChange}
                    onSubmit={onSubmit}
                    isLoading={isLoading}
                    onFileSelect={handleFileSelect}
                    // fileInputRef={fileInputRef}
                    audioInputRef={audioInputRef}
                    onAudioSelect={handleAudioSelect}
                    onMicToggle={() => console.log("Mic toggled")}
                />

                {/* Footer spacing */}
                <div className="h-4"></div>
            </div>
        </main>
        // <main className="flex h-screen flex-col bg-[#131314] text-white overflow-hidden">
        //     <div className="flex flex-col h-screen justify-end p-4">
        //         {error && (
        //             <div className="p-3 mb-4 text-sm text-red-600 bg-red-50 rounded-lg border border-red-200 animate-pulse">
        //                 {error}
        //             </div>
        //         )}
        //         {
        //             isLoading && <div>Transcribing Audio..</div>
        //         }
        //         {audioFile && (
        //             <div className="bg-[#282a2c] text-white px-4 py-2 rounded-lg mb-2 w-fit flex items-center gap-2">
        //                 <span>🎵 {audioFile.name}</span>
        //                 <button onClick={() => setAudioFile(null)} className="text-red-400">x</button>
        //             </div>
        //         )}
        //         {
        //             transcript && !isLoading && (
        //                 <div>
        //                     <h3>Transcript: </h3>
        //                     <p>{transcript?.text}</p>
        //                 </div>
        //             )
        //         }
        //         <ChatInput
        //             input={input}
        //             handleInputChange={handleInputChange}
        //             onSubmit={onSubmit}
        //             isLoading={isLoading}
        //             onFileSelect={handleFileSelect}
        //             // fileInputRef={fileInputRef}
        //             audioInputRef={audioInputRef}
        //             onAudioSelect={handleAudioSelect}
        //             onMicToggle={() => console.log("Mic toggled")}
        //         />
        //     </div>
        // </main>
    );
}