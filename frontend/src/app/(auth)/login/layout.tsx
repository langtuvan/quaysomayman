import { GuestGuard } from '@/auth/guard'

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <GuestGuard>{children}</GuestGuard>
}
