"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { Logo } from "@/components/ui/logo";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data) => {
      // OAuth2PasswordRequestForm expects form data, not json
      const formData = new URLSearchParams();
      formData.append("username", data.email);
      formData.append("password", data.password);

      const response = await api.post("/auth/login", formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
      return response.data;
    },
    onSuccess: (data) => {
      localStorage.setItem("token", data.access_token);
      router.push("/dashboard");
    },
    onError: (error) => {
      setServerError(
        error.response?.data?.detail || "Something went wrong. Please try again."
      );
    },
  });

  function onSubmit(data) {
    setServerError("");
    loginMutation.mutate(data);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-slate-100">
        <div>
          <Logo className="w-16 h-16 mx-auto mb-4 shadow-sm rounded-3xl" />
          <h2 className="mt-2 text-center text-3xl font-extrabold text-slate-900">
            Welcome back
          </h2>
          <p className="mt-2 text-center text-sm text-slate-500">
            Log in to manage your inventory and operations.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          {serverError && (
            <div className="p-3 rounded-md bg-red-50 text-red-600 text-sm border border-red-100">
              {serverError}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700"
              >
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  className={`appearance-none block w-full px-3 py-2.5 border ${
                    form.formState.errors.email
                      ? "border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500"
                      : "border-slate-300 text-slate-900 focus:ring-blue-500 focus:border-blue-500"
                  } rounded-md shadow-sm placeholder-slate-400 focus:outline-none sm:text-sm`}
                  {...form.register("email")}
                />
                {form.formState.errors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700"
              >
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  className={`appearance-none block w-full px-3 py-2.5 border ${
                    form.formState.errors.password
                      ? "border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500"
                      : "border-slate-300 text-slate-900 focus:ring-blue-500 focus:border-blue-500"
                  } rounded-md shadow-sm placeholder-slate-400 focus:outline-none sm:text-sm pr-10`}
                  {...form.register("password")}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-slate-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-slate-400" />
                  )}
                </button>
              </div>
              {form.formState.errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-slate-900"
              >
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a
                href="#"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <Button
              type="submit"
              className="w-full flex justify-center py-2.5 px-4 bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-100 h-11"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? (
                <Loader2 className="animate-spin h-5 w-5 text-white" />
              ) : (
                "Sign in"
              )}
            </Button>
          </div>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-slate-600">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
            >
              Start for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
