// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import  prisma  from "@/lib/prisma_client";

export async function POST(req: NextRequest) {
  try {
    const { email, password ,username} = await req.json()

    const user = await prisma.user.findUnique({ where: { email } })
    if (user) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 })
    }
    const hashPassword = await bcrypt.hash(password, 10)
    const newUser = await prisma.user.create({
      data: {
        name: username,
        password: hashPassword,
        email,
      },
    })
    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    })


    // Store token in DB (optional)
    await prisma.user.update({
      where: { email},
      data: { token },
    })

    return NextResponse.json({ message: "Logged in", token })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}
