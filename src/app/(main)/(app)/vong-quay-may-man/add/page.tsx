'use client'
import { AuthGuard } from '@/auth/guard'
import dynamic from 'next/dynamic'

const FortuneNewEditForm = dynamic(
  () => import('@/sections/main/fortune/form/FortuneNewEditForm'),
  { ssr: false },
)

const TEST_DATA = {
  id: '',
  title: 'Vòng quay may mắn',
  persons: [],
  prizes: [
    { key: 1, name: '📱 iPhone 15', qty: 1 },
    { key: 2, name: '📱 laptop Dell', qty: 1 },
    { key: 3, name: '📱 Tivi', qty: 1 },
    { key: 4, name: '🎁 Quà Bí Mật', qty: 1 },
    { key: 5, name: '💰 Voucher 1.000K', qty: 1 },
    { key: 6, name: '💰 Voucher 500K', qty: 1 },
    { key: 7, name: '💰 Voucher 200K', qty: 2 },
    { key: 8, name: '🎟️ May mắn lần sau', qty: 10 },
  ],
  winners: [],
  type: 'wheel',
}

export default function FortuneWheelAddPage() {
  return (
    <AuthGuard>
      <FortuneNewEditForm currentData={TEST_DATA} addType="wheel" />
    </AuthGuard>
  )
}
