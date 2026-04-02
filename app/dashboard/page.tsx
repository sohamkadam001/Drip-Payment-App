"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function Dashboard() {
    const router = useRouter()

    const [authorized, setAuthorized] = useState(false)
    const [balance, setBalance] = useState<number | null>(null)

    const [search, setSearch] = useState("")
    const [users, setUsers] = useState<any[]>([])
    const [selectedUser, setSelectedUser] = useState<number | null>(null)
    const [amount, setAmount] = useState("")
    const [loading, setLoading] = useState(false)

    const [transactions, setTransactions] = useState<any>({ sent: [], received: [] })

    useEffect(() => {
        const token = localStorage.getItem("token")


        if (!token) {
            alert("You are not Signed In")
            router.push("/signin")
            return
        }

        setAuthorized(true)


        fetch("/api/balance", {
            headers: {
                authorization: `Bearer ${token}`
            }
        })
            .then(res => {
                if (res.status === 401) router.push("/signin")
                return res.json()
            })
            .then(data => setBalance(data.balance.balance))


        fetch("/api/transaction", {
            headers: {
                authorization: `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(data => setTransactions(data))


    }, [])


    const searchUsers = async (value: string) => {
        setSearch(value)


        const token = localStorage.getItem("token")

        if (!value) {
            setUsers([])
            return
        }

        const res = await fetch(`/api/users?query=${value}`, {
            headers: {
                authorization: `Bearer ${token}`
            }
        })

        const data = await res.json()
        setUsers(data.users)


    }

    const sendMoney = async () => {
        if (!amount || !selectedUser) {
            alert("Enter amount and select user")
            return
        }


        setLoading(true)

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
                    receiverId: selectedUser
                })
            })

            const data = await res.json()

            if (!res.ok) {
                alert(data.msg || "Transaction failed")
            } else {
                alert("Transaction successful!!!")

                setAmount("")
                setSelectedUser(null)


                const balRes = await fetch("/api/balance", {
                    headers: {
                        authorization: `Bearer ${token}`
                    }
                })
                const balData = await balRes.json()
                setBalance(balData.balance.balance)

                const txRes = await fetch("/api/transaction", {
                    headers: {
                        authorization: `Bearer ${token}`
                    }
                })
                const txData = await txRes.json()
                setTransactions(txData)
            }

        } catch {
            alert("Network error")
        }

        setLoading(false)


    }

    if (!authorized) return <div className="p-6">Loading...</div>

    return (<div className="p-6">



        <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold">My Dashboard</h1>

            <button
                onClick={() => {
                    localStorage.removeItem("token")
                    router.push("/")
                }}
                className="bg-red-500 text-white px-3 py-1"
            >
                Logout
            </button>
        </div>

        <h2 className="mt-4 text-lg">
            Balance: {balance !== null ? `₹${balance}` : "Loading..."}
        </h2>


        <div className="mt-6">
            <input
                type="text"
                placeholder="Search users..."
                value={search}
                onChange={(e) => searchUsers(e.target.value)}
                className="border p-2 w-full"
            />
        </div>


        <div className="mt-4">
            {users.map((user) => (
                <div key={user.id} className="flex justify-between p-2 border mt-2">
                    <span>{user.username}</span>
                    <button
                        onClick={() => setSelectedUser(user.id)}
                        className="bg-blue-500 text-white px-2"
                    >
                        Send Money
                    </button>
                </div>
            ))}
        </div>


        {selectedUser && (
            <div className="mt-6">
                <h3 className="mb-2">Send Money</h3>

                <input
                    type="number"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="border p-2"
                />

                <button
                    onClick={sendMoney}
                    disabled={loading}
                    className="bg-green-500 text-white px-3 ml-2"
                >
                    {loading ? "Sending..." : "Send"}
                </button>
            </div>
        )}


        <div className="mt-10">
            <h2 className="text-lg font-semibold mb-2">Transactions</h2>


            <div>
                <h3 className="font-medium">Sent</h3>
                {transactions.sent.map((tx: any, i: number) => (
                    <div key={i} className="text-red-400">
                        ₹{tx.amount} → {tx.receiver.username}
                    </div>
                ))}
            </div>

            <div className="mt-4">
                <h3 className="font-medium">Received</h3>
                {transactions.received.map((tx: any, i: number) => (
                    <div key={i} className="text-green-400">
                        ₹{tx.amount} ← {tx.sender.username}
                    </div>
                ))}
            </div>
        </div>

    </div>


    )
}
