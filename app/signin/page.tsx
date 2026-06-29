"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, Loader2, Mail, Lock } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { z } from "zod"

// Strict validation schema
const signinSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export default function Signin() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleSignin = async () => {
    // 1. Zod Validation
    const result = signinSchema.safeParse({ email, password })
    
    if (!result.success) {
      result.error.issues.forEach((issue) => toast.error(issue.message))
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        toast.error(data.msg || "Signin failed. Check your credentials.")
      } else {
        localStorage.setItem("token", data.token)
        localStorage.setItem("username", data.username)
        toast.success("Welcome back to Drip!")
        router.push("/dashboard")
      }
    } catch (e) {
      toast.error("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-[#F8F9FB] flex items-center justify-center p-6 overflow-hidden">
      
      {/* Background Aurora */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-50">
        <div className="absolute top-[-10%] right-[-5%] w-[50%] h-[50%] rounded-full bg-indigo-500/20 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[60%] rounded-full bg-cyan-400/20 blur-[120px]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md bg-white p-10 rounded-[2.5rem] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-neutral-100"
      >
        <div className="flex flex-col items-center mb-10">
          <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center mb-6 shadow-xl">
             <div className="w-3 h-3 rounded-full bg-white"></div>
          </div>
          <h2 className="text-3xl font-black tracking-tight text-neutral-900">Welcome back</h2>
          <p className="text-neutral-500 font-medium mt-2">Sign in to your Drip wallet.</p>
        </div>

        <div className="space-y-5">
          <div className="relative">
            <Mail className="absolute left-4 top-4 text-neutral-400" size={20} />
            <input 
              type="email" 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="Email Address"
              className="w-full pl-12 pr-5 py-4 bg-neutral-50 border border-neutral-200 rounded-2xl outline-none focus:ring-4 focus:ring-black/5 transition-all"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-4 text-neutral-400" size={20} />
            <input 
              type="password" 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Password"
              className="w-full pl-12 pr-5 py-4 bg-neutral-50 border border-neutral-200 rounded-2xl outline-none focus:ring-4 focus:ring-black/5 transition-all"
            />
          </div>
        </div>

        <button 
          disabled={loading} 
          onClick={handleSignin}
          className="w-full mt-8 flex items-center justify-center gap-2 py-4 bg-black text-white rounded-2xl font-bold text-lg hover:scale-[1.01] transition-all disabled:opacity-70"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : <>Sign In <ArrowRight size={18} /></>}
        </button>

        <p className="mt-8 text-center text-sm text-neutral-500 font-medium">
          New here? <Link href="/signup" className="text-black font-bold hover:underline">Create an account</Link>
        </p>
      </motion.div>
    </div>
  )
}