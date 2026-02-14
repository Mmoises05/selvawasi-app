
import api from './api';

export interface ChatResponse {
    message: string;
    relatedLinks?: { title: string; url: string }[];
}

export const aiService = {
    sendMessage: async (message: string): Promise<ChatResponse> => {
        const response = await api.post('/ai/chat', { message });
        return response.data;
    },
};
