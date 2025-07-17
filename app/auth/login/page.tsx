"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, EyeOff, Mail, Phone, Calculator, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [loginType, setLoginType] = useState<"email" | "mobile">("email")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [mobile, setMobile] = useState("")
  const [otp, setOtp] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Default credentials check
    if (email === "admin@gmail.com" && password === "admin@123") {
      // Simulate API call
      setTimeout(() => {
        localStorage.setItem(
          "user",
          JSON.stringify({
            email: "admin@gmail.com",
            name: "Admin User",
            businessName: "Demo Business",
          }),
        )
        router.push("/dashboard")
      }, 1000)
    } else {
      setTimeout(() => {
        setError("Invalid credentials. Use admin@gmail.com / admin@123")
        setLoading(false)
      }, 1000)
    }
  }

  const handleMobileLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (!otpSent) {
      // Send OTP
      setTimeout(() => {
        setOtpSent(true)
        setLoading(false)
      }, 1000)
    } else {
      // Verify OTP
      if (otp === "123456") {
        setTimeout(() => {
          localStorage.setItem(
            "user",
            JSON.stringify({
              mobile: mobile,
              name: "Mobile User",
              businessName: "Demo Business",
            }),
          )
          router.push("/dashboard")
        }, 1000)
      } else {
        setTimeout(() => {
          setError("Invalid OTP. Use 123456")
          setLoading(false)
        }, 1000)
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-6">
        <div className="flex flex-col items-center gap-2">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow">
            {/* Logo/Icon here */}
          </div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Sign in to your account</h2>
          <p className="text-gray-500 text-sm">Welcome back! Please enter your credentials.</p>
        </div>
        {/* Login form goes here */}
      </div>
    </div>
  )
}
