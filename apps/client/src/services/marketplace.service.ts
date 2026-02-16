import api from './api';
import { mockRestaurants, mockExperiences } from '@/lib/mock-data';

export const marketplaceService = {
    getRestaurants: async () => {
        try {
            const response = await api.get('/restaurants');
            return response.data;
        } catch (error) {
            console.warn('API Error (Restaurants), using mock data:', error);
            await new Promise(resolve => setTimeout(resolve, 600));
            return mockRestaurants;
        }
    },

    getRestaurantById: async (id: string) => {
        try {
            const response = await api.get(`/restaurants/${id}`);
            return response.data;
        } catch (error) {
            console.warn(`API Error (Restaurant ${id}), using mock data:`, error);
            await new Promise(resolve => setTimeout(resolve, 400));
            return mockRestaurants.find(r => r.id === Number(id)) || null;
        }
    },

    getExperiences: async () => {
        try {
            const response = await api.get('/experiences');
            return response.data;
        } catch (error) {
            console.warn('API Error (Experiences), using mock data:', error);
            await new Promise(resolve => setTimeout(resolve, 600));
            return mockExperiences;
        }
    },

    getExperienceById: async (id: string) => {
        try {
            const response = await api.get(`/experiences/${id}`);
            return response.data;
        } catch (error) {
            console.warn(`API Error (Experience ${id}), using mock data:`, error);
            await new Promise(resolve => setTimeout(resolve, 400));
            return mockExperiences.find(e => e.id === Number(id)) || null;
        }
    },

    // --- RESERVATIONS (REQUEST MODEL) ---
    createReservation: async (data: any) => {
        try {
            const response = await api.post('/reservations', data);
            return response.data;
        } catch (error) {
            console.error('API Error (Create Reservation):', error);
            throw error;
        }
    },

    getReservations: async () => {
        try {
            const response = await api.get('/reservations');
            return response.data;
        } catch (error) {
            console.warn('API Error (Get Reservations), using mock data:', error);
            return []; // Fallback empty for now
        }
    },
    updateReservationStatus: async (id: string, status: 'CONFIRMED' | 'REJECTED') => {
        try {
            const response = await api.patch(`/reservations/${id}/status`, { status });
            return response.data;
        } catch (error) {
            console.error('API Error (Update Reservation):', error);
            throw error;
        }
    },

    // --- USER SPECIFIC ---
    getMyBookings: async () => {
        try {
            const response = await api.get('/bookings/my-bookings');
            return response.data;
        } catch (error) {
            console.error('API Error (Get My Bookings):', error);
            return [];
        }
    },

    getMyReservations: async () => {
        try {
            const response = await api.get('/reservations/my-reservations');
            return response.data;
        } catch (error) {
            console.error('API Error (Get My Reservations):', error);
            return [];
        }
    },
};
