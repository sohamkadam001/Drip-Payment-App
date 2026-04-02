"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
export default function Signup() {

    const [username, setusername] = useState("")
    const [email, setemail] = useState("")
    const [password, setpassword] = useState("")
    const Router = useRouter()
    const[loading,setloading] = useState(false)


    return <div>
        <div className="flex justify-center">
            This is the Signup Page
        </div>
        <div>
            Username : <input type="text" onChange={(e) => {
                setusername(e.target.value)
            }} placeholder="enter username"></input>
            <br></br>
            <br></br>
            Email : <input type="text" onChange={(e) => {
                setemail(e.target.value)
            }} placeholder="enter email"></input>
            <br></br>
            <br></br>
            Password : <input type="password" onChange={(e) => {
                setpassword(e.target.value)
            }} placeholder="enter password"></input>
            <br></br>
            <br></br>


            <button  disabled={loading} onClick={async () => {
                if (!username || !email || !password) {
                    alert("All fields required")
                    return
                }
                setloading(true)
                try{
                const res = await fetch("api/signup", {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    method: "POST",
                    body: JSON.stringify({
                        username,
                        email,
                        password
                    })
                })
                const data = await res.json();
                if (!res.ok) {
                    alert(data.msg || "Signup Failed")
                } else {
                    alert("signup success")
                    Router.push("/signin")
                }
            }catch(e){
                alert ("Signup Failed")
                console.log(e)
            }
                setloading(false)
            }}
            
            >
                {loading ? "Signing upp..." : "Sign Up"}
            </button>
        </div>
    </div>
}
