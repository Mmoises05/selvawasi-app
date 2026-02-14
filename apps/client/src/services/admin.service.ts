
import api from './api';

export interface User {
    id: string;
    fullName: string;
    email: string;
    role: string;
    createdAt: string;
}

export const adminService = {
    getUsers: async (): Promise<User[]> => {
        const response = await api.get('/users');
        return response.data;
    },

    updateUserRole: async (userId: string, role: string) => {
        const response = await api.put(`/users/${userId}/role`, { role });
        return response.data;
    },

    getStats: async () => {
        const response = await api.get('/admin/stats');
        return response.data;
    },

    getActivity: async () => {
        const response = await api.get('/admin/activity');
        return response.data;
    },

    getReservations: async () => {
        const response = await api.get('/reservations');
        return response.data;
    },

    getBookings: async () => {
        const response = await api.get('/bookings');
        return response.data;
    },

    updateReservationStatus: async (id: string, status: 'CONFIRMED' | 'REJECTED') => {
        const response = await api.patch(`/reservations/${id}/status`, { status });
        return response.data;
    }
};
