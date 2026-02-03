// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import  prisma  from "@/lib/prisma_client" 

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // Compare passwords
    const valid = await bcrypt.compare(password, user?.password)
    if (!valid) {
      return NextResponse.json({ message: "Invalid password" }, { status: 401 })
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    })

    // Store token in DB (optional)
    await prisma.user.update({
      where: { id: user.id },
      data: { token },
    })

    return NextResponse.json({ message: "Logged in", token })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}
