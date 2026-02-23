export interface User {
    id: string;
    name: string;
    email: string;
    role?: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}

export type LoginData = Pick<User, 'email'> & { password: string };

export type RegisterData = Pick<User, 'name' | 'email'> & { password: string };
