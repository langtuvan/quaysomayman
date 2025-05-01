'use client'
import { AuthGuard } from '@/auth/guard'

export default function CheckUserAuth({
  children,
}: {
  children: React.ReactNode
}) {
  return <AuthGuard>{children}</AuthGuard>
}
