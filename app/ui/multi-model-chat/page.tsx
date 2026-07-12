"use client"
import { useRef, useState } from "react";
import ChatInput from "../common component/ChatInput";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";

export default function MultiModelChat() {

    // 1. Hook setup - removed manual states where useChat provides them
    const { messages, sendMessage, status, error, stop } = useChat({
        transport: new DefaultChatTransport({
            api: '/api/multi-model-chat',
        }),
    });
    const [input, setInput] = useState("");
    const [selectedFile, setSelectedFile] = useState<FileList | undefined>(undefined);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };

    // const submitFun = (e: React.FormEvent<HTMLFormElement>) => {
    //     e.preventDefault();

    //     const formData = new FormData();
    //     if (selectedFile) formData.append("file", selectedFile);
    //     formData.append("message", input);

    //     if (!input.trim()) return;

    //     sendMessage({ "text": input });
    //     setInput(""); // Clear input after sending

    // };
    const submitFun = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!input.trim() && !selectedFile) return;

        // We pass the file and text via the 'data' property
        // Note: ensure you are using the latest ai-sdk version that supports this
        sendMessage({
            text: input,
            files: selectedFile
        });

        setInput("");
        setSelectedFile(undefined);
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    };

    // Derived loading state
    const isLoading = status === 'submitted' || status === 'streaming';

    console.log("status--", status, 'm', messages, 'er', error)


    const handleFileValidation = (fileList: FileList): FileList => {
        const MAX_SIZE = 5 * 1024 * 1024; // 5MB
        const ALLOWED_MIME_TYPES = [
            "image/jpeg",
            "image/png",
            "application/pdf",
            "text/plain",
        ];

        const dataTransfer = new DataTransfer();

        Array.from(fileList).forEach((file) => {
            const fileExtension = file.name.split(".").pop()?.toLowerCase();

            const isAllowed =
                ALLOWED_MIME_TYPES.includes(file.type) ||
                fileExtension === "csv";

            const isSizeValid = file.size <= MAX_SIZE;

            if (!isSizeValid) {
                console.error(`${file.name} is too big.`);
            }

            if (!isAllowed) {
                console.error(`${file.name} has an invalid type.`);
            }

            if (isAllowed && isSizeValid) {
                dataTransfer.items.add(file);
            }
        });

        return dataTransfer.files;
    };

    const onFileSelect = (fileList: FileList) => {
        const validatedFiles = handleFileValidation(fileList);

        if (validatedFiles.length > 0) {
            setSelectedFile(validatedFiles);
        } else {
            setSelectedFile(undefined); // or null depending on your state type
        }
    };

    const removeFile = (indexToRemove: number) => {
        if (!selectedFile) return;

        const dataTransfer = new DataTransfer();

        Array.from(selectedFile).forEach((file, index) => {
            if (index !== indexToRemove) {
                dataTransfer.items.add(file);
            }
        });

        setSelectedFile(
            dataTransfer.files.length ? dataTransfer.files : undefined
        );
    };
    console.log("selectedFIle", selectedFile, messages)
    return (
        <main className="flex h-screen flex-col bg-[#131314] text-white overflow-hidden">
            {error && <div className="text-red-500 mb-4 px-4">{error.message}</div>}

            <div className="flex-1 overflow-y-auto w-full max-w-2xl mx-auto px-4 py-8">
                <div className="flex flex-col gap-4 p-4">
                    {messages.map((msg, i) => {
                        console.log("mesg", msg)
                        return <div key={msg.id || i} className="flex flex-col gap-1">
                            <div className={`font-bold text-sm ${msg.role === 'user' ? 'text-blue-600' : 'text-green-600'}`}>
                                {msg.role === 'user' ? "You :" : "AI :"}
                            </div>
                            <div className="pl-2">
                                {msg.parts.map((part, index) => {
                                    return (() => {
                                        switch (part.type) {
                                            case "text":
                                                return (
                                                    <div key={`part-${index}`} className="bg-gray-100 p-3 rounded-lg text-gray-800 shadow-sm">
                                                        {part.text}
                                                    </div>
                                                );
                                            case "file":
                                                console.log("parturl", part?.url)

                                                if (part?.mediaType?.startsWith("image/")) {
                                                    return <img
                                                        key={`${msg?.id}-${index}`}
                                                        src={part.url} // This is the base64 or URL
                                                        alt={part?.filename ?? `attachment-${index}`}
                                                        className="max-w-50 rounded-lg"
                                                        width={500}
                                                        height={500}
                                                    />
                                                }
                                                return null
                                            default:
                                                return null;
                                        }
                                    })();
                                })}
                            </div>
                        </div>
                    })}

                    {/* Status Indicator */}
                    {isLoading && (
                        <div className="mb-4 pl-2">
                            <div className="flex items-center gap-2 text-sm text-gray-500 animate-pulse">
                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                <span>{status === 'submitted' ? "Preparing response..." : "AI is typing..."}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {/* Preview Area */}
            <div className="w-full max-w-2xl mx-auto pb-8 pt-4">
                {selectedFile?.length && Array.from(selectedFile).map((file, i) => (
                    <div
                        key={`${file.name}-${i}`}
                        className="flex items-center gap-2 mx-2 my-2 px-3 py-1.5 bg-[#2d2e30] 
                        border border-gray-600 rounded-full 
                        text-white text-xs shadow-sm transition-all hover:border-gray-400"
                    >
                        <span className="truncate max-w-30">{file.name}</span>
                        <button
                            onClick={() => removeFile(i)}
                            className="text-gray-400 hover:text-red-400 transition-colors"
                            aria-label="Remove file"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                ))}
            </div>
            <div className="w-full pb-8 pt-4 bg-[#131314]">
                <ChatInput
                    input={input}
                    handleInputChange={handleInputChange}
                    onSubmit={submitFun}
                    onActionSelect={(action) => console.log('action clicked', action)}
                    onFileSelect={(file) => onFileSelect(file)}
                    fileInputRef={fileInputRef}
                    onStop={stop}
                    onMicToggle={() => console.log("Mic toggled")}
                    isLoading={isLoading || status !== "ready"}
                />
            </div>
        </main>
    );
}