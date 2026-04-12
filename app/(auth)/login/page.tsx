"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "@/lib/auth-client";
import { Mail } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await signIn.email({
        email: form.email,
        password: form.password,
        fetchOptions: {
          onSuccess: () => router.push("/dashboard"),
          onError: (ctx) => setError(ctx.error.message),
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider: "google" | "github") => {
    setError("");
    await signIn.social({
      provider,
      callbackURL: "/dashboard",
      fetchOptions: {
        onError: (ctx) => setError(ctx.error.message),
      },
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md bg-zinc-950 border-zinc-800 text-zinc-100">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <CardDescription className="text-zinc-400">
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>

        <CardContent>
          {error && (
            <div className="mb-4 rounded-md border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleEmailSignIn} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                required
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                className="bg-zinc-900 border-zinc-800 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={form.password}
                onChange={(e) => updateField("password", e.target.value)}
                className="bg-zinc-900 border-zinc-800 text-white"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black hover:bg-zinc-200"
            >
              <Mail className={`mr-2 h-4 w-4 ${loading && "animate-pulse"}`} />
              Sign in
            </Button>
          </form>

          <div className="mt-6 flex items-center gap-2">
            <div className="flex-1 border-t border-zinc-800" />
            <span className="text-xs text-zinc-500">Or continue with</span>
            <div className="flex-1 border-t border-zinc-800" />
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <Button
              type="button"
              variant="outline"
              className="bg-zinc-900 border-zinc-800 hover:bg-zinc-800"
              onClick={() => handleOAuth("google")}
            >
              Google
            </Button>

            <Button
              type="button"
              variant="outline"
              className="bg-zinc-900 border-zinc-800 hover:bg-zinc-800"
              onClick={() => handleOAuth("github")}
            >
              GitHub
            </Button>
          </div>

          <p className="mt-6 text-center text-sm text-zinc-400">
            Don’t have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-white hover:text-zinc-300"
            >
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}