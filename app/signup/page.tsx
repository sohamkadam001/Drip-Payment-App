"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { z } from "zod"
import { Loader2, ArrowRight } from "lucide-react"

// Define validation schema
const signupSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export default function Signup() {
  const router = useRouter()
  const [formData, setFormData] = useState({ username: "", email: "", password: "" })
  const [isLoading, setIsLoading] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Validate with Zod
    const result = signupSchema.safeParse(formData)
    
    if (!result.success) {
      result.error.issues.forEach((issue) => toast.error(issue.message))
      setIsLoading(false)
      return
    }

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.msg || "Signup failed")
      } else {
        toast.success("Account created successfully!")
        router.push("/signin")
      }
    } catch {
      toast.error("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center p-6">
      {/* Background Aurora Effect */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-40">
        <div className="absolute top-[-10%] right-[-5%] w-[50%] h-[50%] rounded-full bg-indigo-500/20 blur-[120px]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="w-full max-w-md z-10"
      >
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-black rounded-full mx-auto mb-4" />
          <h1 className="text-3xl font-black tracking-tight text-neutral-900">Join Drip.</h1>
          <p className="text-neutral-500 mt-2">Create your account to get started.</p>
        </div>

        <form onSubmit={handleSignup} className="bg-white p-8 rounded-[2.5rem] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-neutral-100 space-y-4">
          <div>
            <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest ml-1">Username</label>
            <input 
              className="w-full mt-1 p-4 bg-neutral-50 rounded-2xl border border-neutral-100 outline-none focus:ring-2 focus:ring-black/5" 
              placeholder="Username"
              onChange={(e) => setFormData({...formData, username: e.target.value})}
            />
          </div>
          <div>
            <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest ml-1">Email</label>
            <input 
              className="w-full mt-1 p-4 bg-neutral-50 rounded-2xl border border-neutral-100 outline-none focus:ring-2 focus:ring-black/5" 
              placeholder="Email Address"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div>
            <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest ml-1">Password</label>
            <input 
              type="password"
              className="w-full mt-1 p-4 bg-neutral-50 rounded-2xl border border-neutral-100 outline-none focus:ring-2 focus:ring-black/5" 
              placeholder="Password"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <button 
            disabled={isLoading}
            className="w-full mt-4 py-4 bg-black text-white rounded-2xl font-bold hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20}/> : <>Create Account <ArrowRight size={18} /></>}
          </button>

          <p className="text-center text-sm text-neutral-500 mt-6">
            Already have an account? <Link href="/signin" className="font-bold text-black hover:underline">Sign In</Link>
          </p>
        </form>
      </motion.div>
    </div>
  )
}