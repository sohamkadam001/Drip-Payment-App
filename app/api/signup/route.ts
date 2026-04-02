import {z} from "zod";
import bcrypt from "bcrypt"
import { prisma } from "../../lib/prisma";

export async function POST(req : Request){
      const body = await req.json()
    try{
    const validator = z.object({
        username : z.string().min(3).max(8),
        email : z.string(),
        password : z.string().min(8).max(12)
    })
    const parser = validator.safeParse(body)
    if(!parser.success){
        return Response.json({
        error : parser.error
        })
    }

    const {username,email,password} = parser.data
     const hashed = await bcrypt.hash(password,10)
    const user = await prisma.user.create({
        data : {
            username,
            email,
            password : hashed
        }
    })
    const balance = await prisma.balance.create({
        data : {
            balance : Math.random()*1000 + 1,
            userId : user.id
        }
 })
    return Response.json({
        msg : "User Created Successfully",
        balance
    })
}catch(e){
    return Response.json({
        message : "Something went Wrong"
    })
}

}

