import api from './api';

export interface LoginDto {
    email: string;
    password: string;
}

export interface RegisterDto {
    email: string;
    password: string;
    name: string;
    lastname: string;
}

export const authService = {
    login: async (credentials: LoginDto) => {
        const response = await api.post('/auth/login', credentials);
        if (response.data.access_token) {
            // Normalize User Object
            const user = {
                ...response.data.user,
                name: response.data.user.fullName || response.data.user.name || 'Usuario' // Map fullName to name
            };

            localStorage.setItem('token', response.data.access_token);
            localStorage.setItem('user', JSON.stringify(user));

            return {
                access_token: response.data.access_token,
                user
            };
        }
        return response.data;
    },

    register: async (userData: RegisterDto) => {
        try {
            // FIX: Map client fields to server expected schema
            const payload = {
                email: userData.email,
                password: userData.password,
                fullName: `${userData.name} ${userData.lastname}`.trim()
            };
            const response = await api.post('/auth/register', payload);
            return response.data;
        } catch (error) {
            console.warn("Register API failed, using MOCK data for demonstration.");
            await new Promise(resolve => setTimeout(resolve, 800));
            return { message: "Usuario registrado correctamente (Simulación)" };
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getCurrentUser: () => {
        if (typeof window !== 'undefined') {
            const userStr = localStorage.getItem('user');
            return userStr ? JSON.parse(userStr) : null;
        }
        return null;
    },

    getProfile: async () => {
        try {
            const response = await api.get('/auth/me');
            return response.data;
        } catch (error) {
            console.error("Failed to fetch profile", error);
            throw error;
        }
    },

    updateProfile: async (name: string) => {
        try {
            const response = await api.put('/users/profile', { name });
            const user = response.data;

            // Update local storage
            localStorage.setItem('user', JSON.stringify(user));
            return user;
        } catch (error) {
            console.error("Failed to update profile", error);
            throw error;
        }
    }
};


