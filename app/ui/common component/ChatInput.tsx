"use client";

import { useState, useRef, useEffect, type ChangeEvent, type FormEvent } from "react";
import { Plus, Mic, ChevronDown, Paperclip, HardDrive, Image, Layers, ArrowUp } from "lucide-react";

export type ActionOption = "upload" | "drive" | "create-image" | "canvas";

interface ChatInputProps {
    input: string;
    handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: FormEvent<HTMLFormElement>) => void;
    onActionSelect: (action: ActionOption) => void;
    onMicToggle: () => void;
    selectedModel?: string;
    isLoading: boolean;
}

export default function ChatInput({
    input,
    handleInputChange,
    onSubmit,
    onActionSelect,
    onMicToggle,
    selectedModel = "Flash-Lite",
    isLoading
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
                            ].map((item) => (
                                <button key={item.action} type="button" onClick={() => { onActionSelect(item.action as ActionOption); setIsMenuOpen(false); }} className="flex items-center gap-3 w-full p-3 text-gray-200 hover:bg-[#373a3c] rounded-lg transition-colors">
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
                    placeholder="Ask anything..."
                    className="flex-1 bg-transparent outline-none text-white placeholder-gray-400"
                    disabled={isLoading}
                />

                {/* Dynamic Send Button: Only shows when typing */}
                {input.length > 0 && (
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="p-1.5 bg-gray-200 text-black rounded-full hover:bg-white transition-all disabled:opacity-50"
                    >
                        <ArrowUp size={18} strokeWidth={3} />
                    </button>
                )}

                {/* Model Display & Mic Icon*/}
                <div className="flex items-center gap-2 pl-2 border-l border-gray-600">
                    <span className="text-xs text-gray-400 font-medium">{selectedModel}</span>
                    <ChevronDown size={16} className="text-gray-400 cursor-pointer" />
                    <button type="button" onClick={onMicToggle} className="text-gray-400 hover:text-white">
                        <Mic size={20} />
                    </button>
                </div>
            </form>
        </div>
    );
}