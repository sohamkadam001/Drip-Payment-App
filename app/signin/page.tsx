"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

export default function Signin(){
    const [email, setemail] = useState("")
    const [password, setpassword] = useState("")
    const Router = useRouter();
       const[loading,setloading] = useState(false)
    return <div>
        <div className="flex justify-center">
            Signin
        </div>
        <div>
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

            <button disabled = {loading} onClick={async()=>{
                setloading(true)
                try{
                const res = await fetch("/api/signin",{
                    method : "POST",
                    headers : {
                        "Content-Type": "application/json"
                    },
                    body : JSON.stringify({
                        email,
                        password
                    })
                })
                const data = await res.json();
                if(!res.ok){
                    alert(data.msg || "Signin Failed")
                }else{
                    localStorage.setItem("token",data.token)
                    alert("Sign in Successfull")
                    Router.push("/dashboard")

                }
            }catch(e){
                alert ("Sign in Failed")
            }
            setloading(false)
            }}>{loading ? "Signing in..." : "Sign in"}</button>
        </div>
    </div>
}