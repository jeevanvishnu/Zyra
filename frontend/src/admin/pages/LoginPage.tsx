import React, { useState } from "react";
import { userAuthStore } from "../../store/UseUserStore";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import LogoImage from "../../assets/LogoImage.png";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function AdminLoginPage() {
  const navigate = useNavigate();

  const { login, isLoading } = userAuthStore();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (errors[id as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [id]: "" }));
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { email: "", password: "" };

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) return;

    if (!validateForm()) return;

    const user = await login(formData);

    if (user.role === "admin") {
      navigate("/admin/dashboard");
    } else {
      toast.error("Access denied. Admin rights required.");
      navigate("/admin/login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 lg:bg-gray-100 font-sans">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Left Side - Image (Hidden on Mobile) */}
        <div className="hidden md:flex w-full md:w-1/2 bg-gray-100 items-center justify-center p-12 relative overflow-hidden">
          {/* Abstract Background Design for visual interest behind logo */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 -z-10" />
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />

          <img
            src={LogoImage}
            alt="Admin Visual"
            className="w-full h-auto object-contain max-h-[400px] z-10 drop-shadow-xl hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Right Side - Form (Black on Mobile, White on Desktop) */}
        <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-black md:bg-white transition-colors duration-300">
          <div className="mb-10 text-center md:text-left">
            <h1 className="text-3xl font-bold mb-2 text-white md:text-gray-900 tracking-tight">
              Admin Portal
            </h1>
            <p className="text-gray-400 md:text-gray-500 text-sm md:text-base">
              Secure access for administrators only.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-white md:text-gray-700 font-medium ml-1"
              >
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={formData.email}
                onChange={handleChange}
                className="bg-white/10 md:bg-gray-50 text-white md:text-gray-900 border-transparent md:border-gray-200 focus:bg-white/20 md:focus:bg-white transition-all duration-200 placeholder:text-gray-500 rounded-lg py-6"
              />
              {errors.email && (
                <p className="text-red-400 md:text-red-500 text-xs ml-1 font-medium">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <Label
                  htmlFor="password"
                  className="text-white md:text-gray-700 font-medium"
                >
                  Password
                </Label>
                <a
                  href="#"
                  className="text-xs text-blue-400 md:text-blue-600 hover:text-blue-300 md:hover:text-blue-700 font-medium transition-colors"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="bg-white/10 md:bg-gray-50 text-white md:text-gray-900 border-transparent md:border-gray-200 focus:bg-white/20 md:focus:bg-white transition-all duration-200 placeholder:text-gray-500 pr-10 rounded-lg py-6"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 md:text-gray-500 hover:text-white md:hover:text-gray-700 transition-colors bg-transparent border-0 cursor-pointer p-1"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 md:text-red-500 text-xs ml-1 font-medium">
                  {errors.password}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full mt-4 bg-white text-black hover:bg-gray-200 md:bg-black md:text-white md:hover:bg-gray-800 font-bold py-6 text-base shadow-lg transition-transform hover:scale-[1.01] active:scale-[0.99] rounded-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Authenticating...
                </>
              ) : (
                "Sign in to Dashboard"
              )}
            </Button>
          </form>

          <div className="mt-8 text-center md:text-left text-xs text-gray-500 md:text-gray-400">
            By accessing this portal, you agree to our internal{" "}
            <a
              href="#"
              className="underline hover:text-white md:hover:text-black"
            >
              security protocols
            </a>
            .
          </div>
        </div>
      </div>
    </div>
  );
}
