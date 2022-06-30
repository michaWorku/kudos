
import type { RegisterForm } from './types.server'
import { prisma } from './prisma.server'
import { json } from '@remix-run/node'

export async function register(user: RegisterForm) {
  const exists = await prisma.user.count({ where: { email: user.email } })
  if (exists) {
    return json({ error: `User already exists with that email` }, { status: 400 })
  }
}