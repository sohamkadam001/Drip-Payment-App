"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { LogOut, Search, Loader2, Send, ArrowDownLeft, ArrowUpRight, Wallet, Plus, Bell, Check } from "lucide-react"

export default function Dashboard() {
    const router = useRouter()

    // Authorization & User State
    const [authorized, setAuthorized] = useState(false)
    const [balance, setBalance] = useState<number | null>(null)
    const [currentUser, setCurrentUser] = useState<string>("User") 
    
    // Transfer Flow State
    const [search, setSearch] = useState("")
    const [users, setUsers] = useState<any[]>([])
    const [selectedUser, setSelectedUser] = useState<any | null>(null)
    const [amount, setAmount] = useState("")
    const [txStatus, setTxStatus] = useState<'idle' | 'processing' | 'success'>('idle')
    
    // Transaction Data
    const [transactions, setTransactions] = useState<any>({ sent: [], received: [] })

    // UI Animation State
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const token = localStorage.getItem("token")
        const storedUsername = localStorage.getItem("username")

        if (!token) {
            router.push("/signin")
            return
        }
        
        setAuthorized(true)
        setIsVisible(true)

        // Set dynamic username for greeting & avatar
        if (storedUsername) {
            setCurrentUser(storedUsername)
        }

        // Fetch Initial Data
        fetch("/api/balance", {
            headers: { authorization: `Bearer ${token}` }
        })
            .then(res => {
                if (res.status === 401) router.push("/signin")
                return res.json()
            })
            .then(data => setBalance(data.balance?.balance || 0))

        fetch("/api/transaction", {
            headers: { authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => setTransactions(data))
            
    }, [router])

    const searchUsers = async (value: string) => {
        setSearch(value)
        const token = localStorage.getItem("token")

        if (!value) {
            setUsers([])
            return
        }

        const res = await fetch(`/api/users?query=${value}`, {
            headers: { authorization: `Bearer ${token}` }
        })
        const data = await res.json()
        setUsers(data.users || [])
    }

    const sendMoney = async () => {
        if (!amount || !selectedUser) return

        setTxStatus('processing')
        const token = localStorage.getItem("token")

        try {
            const res = await fetch("/api/transaction", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    amount: Number(amount),
                    receiverId: selectedUser.id
                })
            })

            if (!res.ok) {
                const data = await res.json()
                alert(data.msg || "Transaction failed")
                setTxStatus('idle')
            } else {
                setTxStatus('success')
                
                // Pause to show success state then reset
                setTimeout(async () => {
                    setAmount("")
                    setSelectedUser(null)
                    setSearch("")
                    setTxStatus('idle')

                    // Refresh Data
                    const [balRes, txRes] = await Promise.all([
                        fetch("/api/balance", { headers: { authorization: `Bearer ${token}` } }),
                        fetch("/api/transaction", { headers: { authorization: `Bearer ${token}` } })
                    ])
                    
                    const [balData, txData] = await Promise.all([balRes.json(), txRes.json()])
                    setBalance(balData.balance?.balance || 0)
                    setTransactions(txData)
                }, 2000)
            }
        } catch {
            alert("Network error")
            setTxStatus('idle')
        }
    }

    if (!authorized) {
        return (
            <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
                <Loader2 className="animate-spin text-black" size={32} />
            </div>
        )
    }

    const allTransactions = [
        ...transactions.sent.map((tx: any) => ({ ...tx, type: 'sent' })),
        ...transactions.received.map((tx: any) => ({ ...tx, type: 'received' }))
    ].sort((a: any, b: any) => b.id - a.id)

    const hour = new Date().getHours()
    const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening"

    return (
        <div className="relative min-h-screen bg-[#fafafa] text-neutral-900 selection:bg-black selection:text-white pb-20 overflow-x-hidden font-sans">
            
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-50">
                <div className="absolute top-[-10%] right-[-5%] w-[50%] h-[50%] rounded-full bg-indigo-500/20 blur-[120px]"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[60%] rounded-full bg-cyan-400/20 blur-[120px]"></div>
            </div>

            <nav className="relative z-10 flex items-center justify-between w-full max-w-6xl mx-auto px-6 py-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center shadow-md">
                        <div className="w-3 h-3 rounded-full bg-white"></div>
                    </div>
                    <span className="text-2xl font-bold tracking-tight text-black">Drip.</span>
                </div>
                
                <div className="flex items-center gap-4">
                    <button className="p-2 text-neutral-400 hover:text-black transition-colors"><Bell size={20} /></button>
                    <div className="h-8 w-px bg-neutral-200"></div>
                    <div className="flex items-center gap-3 pl-2">
                        <div className="w-9 h-9 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center font-bold text-sm text-neutral-700 shadow-sm">
                            {currentUser.charAt(0).toUpperCase()}
                        </div>
                        <button
                            onClick={() => {
                                localStorage.removeItem("token")
                                localStorage.removeItem("username")
                                router.push("/")
                            }}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-full bg-white border border-neutral-200 text-neutral-600 hover:text-black hover:border-black/20 hover:shadow-sm transition-all duration-300"
                        >
                            <LogOut size={16} strokeWidth={2.5} />
                            Sign Out
                        </button>
                    </div>
                </div>
            </nav>

            <main className={`relative z-10 max-w-6xl mx-auto px-6 mt-6 transition-all duration-700 delay-100 ease-out transform ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
                
                <div className="mb-10">
                    <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900">
                        {greeting}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500">{currentUser}</span>
                    </h1>
                    <p className="text-neutral-500 font-medium mt-1">Here is your financial overview.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    <div className="lg:col-span-2 space-y-6">
                        <div className="p-8 sm:p-10 rounded-[2.5rem] bg-black text-white shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-500/20 rounded-full blur-[80px] -mr-20 -mt-20"></div>
                            <div className="absolute bottom-0 left-0 w-56 h-56 bg-cyan-500/20 rounded-full blur-[60px] -ml-20 -mb-20"></div>
                            
                            <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                                <div>
                                    <div className="flex items-center gap-2 text-neutral-400 font-medium mb-3">
                                        <Wallet size={18} /> Total Balance
                                    </div>
                                    <h2 className="text-6xl sm:text-7xl font-extrabold tracking-tighter">
                                        {balance !== null ? (
                                            <>
                                                <span className="text-neutral-500 mr-2 font-medium">₹</span>
                                                {balance.toLocaleString()}
                                            </>
                                        ) : (
                                            <span className="animate-pulse bg-white/20 h-16 w-64 rounded-xl inline-block"></span>
                                        )}
                                    </h2>
                                </div>
                                <button className="flex items-center justify-center gap-2 px-6 py-3.5 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-full font-bold transition-all duration-300">
                                    <Plus size={20} /> Add Money
                                </button>
                            </div>
                        </div>

                        {/* --- REVAMPED QUICK TRANSFER SECTION --- */}
                        <div className="p-8 sm:p-10 rounded-[2.5rem] bg-white border border-neutral-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
                            <h3 className="text-2xl font-bold tracking-tight mb-8">Send Money</h3>
                            
                            <div className="space-y-6">
                                {!selectedUser ? (
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                            <Search size={20} className="text-neutral-400 group-focus-within:text-indigo-500 transition-colors" />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Search by username..."
                                            value={search}
                                            onChange={(e) => searchUsers(e.target.value)}
                                            className="w-full pl-12 pr-5 py-5 bg-neutral-50 border border-neutral-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium placeholder:text-neutral-400"
                                        />
                                        
                                        {users.length > 0 && (
                                            <div className="absolute z-20 w-full mt-3 bg-white border border-neutral-200 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95">
                                                {users.map((user) => (
                                                    <div 
                                                        key={user.id} 
                                                        onClick={() => setSelectedUser(user)}
                                                        className="flex items-center justify-between p-4 hover:bg-neutral-50 cursor-pointer transition-all border-b border-neutral-50 last:border-0"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-50 to-cyan-50 text-indigo-700 flex items-center justify-center font-bold">
                                                                {user.username.charAt(0).toUpperCase()}
                                                            </div>
                                                            <span className="font-semibold text-neutral-800">{user.username}</span>
                                                        </div>
                                                        <div className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">Select</div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="bg-neutral-50 border border-neutral-200 p-6 rounded-2xl animate-in slide-in-from-bottom-4 duration-500">
                                        <div className="flex items-center justify-between mb-8">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 rounded-full bg-black text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-black/20">
                                                    {selectedUser.username.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Recipient</p>
                                                    <p className="font-bold text-xl text-neutral-900">{selectedUser.username}</p>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => { setSelectedUser(null); setAmount(""); }}
                                                className="text-xs font-bold text-neutral-500 hover:text-red-500 transition-colors"
                                            >
                                                Change
                                            </button>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                                                    <span className="text-3xl font-extrabold text-neutral-300">₹</span>
                                                </div>
                                                <input
                                                    type="number"
                                                    placeholder="0"
                                                    value={amount}
                                                    onChange={(e) => setAmount(e.target.value)}
                                                    className="w-full pl-14 pr-5 py-6 bg-white border border-neutral-200 rounded-3xl text-4xl font-extrabold text-neutral-900 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all placeholder:text-neutral-200"
                                                />
                                            </div>

                                            <button
                                                onClick={sendMoney}
                                                disabled={txStatus !== 'idle' || !amount}
                                                className={`group w-full py-5 rounded-2xl font-bold text-lg transition-all duration-300 shadow-xl ${
                                                    txStatus === 'success' 
                                                    ? 'bg-emerald-500 text-white' 
                                                    : 'bg-black text-white hover:bg-neutral-800 hover:scale-[1.01] active:scale-[0.98]'
                                                }`}
                                            >
                                                {txStatus === 'processing' ? (
                                                    <div className="flex items-center justify-center gap-2">
                                                        <Loader2 className="animate-spin" size={20} />
                                                        Processing...
                                                    </div>
                                                ) : txStatus === 'success' ? (
                                                    <div className="flex items-center justify-center gap-2">
                                                        <Check size={20} />
                                                        Transfer Complete
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center justify-center gap-2">
                                                        Confirm & Send
                                                        <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                                    </div>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="p-8 sm:p-10 rounded-[2.5rem] bg-white border border-neutral-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-full flex flex-col max-h-[700px]">
                            <h3 className="text-xl font-bold tracking-tight mb-6">Recent Activity</h3>
                            
                            {allTransactions.length === 0 ? (
                                <div className="flex-1 flex flex-col items-center justify-center text-center py-10 opacity-60">
                                    <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-4 border border-neutral-200">
                                        <Wallet className="text-neutral-400" size={24} />
                                    </div>
                                    <p className="text-neutral-900 font-bold text-lg mb-1">No transactions yet</p>
                                    <p className="text-neutral-500 font-medium text-sm px-4">When you send or receive money, it will show up here.</p>
                                </div>
                            ) : (
                                <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                                    {allTransactions.map((tx: any, i: number) => {
                                        const isSent = tx.type === 'sent';
                                        return (
                                            <div key={i} className="flex items-center justify-between p-4 rounded-2xl hover:bg-neutral-50 border border-transparent hover:border-neutral-100 transition-all group">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border ${isSent ? 'bg-neutral-50 border-neutral-200 text-neutral-600' : 'bg-emerald-50 border-emerald-100 text-emerald-600'}`}>
                                                        {isSent ? <ArrowUpRight size={20} strokeWidth={2.5} /> : <ArrowDownLeft size={20} strokeWidth={2.5} />}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-neutral-900">
                                                            {isSent ? tx.receiver.username : tx.sender.username}
                                                        </p>
                                                        <p className="text-xs text-neutral-500 font-medium mt-0.5">
                                                            {isSent ? 'Sent' : 'Received'}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className={`font-bold text-lg ${isSent ? 'text-neutral-900' : 'text-emerald-600'}`}>
                                                    {isSent ? '-' : '+'}₹{tx.amount}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}