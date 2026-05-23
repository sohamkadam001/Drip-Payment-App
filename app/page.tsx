"use client"

import { useEffect, useState } from "react"
import { ArrowRight, ShieldCheck, Zap, Globe, CreditCard } from "lucide-react"

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false)

  // Trigger entrance animations shortly after the component mounts
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="relative min-h-screen bg-[#fafafa] text-neutral-900 selection:bg-neutral-900 selection:text-white font-sans overflow-x-hidden scroll-smooth">
      
      {/* =========================================
          FLOATING PREMIUM NAVBAR
          ========================================= */}
      <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-6 pointer-events-none transition-all duration-700 ease-out transform translate-y-0">
        <nav className="pointer-events-auto flex items-center justify-between w-full max-w-5xl px-2 py-2 pl-6 bg-white/70 backdrop-blur-2xl border border-neutral-200/60 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300">
          
          {/* Logo (Scrolls to top) */}
          <a href="#" className="flex items-center gap-3 cursor-pointer group">
            <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-300">
              <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
            </div>
            <span className="text-xl font-bold tracking-tight text-black">Drip.</span>
          </a>

          {/* Center Links (Updated with How It Works) */}
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-neutral-500">
            <a href="#features" className="hover:text-black transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-black transition-colors">How it Works</a>
            <a href="#developers" className="hover:text-black transition-colors">Developers</a>
            <a href="#company" className="hover:text-black transition-colors">Company</a>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button className="px-6 py-2.5 text-sm font-bold rounded-full bg-black text-white hover:scale-105 hover:shadow-lg transition-all duration-300">
              Sign In
            </button>
          </div>
        </nav>
      </div>

      {/* =========================================
          FULL-BLEED HERO SECTION
          ========================================= */}
      <div className="relative w-full pt-48 pb-32 md:pt-56 md:pb-40 flex flex-col items-center text-center">
        
        {/* MASSIVE AURORA BACKGROUND */}
        <div className="absolute top-0 left-0 right-0 h-[800px] pointer-events-none z-0 overflow-hidden opacity-90">
          <div className="absolute -top-[10%] -left-[10%] w-[60%] h-[80%] rounded-full bg-indigo-500/20 blur-[120px] md:blur-[160px]"></div>
          <div className="absolute top-[0%] -right-[10%] w-[50%] h-[70%] rounded-full bg-orange-400/20 blur-[120px] md:blur-[160px]"></div>
          <div className="absolute -bottom-[10%] left-[20%] w-[60%] h-[60%] rounded-full bg-cyan-400/20 blur-[120px] md:blur-[160px]"></div>
          
          <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#fafafa] to-transparent"></div>
        </div>

        {/* HERO CONTENT */}
        <div className={`relative z-10 flex flex-col items-center px-6 max-w-5xl mx-auto transition-all duration-1000 ease-out transform ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="mb-8 px-5 py-2 rounded-full border border-neutral-200/80 bg-white/60 backdrop-blur-md text-xs font-bold tracking-widest uppercase text-neutral-600 shadow-sm">
            The Modern Financial Stack
          </div>

          <h1 className="text-6xl md:text-[6.5rem] lg:text-[7.5rem] font-extrabold tracking-tighter leading-[0.95] mb-8 text-black">
            Send Money <br /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-500 to-neutral-900">
              Instantly.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-neutral-600 max-w-2xl font-medium leading-relaxed mb-12">
            Drip lets you transfer money securely, instantly, and effortlessly. Re-engineered from the ground up for speed and borderless capabilities.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <button className="group flex items-center justify-center gap-2 px-8 py-4 bg-black text-white rounded-full font-bold text-lg shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:scale-105 transition-all duration-300 ease-out">
              Get Started
              <ArrowRight size={20} className="group-hover:translate-x-1.5 transition-transform duration-300" />
            </button>
            <button className="px-8 py-4 rounded-full font-bold text-lg text-black bg-white/40 backdrop-blur-md border border-neutral-300 hover:bg-white/80 transition-all duration-300">
              Read the Docs
            </button>
          </div>
        </div>
      </div>

      {/* =========================================
          BENTO BOX FEATURES GRID 
          ========================================= */}
      <section id="features" className={`relative z-20 px-4 md:px-8 pb-10 max-w-7xl mx-auto -mt-10 md:-mt-16 transition-all duration-1000 delay-200 ease-out transform ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="md:col-span-2 p-10 md:p-12 rounded-[2.5rem] bg-white border border-neutral-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-500 group flex flex-col justify-between overflow-hidden">
            <div className="relative z-10">
              <div className="mb-8 inline-flex p-4 rounded-full bg-neutral-100 text-black border border-neutral-200/50 group-hover:scale-110 transition-transform duration-300">
                <Globe size={32} strokeWidth={2} />
              </div>
              <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4 text-black">Borderless Transfers</h3>
              <p className="text-lg text-neutral-500 font-medium max-w-md">
                Send money to over 150 countries in seconds. We handle the complex routing and currency conversion instantly so you don't have to.
              </p>
            </div>
          </div>

          <div className="p-10 rounded-[2.5rem] bg-white border border-neutral-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-500 group overflow-hidden">
            <div className="relative z-10">
              <div className="mb-6 inline-flex p-4 rounded-full bg-neutral-100 text-black border border-neutral-200/50 group-hover:scale-110 transition-transform duration-300">
                <Zap size={28} strokeWidth={2.5} />
              </div>
              <h3 className="text-xl font-bold tracking-tight mb-2 text-black">Lightning Fast</h3>
              <p className="text-neutral-500 font-medium">
                Transactions settle in milliseconds, bypassing traditional banking delays.
              </p>
            </div>
          </div>

          <div className="p-10 rounded-[2.5rem] bg-white border border-neutral-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-500 group overflow-hidden">
            <div className="relative z-10">
              <div className="mb-6 inline-flex p-4 rounded-full bg-neutral-100 text-black border border-neutral-200/50 group-hover:scale-110 transition-transform duration-300">
                <CreditCard size={28} strokeWidth={2.5} />
              </div>
              <h3 className="text-xl font-bold tracking-tight mb-2 text-black">Virtual Cards</h3>
              <p className="text-neutral-500 font-medium">
                Generate single-use cards for zero-liability online spending.
              </p>
            </div>
          </div>

           <div className="md:col-span-2 p-10 md:p-12 rounded-[2.5rem] bg-black text-white shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 group flex flex-col justify-between overflow-hidden">
            <div className="relative z-10">
              <div className="mb-8 inline-flex p-4 rounded-full bg-neutral-800 text-white group-hover:scale-110 transition-transform duration-300">
                <ShieldCheck size={32} strokeWidth={2} />
              </div>
              <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">Bank-Grade Security</h3>
              <p className="text-lg text-neutral-400 font-medium max-w-md">
                Military-level AES-256 encryption keeps your funds and personal data locked down. We never sell your data.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================
          HOW IT WORKS SECTION
          ========================================= */}
      <section id="how-it-works" className={`relative z-20 w-full py-32 bg-white border-y border-neutral-200/50 mt-16 transition-all duration-1000 delay-300 ease-out transform ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 text-black">Designed for simplicity.</h2>
            <p className="text-lg text-neutral-500 max-w-2xl mx-auto font-medium leading-relaxed">
              Getting started with Drip takes less than three minutes. No paperwork, no hidden fees, just seamless money movement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8 relative">
            
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-transparent via-neutral-200 to-transparent z-0"></div>

            {/* Step 1 */}
            <div className="relative z-10 flex flex-col items-center text-center group cursor-default">
              <div className="w-24 h-24 rounded-full bg-neutral-50 border-[6px] border-white shadow-md flex items-center justify-center text-3xl font-extrabold mb-8 text-neutral-300 group-hover:text-black group-hover:scale-110 group-hover:shadow-xl transition-all duration-500">
                1
              </div>
              <h3 className="text-2xl font-bold tracking-tight mb-4">Download & Verify</h3>
              <p className="text-neutral-500 font-medium leading-relaxed max-w-[280px]">
                Get the app and verify your identity in seconds using our automated KYC system.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative z-10 flex flex-col items-center text-center group cursor-default">
              <div className="w-24 h-24 rounded-full bg-neutral-50 border-[6px] border-white shadow-md flex items-center justify-center text-3xl font-extrabold mb-8 text-neutral-300 group-hover:text-black group-hover:scale-110 group-hover:shadow-xl transition-all duration-500">
                2
              </div>
              <h3 className="text-2xl font-bold tracking-tight mb-4">Fund Your Wallet</h3>
              <p className="text-neutral-500 font-medium leading-relaxed max-w-[280px]">
                Connect your bank account or debit card to instantly top up your Drip balance.
              </p>
            </div>

            {/* Step 3 (Highlight Step) */}
            <div className="relative z-10 flex flex-col items-center text-center group cursor-default">
              <div className="w-24 h-24 rounded-full bg-black text-white border-[6px] border-white shadow-lg flex items-center justify-center text-3xl font-extrabold mb-8 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:shadow-2xl transition-all duration-500">
                3
              </div>
              <h3 className="text-2xl font-bold tracking-tight mb-4">Send Globally</h3>
              <p className="text-neutral-500 font-medium leading-relaxed max-w-[280px]">
                Transfer funds to anyone, anywhere in the world with zero hidden routing fees.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="company" className="relative z-10 text-center py-10 text-sm font-medium text-neutral-500 bg-[#fafafa]">
        © {new Date().getFullYear()} Drip Inc. Designed for the future of finance.
      </footer>

    </div>
  )
}