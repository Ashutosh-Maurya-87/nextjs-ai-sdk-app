"use client";

import { useState, useRef, useEffect, type ChangeEvent, type FormEvent } from "react";
import { Plus, Mic, ChevronDown, Paperclip, HardDrive, Image, Layers, ArrowUp, SquareStop, Music } from "lucide-react";

export type ActionOption = "upload" | "drive" | "create-image" | "canvas" | "audio";
interface ChatInputProps {
    input: string;
    handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: FormEvent<HTMLFormElement>) => void;
    onActionSelect?: (action: ActionOption) => void;
    onStop?: () => void;
    onMicToggle?: () => void;
    selectedModel?: string;
    placeholderText?: string;
    isLoading: boolean;
    onFileSelect?: (file: FileList) => void;
    onAudioSelect?: (file: File) => void;
    fileInputRef?: React.RefObject<HTMLInputElement | null>;
    audioInputRef?: React.RefObject<HTMLInputElement | null>
}
interface AudioUploaderProps {
    onAudioSelect: (file: File) => void;
}
export default function ChatInput({
    input,
    handleInputChange,
    onSubmit,
    onActionSelect,
    onMicToggle,
    selectedModel = "Flash-Lite",
    isLoading,
    onStop,
    onFileSelect,
    onAudioSelect,
    fileInputRef,
    audioInputRef,
    placeholderText
}: ChatInputProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    // Close menu on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="w-full max-w-2xl mx-auto" ref={menuRef}>
            <form
                onSubmit={onSubmit}
                className="flex items-center gap-3 bg-[#1e1f20] hover:bg-[#282a2c] transition-colors rounded-full px-4 py-3 border border-transparent focus-within:border-gray-600"
            >
                <div>
                    <div>
                        <label className="mb-4" htmlFor='file-upload'>
                            <input
                                multiple
                                type="file"
                                id="file-upload"
                                className="hidden"
                                onChange={(e) => {
                                    if (e.target.files) {
                                        onFileSelect?.(e.target.files);
                                    }
                                }}
                                ref={fileInputRef}
                            />
                        </label>
                    </div>
                </div>

                <div>
                    <div>
                        <label className="mb-4" htmlFor='audio-upload'>
                            <input
                                type="file"
                                id="audio-upload"
                                className="hidden"
                                accept="audio/*" // Sirf audio file allow karega
                                ref={audioInputRef}
                                onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                        console.log("Audio selected:", e.target.files[0]);
                                        onAudioSelect?.(e.target.files[0])
                                        // Yahan handle karein audio file ko
                                    }
                                }}
                            />
                        </label>
                    </div>
                </div>
                {/* Plus Menu */}
                <div className="relative">
                    <button type="button" onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-400 hover:text-white transition-colors">
                        <Plus size={24} />
                    </button>
                    {isMenuOpen && (
                        <div className="absolute bottom-12 left-0 w-64 bg-[#282a2c] rounded-2xl p-2 shadow-xl border border-gray-700 z-50">
                            {[
                                { label: "Upload files", action: "upload", icon: <Paperclip size={20} /> },
                                { label: "Add from Drive", action: "drive", icon: <HardDrive size={20} /> },
                                { label: "Create image", action: "create-image", icon: <Image size={20} /> },
                                { label: "Canvas", action: "canvas", icon: <Layers size={20} /> },
                                { label: "Upload Audio", action: "audio", icon: <Music size={20} /> },
                            ].map((item) => (
                                <button key={item.action} type="button"
                                    onClick={() => {
                                        if (item.action === "upload") {
                                            document.getElementById("file-upload")?.click();
                                        } else if (item.action === "audio") {
                                            audioInputRef?.current?.click(); // Audio input trigger
                                        } else if (onActionSelect) {
                                            onActionSelect(item.action as ActionOption);
                                        }
                                        setIsMenuOpen(false);
                                    }}
                                    className="flex items-center gap-3 w-full p-3 text-gray-200 hover:bg-[#373a3c] rounded-lg transition-colors">
                                    {item.icon} <span className="text-sm">{item.label}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Input Field */}
                <input
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    placeholder={placeholderText ? placeholderText : "Ask anything..."}
                    className="flex-1 bg-transparent outline-none text-white placeholder-gray-400"
                    disabled={isLoading}
                />

                {/* Dynamic Send Button: Only shows when typing */}
                {
                    input.length > 0 && (
                        isLoading ?
                            <button

                                onClick={onStop}
                                // disabled={isLoading}
                                className="p-1.5 bg-gray-200 text-black rounded-full hover:bg-white transition-all disabled:opacity-50"
                            >
                                <SquareStop size={18} strokeWidth={3} />
                            </button> :
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="p-1.5 bg-gray-200 text-black rounded-full hover:bg-white transition-all disabled:opacity-50"
                            >
                                <ArrowUp size={18} strokeWidth={3} />
                            </button>

                    )
                }

                {/* Model Display & Mic Icon*/}
                <div className="flex items-center gap-2 pl-2 border-l border-gray-600">
                    <span className="text-xs text-gray-400 font-medium">{selectedModel}</span>
                    <ChevronDown size={16} className="text-gray-400 cursor-pointer" />
                    <button type="button" onClick={onMicToggle} className="text-gray-400 hover:text-white">
                        <Mic size={20} />
                    </button>
                </div>
            </form >
        </div >
    );
}