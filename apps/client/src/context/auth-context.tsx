"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { authService, LoginDto, RegisterDto } from "@/services/auth.service";

interface User {
    id: string;
    email: string;
    name?: string;
    role?: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (credentials: LoginDto) => Promise<void>;
    register: (data: RegisterDto) => Promise<void>;
    logout: () => void;
    isLoginModalOpen: boolean;
    openLoginModal: () => void;
    closeLoginModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

    useEffect(() => {
        const initAuth = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    try {
                        // FORCE FETCH FROM SERVER to ensure fresh data (fix "Viajero" issue)
                        const profile = await authService.getProfile();
                        if (profile) {
                            // Normalize name mapping just in case
                            const normalizedUser = {
                                ...profile,
                                name: profile.fullName || profile.name || 'Usuario'
                            };

                            setUser(normalizedUser);
                            localStorage.setItem('user', JSON.stringify(normalizedUser));
                        }
                    } catch (profileError) {
                        console.warn("Token valid but info fetch failed, trying local storage", profileError);
                        // Fallback to local storage if API fails (e.g. offline)
                        const storedUser = localStorage.getItem('user');
                        if (storedUser) {
                            setUser(JSON.parse(storedUser));
                        } else {
                            // Token might be invalid
                            // localStorage.removeItem('token'); 
                        }
                    }
                }
            } catch (error) {
                console.error("Auth init failed", error);
            } finally {
                setIsLoading(false);
            }
        };

        initAuth();
    }, []);

    const login = async (credentials: LoginDto) => {
        try {
            const response: any = await authService.login(credentials);

            if (response.user) {
                localStorage.setItem('user', JSON.stringify(response.user));
                setUser(response.user);
            }
        } catch (error) {
            console.error("Login error in context:", error);
            throw error; // Rethrow so component can handle it
        }
    };

    const register = async (data: RegisterDto) => {
        await authService.register(data);
        // Auto login after register?
        // For now just allow success to flow up
    };

    const logout = () => {
        authService.logout();
        setUser(null);
        localStorage.removeItem('user');
        window.location.href = '/'; // Hard redirect to clear any secure state
    };

    const openLoginModal = () => setIsLoginModalOpen(true);
    const closeLoginModal = () => setIsLoginModalOpen(false);

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: !!user,
            isLoading,
            login,
            register,
            logout,
            isLoginModalOpen,
            openLoginModal,
            closeLoginModal
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
