import { getuserid } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const senderId = getuserid(req as any);
        const body = await req.json();

        const amount = Number(body.amount);
        const receiverId = Number(body.receiverId);

        // 1. Validation Layer
        if (!senderId || typeof senderId !== "number") {
            return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
        }

        if (!amount || amount <= 0) {
            return NextResponse.json({ msg: "Invalid transfer amount" }, { status: 400 });
        }

        if (senderId === receiverId) {
            return NextResponse.json({ msg: "Cannot transfer funds to yourself" }, { status: 400 });
        }

        // 2. Atomic Database Transaction
        await prisma.$transaction(async (tx: any) => {
            // Use findUnique if userId is marked @unique in schema, otherwise findFirst is safe
            const sender = await tx.balance.findFirst({
                where: { userId: senderId }
            });

            if (!sender) throw new Error("Sender account not found");
            if (amount > sender.balance) throw new Error("Insufficient funds");

            const receiver = await tx.balance.findFirst({
                where: { userId: receiverId }
            });

            if (!receiver) throw new Error("Receiver account not found");

            // Deduct from sender
            await tx.balance.update({
                where: { userId: senderId },
                data: {
                    balance: { decrement: amount }
                }
            });

            // Credit to receiver
            await tx.balance.update({
                where: { userId: receiverId },
                data: {
                    balance: { increment: amount }
                }
            });

            // Record ledger entry
            await tx.transaction.create({
                data: {
                    amount,
                    senderId,
                    receiverId
                }
            });
        });

        return NextResponse.json({ msg: "Transaction Successful" }, { status: 200 });

    } catch (e: any) {
        console.error("Ledger Error:", e);
        return NextResponse.json(
            { msg: e.message || "Transaction processing failed" },
            { status: 400 }
        );
    }
}

export async function GET(req: NextRequest) {
    try {
        const userId = getuserid(req as any);

        if (!userId) {
            return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
        }

        // Fetch sent transactions ordered newest first
        const sent = await prisma.transaction.findMany({
            where: { senderId: userId },
            include: {
                receiver: { select: { username: true } }
            },
            orderBy: { id: 'desc' },
            take: 20 // Optimize payload size
        });

        // Fetch received transactions ordered newest first
        const received = await prisma.transaction.findMany({
            where: { receiverId: userId },
            include: {
                sender: { select: { username: true } }
            },
            orderBy: { id: 'desc' },
            take: 20 // Optimize payload size
        });

        return NextResponse.json({ sent, received }, { status: 200 });

    } catch (error) {
        console.error("History Fetch Error:", error);
        return NextResponse.json({ msg: "Failed to fetch ledger history" }, { status: 500 });
    }
}