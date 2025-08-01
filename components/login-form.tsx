"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link" // Import Link for navigation
import { auth, type UserLogin } from "@/lib/api"
import { setToken } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

interface LoginFormProps {
  onLoginSuccess: () => void
}

export function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const { toast } = useToast()

  // Login state
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const loginData: UserLogin = {
      email: loginEmail,
      password: loginPassword,
    }
    const { data, error } = await auth.login(loginData)
    if (data && (data as any).access_token) {
      setToken((data as any).access_token)
      toast({
        title: "Login Successful",
        description: "Welcome back!",
      })
      onLoginSuccess()
    } else {
      toast({
        title: "Login Failed",
        description: error || "Invalid credentials.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="p-6 shadow-lg w-full max-w-md">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Access your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Label htmlFor="loginEmail">Email</Label>
            <Input
              id="loginEmail"
              type="email"
              placeholder="email@example.com"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="loginPassword">Password</Label>
            <Input
              id="loginPassword"
              type="password"
              placeholder="********"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          Don't have an account?{" "}
          <Link href="/register" className="text-emerald-600 hover:underline">
            Register here
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
