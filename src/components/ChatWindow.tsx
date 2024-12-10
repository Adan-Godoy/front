import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { sendChatMessage } from '@/app/api/route';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

const ChatWindow = () => {
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'assistant',
            content: '¡Hola! Soy Nina, tu asistente virtual. ¿En qué puedo ayudarte hoy?'
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);

        try {
            const response = await sendChatMessage(userMessage);

            setMessages(prev => [...prev, {
                role: 'assistant',
                content: response.data.response
            }]);
        } catch (error) {
            console.error('Error:', error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'Lo siento, ha ocurrido un error. Por favor, intenta de nuevo más tarde.'
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            const form = e.currentTarget.form;
            if (form) form.requestSubmit();
        }
    };

    return (
        <div className="flex flex-col h-[600px] max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <div className="p-4 border-b dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                    Chat con Nina
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Asistente virtual powered by Hugging Face
                </p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`flex ${
                            message.role === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                    >
                        <div
                            className={`max-w-[80%] rounded-lg p-3 ${
                                message.role === 'user'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100'
                            }`}
                        >
                            {message.content}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 max-w-[80%]">
                            <div className="flex space-x-2">
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100"></div>
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="p-4 border-t dark:border-gray-700">
                <div className="flex space-x-2">
                    <Input
                        value={input}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Escribe tu mensaje..."
                        className="flex-1"
                        disabled={isLoading}
                    />
                    <Button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        <Send className="h-5 w-5" />
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default ChatWindow;