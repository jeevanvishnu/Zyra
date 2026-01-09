import React, { useState } from 'react'
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import LogoImage from "../assets/LogoImage.png";

const SignupPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));

        // Clear error when user starts typing
        if (errors[id as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [id]: '' }));
        }
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = {
            name: '',
            email: '',
            password: '',
            confirmPassword: ''
        };

        // Name validation
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
            isValid = false;
        } else if (formData.name.trim().length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
            isValid = false;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
            isValid = false;
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
            isValid = false;
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = 'Password is required';
            isValid = false;
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
            isValid = false;
        }

        // Confirm password validation
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
            isValid = false;
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (validateForm()) {
            console.log('Form submitted:', formData);
            // Add your signup logic here
        }
    };

    return (
        <div>
            <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 lg:bg-gray-100">
                <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
                    {/* Image Section - Hidden on mobile, visible on desktop */}
                    <div className="bg-gray-300 hidden md:flex w-full md:w-1/2 bg-gradient-to-br from-gray-50 to-gray-100 items-center justify-center p-8">
                        <img
                            src={LogoImage}
                            alt="Signup Visual"
                            className="w-full h-auto object-contain max-h-[600px]"
                        />
                    </div>

                    {/* Form Section - Black background on mobile, White on desktop */}
                    <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-black md:bg-white transition-colors duration-300">
                        <div className="mb-8 text-center md:text-left">
                            <h1 className="text-3xl font-bold mb-2 text-white md:text-gray-900">
                                Create Account
                            </h1>
                            <p className="text-gray-300 md:text-gray-500 text-sm md:text-base">
                                Join us today! Please fill in your details.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Name Field */}
                            <div className="space-y-2">
                                <Label
                                    htmlFor="name"
                                    className="text-white md:text-gray-700 font-medium"
                                >
                                    Full Name
                                </Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="Enter your full name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="bg-white/10 md:bg-white text-white md:text-gray-900 border-transparent md:border md:border-input focus-visible:ring-offset-0 placeholder:text-gray-400"
                                />
                                {errors.name && (
                                    <p className="text-red-400 md:text-red-500 text-xs mt-1">{errors.name}</p>
                                )}
                            </div>

                            {/* Email Field */}
                            <div className="space-y-2">
                                <Label
                                    htmlFor="email"
                                    className="text-white md:text-gray-700 font-medium"
                                >
                                    Email
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="bg-white/10 md:bg-white text-white md:text-gray-900 border-transparent md:border md:border-input focus-visible:ring-offset-0 placeholder:text-gray-400"
                                />
                                {errors.email && (
                                    <p className="text-red-400 md:text-red-500 text-xs mt-1">{errors.email}</p>
                                )}
                            </div>

                            {/* Password Field */}
                            <div className="space-y-2">
                                <Label
                                    htmlFor="password"
                                    className="text-white md:text-gray-700 font-medium"
                                >
                                    Password
                                </Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="bg-white/10 md:bg-white text-white md:text-gray-900 border-transparent md:border md:border-input focus-visible:ring-offset-0 placeholder:text-gray-400"
                                />
                                {errors.password && (
                                    <p className="text-red-400 md:text-red-500 text-xs mt-1">{errors.password}</p>
                                )}
                            </div>

                            {/* Confirm Password Field */}
                            <div className="space-y-2">
                                <Label
                                    htmlFor="confirmPassword"
                                    className="text-white md:text-gray-700 font-medium"
                                >
                                    Confirm Password
                                </Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="••••••••"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="bg-white/10 md:bg-white text-white md:text-gray-900 border-transparent md:border md:border-input focus-visible:ring-offset-0 placeholder:text-gray-400"
                                />
                                {errors.confirmPassword && (
                                    <p className="text-red-400 md:text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
                                )}
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-white text-black hover:bg-gray-200 md:bg-black md:text-white md:hover:bg-gray-800 font-bold shadow-lg transition-transform hover:scale-[1.02]"
                            >
                                Sign up
                            </Button>

                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-white/20 md:border-gray-300" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-black md:bg-white px-2 text-gray-400 md:text-gray-500">
                                        Or continue with
                                    </span>
                                </div>
                            </div>

                            <Button
                                variant="outline"
                                type="button"
                                className="w-full bg-white border-transparent md:border md:border-gray-300 hover:bg-gray-50 md:hover:bg-gray-50 text-gray-700"
                            >
                                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                                    <path
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        fill="#4285F4"
                                    />
                                    <path
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        fill="#34A853"
                                    />
                                    <path
                                        d="M5.84 14.11c-.22-.66-.35-1.36-.35-2.11s.13-1.45.35-2.11V7.05H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.95l3.66-2.84z"
                                        fill="#FBBC05"
                                    />
                                    <path
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.05l3.66 2.84c.87-2.6 3.3-4.51 6.16-4.51z"
                                        fill="#EA4335"
                                    />
                                </svg>
                                Sign up with Google
                            </Button>
                        </form>

                        <p className="mt-8 text-center text-sm text-gray-400 md:text-gray-600">
                            Already have an account?{" "}
                            <a
                                href="#"
                                className="font-bold text-white md:text-black hover:underline"
                            >
                                Sign in
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignupPage
