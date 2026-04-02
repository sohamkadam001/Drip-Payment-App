import { getuserid } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

export async function POST(req: Request) {
    try {
        const senderId = getuserid(req)
        const body = await req.json()


        const amount = Number(body.amount)
        const receiverId = Number(body.receiverId)

        if (!senderId || typeof senderId !== "number") {
            return Response.json({ msg: "Unauthorized" }, { status: 401 })
        }

        if (!amount || amount <= 0) {
            return Response.json({ msg: "Invalid amount" }, { status: 400 })
        }

        if (senderId === receiverId) {
            return Response.json({ msg: "Cannot self transfer" }, { status: 400 })
        }

        await prisma.$transaction(async (tx) => {

            const sender = await tx.balance.findFirst({
                where: { userId: senderId }
            })

            if (!sender) throw new Error("Sender not found")
            if (amount > sender.balance) throw new Error("Insufficient funds")

            const receiver = await tx.balance.findFirst({
                where: { userId: receiverId }
            })

            if (!receiver) throw new Error("Receiver not found")

            await tx.balance.update({
                where: { userId: senderId },
                data: {
                    balance: {
                        decrement: amount
                    }
                }
            })

            await tx.balance.update({
                where: { userId: receiverId },
                data: {
                    balance: {
                        increment: amount
                    }
                }
            })

            await tx.transaction.create({
                data: {
                    amount,
                    senderId,
                    receiverId
                }
            })
        })

        return Response.json({ msg: "Transaction Successful" })


    } catch (e: any) {
        return Response.json(
            { msg: e.message || "Transaction Failed" },
            { status: 400 }
        )
    }
}
export async function GET(req: Request) {
  const userId = getuserid(req)

  if (!userId) {
    return Response.json({ msg: "Unauthorized" }, { status: 401 })
  }

  const sent = await prisma.transaction.findMany({
    where: { senderId: userId },
    include: {
      receiver: {
        select: { username: true }
      }
    }
  })

  const received = await prisma.transaction.findMany({
    where: { receiverId: userId },
    include: {
      sender: {
        select: { username: true }
      }
    }
  })

  return Response.json({
    sent,
    received
  })
}