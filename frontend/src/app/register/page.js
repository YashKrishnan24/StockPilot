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

const registerSchema = z.object({
  name: z.string().min(2, "Full name is required."),
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
  business_name: z.string().min(2, "Business name is required."),
});

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");

  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      business_name: "",
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data) => {
      const response = await api.post(
        `/auth/register?business_name=${encodeURIComponent(data.business_name)}`,
        {
          name: data.name,
          email: data.email,
          password: data.password,
        }
      );
      return response.data;
    },
    onSuccess: async (data, variables) => {
      // Auto-login after successful registration
      const formData = new URLSearchParams();
      formData.append("username", variables.email);
      formData.append("password", variables.password);
      
      try {
        const loginRes = await api.post("/auth/login", formData, {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });
        localStorage.setItem("token", loginRes.data.access_token);
        router.push("/dashboard");
      } catch (e) {
        // Fallback if login fails for some reason
        router.push("/login");
      }
    },
    onError: (error) => {
      setServerError(
        error.response?.data?.detail || "Registration failed. Please try again."
      );
    },
  });

  function onSubmit(data) {
    setServerError("");
    registerMutation.mutate(data);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-slate-100">
        <div>
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">S</span>
          </div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-slate-900">
            Start managing inventory
          </h2>
          <p className="mt-2 text-center text-sm text-slate-500">
            Create your StockPilot workspace.
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
                htmlFor="name"
                className="block text-sm font-medium text-slate-700"
              >
                Full name
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  className={`appearance-none block w-full px-3 py-2.5 border ${
                    form.formState.errors.name
                      ? "border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500"
                      : "border-slate-300 text-slate-900 focus:ring-blue-500 focus:border-blue-500"
                  } rounded-md shadow-sm placeholder-slate-400 focus:outline-none sm:text-sm`}
                  {...form.register("name")}
                />
                {form.formState.errors.name && (
                  <p className="mt-1 text-sm text-red-600">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>
            </div>

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
                htmlFor="business_name"
                className="block text-sm font-medium text-slate-700"
              >
                Business name
              </label>
              <div className="mt-1">
                <input
                  id="business_name"
                  type="text"
                  className={`appearance-none block w-full px-3 py-2.5 border ${
                    form.formState.errors.business_name
                      ? "border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500"
                      : "border-slate-300 text-slate-900 focus:ring-blue-500 focus:border-blue-500"
                  } rounded-md shadow-sm placeholder-slate-400 focus:outline-none sm:text-sm`}
                  {...form.register("business_name")}
                />
                {form.formState.errors.business_name && (
                  <p className="mt-1 text-sm text-red-600">
                    {form.formState.errors.business_name.message}
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
                  autoComplete="new-password"
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

          <div>
            <Button
              type="submit"
              className="w-full flex justify-center py-2.5 px-4 bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-100 h-11"
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending ? (
                <Loader2 className="animate-spin h-5 w-5 text-white" />
              ) : (
                "Create workspace"
              )}
            </Button>
          </div>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-slate-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
