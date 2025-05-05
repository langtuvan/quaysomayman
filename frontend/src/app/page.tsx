import { Button } from '@/components/button'
import { Container } from '@/components/container'
import { Gradient } from '@/components/gradient'
import { Link } from '@/components/link'
import { Navbar } from '@/components/navbar'
import { ChevronRightIcon } from '@heroicons/react/16/solid'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Vòng Quay May Mắn - Quay Là Trúng, Nhận Quà Cực Đỉnh!',
  description:
    'Tham gia Vòng Quay May Mắn ngay hôm nay để có cơ hội nhận nhiều phần quà hấp dẫn. Quay miễn phí, trúng thưởng thật, cơ hội dành cho tất cả mọi người!',
  keywords: [
    'vòng quay may mắn',
    'quay trúng thưởng',
    'trò chơi trúng thưởng',
    'game trúng quà',
    'mini game quay số',
    'nhận quà miễn phí',
  ],
}

function Hero() {
  return (
    <div className="relative">
      <Gradient className="absolute inset-2 bottom-0 rounded-4xl ring-1 ring-black/5 ring-inset" />
      <Container className="relative">
        <Navbar
          banner={
            <Link
              href="/blog/radiant-raises-100m-series-a-from-tailwind-ventures"
              className="flex items-center gap-1 rounded-full bg-fuchsia-950/35 px-3 py-0.5 text-sm/6 font-medium text-white data-hover:bg-fuchsia-950/30"
            >
              Radiant raises $100M Series A from Tailwind Ventures
              <ChevronRightIcon className="size-4" />
            </Link>
          }
        />
        <div className="pt-16 pb-24 sm:pt-24 sm:pb-32 md:pt-32 md:pb-48">
          <h1 className="font-display text-6xl/[0.9] font-medium tracking-tight text-balance text-gray-950 sm:text-8xl/[0.8] md:text-9xl/[0.8]">
            May Mắn.
          </h1>
          <p className="mt-8 max-w-lg text-xl/7 font-medium text-gray-950/75 sm:text-2xl/8">
            Vòng Quay May Mắn - Quay Là Trúng, Nhận Quà Cực Đỉnh!
          </p>
          <div className="mt-12 flex flex-col gap-x-6 gap-y-4 sm:flex-row">
            <Button href="vong-quay-may-man">Bắt Đầu</Button>
            <Button variant="secondary" href="/gioi-thieu">
              Giới thiệu
            </Button>
          </div>
        </div>
      </Container>
    </div>
  )
}

export default function Home() {
  return (
    <div className="overflow-hidden">
      <main className="pb-2">
        <Hero />
      </main>
    </div>
  )
}
