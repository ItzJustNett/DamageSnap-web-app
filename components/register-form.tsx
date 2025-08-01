"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link" // Import Link for navigation
import { auth, type UserCreate } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export function RegisterForm() {
  const { toast } = useToast()

  // Registration state
  const [registerName, setRegisterName] = useState("")
  const [registerEmail, setRegisterEmail] = useState("")
  const [registerPassword, setRegisterPassword] = useState("")

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    const userData: UserCreate = {
      name: registerName,
      email: registerEmail,
      password: registerPassword,
    }
    const { data, error } = await auth.register(userData)
    if (data) {
      toast({
        title: "Registration Successful",
        description: "You can now log in with your new account.",
      })
      setRegisterName("")
      setRegisterEmail("")
      setRegisterPassword("")
    } else {
      toast({
        title: "Registration Failed",
        description: error || "An unknown error occurred.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="p-6 shadow-lg w-full max-w-md">
      <CardHeader>
        <CardTitle>Register</CardTitle>
        <CardDescription>Create a new account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <Label htmlFor="registerName">Name</Label>
            <Input
              id="registerName"
              type="text"
              placeholder="Your Name"
              value={registerName}
              onChange={(e) => setRegisterName(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="registerEmail">Email</Label>
            <Input
              id="registerEmail"
              type="email"
              placeholder="email@example.com"
              value={registerEmail}
              onChange={(e) => setRegisterEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="registerPassword">Password</Label>
            <Input
              id="registerPassword"
              type="password"
              placeholder="********"
              value={registerPassword}
              onChange={(e) => setRegisterPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Register
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href="/" className="text-emerald-600 hover:underline">
            Login here
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
