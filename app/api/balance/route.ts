import { getuserid } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

export async function GET(req : Request){
    const user =  getuserid(req)
    if(!user){
         return Response.json({ msg: "Unauthorized" }, { status: 401 })
    }
    const balance = await prisma.balance.findFirst({
        where : {
            userId : user
        }
    })
    return Response.json({
        balance
    })
    
}