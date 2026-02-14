
import { useState } from 'react';
import { aiService, ChatResponse } from '@/services/ai.service';

interface Message {
    role: 'user' | 'assistant';
    content: string;
    links?: { title: string; url: string }[];
}

export function useChat() {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: '¡Hola! Soy SelvaAI. ¿En qué puedo ayudarte hoy?' }
    ]);
    const [loading, setLoading] = useState(false);

    const sendMessage = async (content: string) => {
        if (!content.trim()) return;

        const userMessage: Message = { role: 'user', content };
        setMessages((prev) => [...prev, userMessage]);
        setLoading(true);

        try {
            const response: ChatResponse = await aiService.sendMessage(content);
            const assistantMessage: Message = {
                role: 'assistant',
                content: response.message,
                links: response.relatedLinks,
            };
            setMessages((prev) => [...prev, assistantMessage]);
        } catch (error) {
            console.error('Error sending message:', error);
            setMessages((prev) => [
                ...prev,
                { role: 'assistant', content: 'Lo siento, tuve un problema al procesar tu mensaje. Intenta nuevamente.' },
            ]);
        } finally {
            setLoading(false);
        }
    };

    return { messages, loading, sendMessage };
}
