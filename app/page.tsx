"use client"

import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"

export default function LandingPage() {
  const [dark, setDark] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("theme")
    if (saved === "dark") setDark(true)

    // trigger animation on load
    setTimeout(() => setVisible(true), 100)
  }, [])

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }, [dark])

  return (
    <div className={`min-h-screen transition-all duration-700 ease-in-out scroll-smooth ${dark ? "bg-black text-white" : "bg-white text-black"}`}>

      {/* NAVBAR */}
      <nav className="flex justify-between items-center px-8 py-6 backdrop-blur-md sticky top-0 z-50 transition-all duration-300">
        <h1 className="text-2xl font-bold tracking-wide">Drip</h1>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setDark(!dark)}
            className="p-2 rounded-full border hover:scale-110 transition"
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button className="px-5 py-2 border rounded-full hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300 hover:scale-105">
            Sign In
          </button>
        </div>
      </nav>


      {/* HERO */}
      <section className={`flex flex-col items-center justify-center text-center px-6 py-32 transition-all duration-1000 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>

        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
          Send Money Instantly
        </h1>

        <p className="text-lg max-w-xl mb-8 opacity-80">
          Drip lets you transfer money securely, instantly, and effortlessly.
        </p>

        <button className="px-8 py-4 bg-black text-white rounded-full hover:scale-110 transition-all duration-300 shadow-lg dark:bg-white dark:text-black">
          Get Started
        </button>
      </section>


      {/* FEATURES */}
      <section className="grid md:grid-cols-3 gap-6 px-8 pb-24">

        {["Instant Transfers", "Secure", "Smart Dashboard"].map((title, i) => (
          <div
            key={i}
            className="p-6 rounded-2xl border hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
          >
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="opacity-70">
              {i === 0 && "Send money in seconds with zero friction."}
              {i === 1 && "Bank-level encryption keeps your funds safe."}
              {i === 2 && "Track transactions and balances easily."}
            </p>
          </div>
        ))}

      </section>


      {/* FOOTER */}
      <footer className="text-center py-6 opacity-60 hover:opacity-100 transition">
        © {new Date().getFullYear()} Drip. All rights reserved.
      </footer>

    </div>
  )
}
