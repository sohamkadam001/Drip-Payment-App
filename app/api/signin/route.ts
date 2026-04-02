import { prisma } from "@/app/lib/prisma";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
const JWT_SECRET = process.env.JWT_SECRET

export async function POST(req : Request){
    const body = await req.json();
    const{email,password} = body
   const user =  await prisma.user.findFirst({
        where : {
            email
        }
    })
    if(!user){
        Response.json({
            message : "User does not exist"
        })
        return
    }
    const matchpass = await bcrypt.compare(password,user.password)
    if(!matchpass){
        return Response.json({
            message : "Invalid Credentials"
        })
    }
        const token = jwt.sign({id : user.id},JWT_SECRET as string)
        return Response.json({
            token
        })
    
}