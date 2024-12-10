"use client";

import ChatWindow from "@/components/ChatWindow";

export default function ChatPage() {
    return (
        <div className="container mx-auto p-8 min-h-screen">
            <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-gray-100">
                Asistente Virtual
            </h1>
            <ChatWindow />
        </div>
    );
}