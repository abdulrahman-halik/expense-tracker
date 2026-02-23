import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../../../services/authService';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { LogIn } from 'lucide-react';

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormValues) => {
        setIsSubmitting(true);
        setError(null);
        try {
            const response = await authService.login(data);
            login(response.token, response.user);
            navigate('/');
        } catch (err: unknown) {
            let message = 'Failed to login. Please check your credentials.';
            if (err && typeof err === 'object' && 'response' in err) {
                const axiosError = err as { response?: { data?: { message?: string } } };
                message = axiosError.response?.data?.message || message;
            }
            setError(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
            <Card
                className="w-full max-w-md shadow-2xl border-0 ring-1 ring-gray-200 animate-in fade-in zoom-in duration-300"
                title="Sign In"
                description="Enter your credentials to access your account"
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
                            {error}
                        </div>
                    )}

                    <Input
                        label="Email"
                        type="email"
                        placeholder="you@example.com"
                        error={errors.email?.message}
                        {...register('email')}
                    />

                    <Input
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        error={errors.password?.message}
                        {...register('password')}
                    />

                    <Button
                        type="submit"
                        className="w-full mt-4"
                        isLoading={isSubmitting}
                        leftIcon={<LogIn className="h-4 w-4" />}
                    >
                        Sign In
                    </Button>

                    <div className="text-center mt-6">
                        <p className="text-sm text-gray-500">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-blue-600 font-semibold hover:underline">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </form>
            </Card>
        </div>
    );
};
