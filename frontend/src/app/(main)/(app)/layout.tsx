import { Container } from '@/components/container'
import { Gradient } from '@/components/gradient'
import { Link } from '@/components/link'
import { Navbar } from '@/components/navbar'
import { ChevronRightIcon } from '@heroicons/react/16/solid'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'May Mắn - Quay Là Trúng, Nhận Quà Cực Đỉnh!',
  description:
    'Tham gia Con Số May Mắn ngay hôm nay để có cơ hội nhận nhiều phần quà hấp dẫn. Quay miễn phí, trúng thưởng thật, cơ hội dành cho tất cả mọi người!',
  keywords: [
    'vòng quay may mắn',
    'quay trúng thưởng',
    'trò chơi trúng thưởng',
    'game trúng quà',
    'mini game quay số',
    'nhận quà miễn phí',
  ],
}

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="overflow-hidden">
      <main className="pb-2">
        <div className="relative min-h-screen">
          <Gradient className="absolute inset-2 bottom-0 rounded-4xl ring-1 ring-black/5 ring-inset" />
          <Container className="relative">
            <Navbar
              banner={
                <Link
                  href="#"
                  className="flex items-center gap-1 rounded-full bg-fuchsia-950/35 px-3 py-0.5 text-sm/6 font-medium text-white data-hover:bg-fuchsia-950/30"
                >
                  Radiant raises $100M Series A from Tailwind Ventures
                  <ChevronRightIcon className="size-4" />
                </Link>
              }
            />
            <div className="pt-16 pb-24 sm:pt-24 sm:pb-32 md:pt-32 md:pb-48">
              {children}
            </div>
          </Container>
        </div>
      </main>
    </div>
  )
}
