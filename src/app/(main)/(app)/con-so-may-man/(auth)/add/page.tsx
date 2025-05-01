'use client'

import { Container } from '@/components/container'
import dynamic from 'next/dynamic'

const FortuneNewEditForm = dynamic(
  () => import('@/sections/main/fortune/form/FortuneNewEditForm'),
  { ssr: false },
)

const TEST_DATA = {
  id: '',
  title: 'sổ xố may mắn',
  persons: [],
  prizes: [
    { key: 1, name: '🎟️ Giải Đặc Biệt', qty: 1 },
    { key: 2, name: '📱 Giải Nhất', qty: 1 },
    { key: 3, name: '📱 Giải Nhì', qty: 1 },
    { key: 4, name: '🎁 Giải Ba', qty: 1 },
    { key: 5, name: '💰 Giải Tư', qty: 1 },
    { key: 6, name: '💰 Giải khuyến khích', qty: 1 },
  ],
  winners: [],
  type: 'random',
}

export default function FortuneRandomAddPage() {
  return (
    <Container className="space-y-6 py-9">
      <FortuneNewEditForm currentData={TEST_DATA} addType="random" />
    </Container>
  )
}
