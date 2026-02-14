import api from './api';
import { mockBoats, mockRoutes } from '@/lib/mock-data';

export const boatsService = {
    getAll: async () => {
        const response = await api.get('/boats');
        return response.data;
    },

    getRoutes: async () => {
        const response = await api.get('/routes');
        return response.data;
    },

    getById: async (id: string) => {
        const response = await api.get(`/boats/${id}`);
        return response.data;
    },

    create: async (data: Record<string, unknown>) => {
        const response = await api.post('/boats', data);
        return response.data;
    },

    getScheduleById: async (id: string) => {
        try {
            const response = await api.get(`/schedules/${id}`);
            return response.data;
        } catch (error) {
            console.warn(`API Error (Schedule ${id}), using mock data/null:`, error);
            // Fallback or rethrow? For now rethrow to let component handle or null
            return null;
        }
    }
};
