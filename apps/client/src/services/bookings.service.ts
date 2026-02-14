import api from './api';

export interface CreateBookingDto {
    userId: string;
    scheduleId?: string;
    experienceId?: string;
    totalPrice: number;
    status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
    seatNumber?: string;
    passengerName?: string;
    passengerDocType?: string;
    passengerDocNumber?: string;
}

export const bookingsService = {
    create: async ({ userId, scheduleId, experienceId, totalPrice, status = 'PENDING', seatNumber, passengerName, passengerDocType, passengerDocNumber }: CreateBookingDto) => {
        // Transform to Prisma BookingCreateInput format expected by backend
        const payload: any = {
            user: { connect: { id: userId } },
            status,
            totalPrice,
            seatNumber,
            passengerName,
            passengerDocType,
            passengerDocNumber
        };

        if (scheduleId) {
            payload.schedule = { connect: { id: scheduleId } };
        } else if (experienceId) {
            payload.experience = { connect: { id: experienceId } };
        } else {
            throw new Error("Must provide scheduleId or experienceId");
        }

        try {
            const response = await api.post('/bookings', payload);
            return response.data;
        } catch (error) {
            console.error("Booking creation failed", error);
            throw error;
        }
    },

    getAll: async () => {
        const response = await api.get('/bookings');
        return response.data;
    },

    getUserBookings: async (userId: string) => {
        // Assuming backend has filter or we filter client side for now if no specific endpoint
        // Ideally backend has /users/:id/bookings or /bookings?userId=...
        // For now, let's try getting all and filtering or just getting all
        const response = await api.get('/bookings');
        return response.data.filter((b: any) => b.userId === userId);
    }
};
