
import api from './api';

export const routesService = {
    getAll: async () => {
        const response = await api.get('/routes');
        return response.data;
    },

    getById: async (id: string) => {
        const response = await api.get(`/routes/${id}`);
        return response.data;
    },

    create: async (data: Record<string, unknown>) => {
        const response = await api.post('/routes', data);
        return response.data;
    },
};

export const schedulesService = {
    getAll: async () => {
        const response = await api.get('/schedules');
        return response.data;
    },

    // TODO: Add search method by route/date
};
