import { prisma } from "@/app/lib/prisma"
import { getuserid } from "@/app/lib/auth"

export async function GET(req: Request) {
  const userId = getuserid(req)

  if (!userId) {
    return Response.json({ msg: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const query = searchParams.get("query") || ""

  const users = await prisma.user.findMany({
    where: {
      username: {
        contains: query,
        mode: "insensitive"
      },
      NOT: {
        id: userId
      }
    },
    select: {
      id: true,
      username: true
    }
  })

  return Response.json({ users })
}