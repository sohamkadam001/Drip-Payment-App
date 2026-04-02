import jwt from "jsonwebtoken"
export function getuserid(req : Request){
    const header = req.headers.get("authorization")
    if(!header || !header.startsWith("Bearer")){
        return Response.json({
            msg : "Auth failed"
        })
    }
    const token = header.split(" ")[1]

    if (!process.env.JWT_SECRET ) {
    throw new Error("JWT_SECRET not defined");
  }
try {
    const decode  = jwt.verify(token,process.env.JWT_SECRET) as {
        id : number;
    }
    return (decode as any).id
}catch(e){
    return null
}
}







