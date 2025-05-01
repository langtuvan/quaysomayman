import { Button } from '@/components/button'
import { Container } from '@/components/container'
import { Footer } from '@/components/footer'
import { Gradient, GradientBackground } from '@/components/gradient'
import { Link } from '@/components/link'
import { Navbar } from '@/components/navbar'
import { Heading, Lead, Subheading } from '@/components/text'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import {
  CheckIcon,
  ChevronRightIcon,
  ChevronUpDownIcon,
  MinusIcon,
} from '@heroicons/react/16/solid'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Giới Thiệu',
  description:
    'Tham gia Con Số May Mắn ngay hôm nay để có cơ hội nhận nhiều phần quà hấp dẫn. Quay miễn phí, trúng thưởng thật, cơ hội dành cho tất cả mọi người!',
}

const tiers = [
  {
    name: 'Starter' as const,
    slug: 'starter',
    description: 'Everything you need to start selling.',
    priceMonthly: 99,
    href: '#',
    highlights: [
      { description: 'Up to 3 team members' },
      { description: 'Up to 5 deal progress boards' },
      { description: 'Source leads from select platforms' },
      { description: 'RadiantAI integrations', disabled: true },
      { description: 'Competitor analysis', disabled: true },
    ],
    features: [
      { section: 'Features', name: 'Accounts', value: 3 },
      { section: 'Features', name: 'Deal progress boards', value: 5 },
      { section: 'Features', name: 'Sourcing platforms', value: 'Select' },
      { section: 'Features', name: 'Contacts', value: 100 },
      { section: 'Features', name: 'AI assisted outreach', value: false },
      { section: 'Analysis', name: 'Competitor analysis', value: false },
      { section: 'Analysis', name: 'Dashboard reporting', value: false },
      { section: 'Analysis', name: 'Community insights', value: false },
      { section: 'Analysis', name: 'Performance analysis', value: false },
      { section: 'Support', name: 'Email support', value: true },
      { section: 'Support', name: '24 / 7 call center support', value: false },
      { section: 'Support', name: 'Dedicated account manager', value: false },
    ],
  },
  // {
  //   name: 'Growth' as const,
  //   slug: 'growth',
  //   description: 'All the extras for your growing team.',
  //   priceMonthly: 149,
  //   href: '#',
  //   highlights: [
  //     { description: 'Up to 10 team members' },
  //     { description: 'Unlimited deal progress boards' },
  //     { description: 'Source leads from over 50 verified platforms' },
  //     { description: 'RadiantAI integrations' },
  //     { description: '5 competitor analyses per month' },
  //   ],
  //   features: [
  //     { section: 'Features', name: 'Accounts', value: 10 },
  //     { section: 'Features', name: 'Deal progress boards', value: 'Unlimited' },
  //     { section: 'Features', name: 'Sourcing platforms', value: '100+' },
  //     { section: 'Features', name: 'Contacts', value: 1000 },
  //     { section: 'Features', name: 'AI assisted outreach', value: true },
  //     { section: 'Analysis', name: 'Competitor analysis', value: '5 / month' },
  //     { section: 'Analysis', name: 'Dashboard reporting', value: true },
  //     { section: 'Analysis', name: 'Community insights', value: true },
  //     { section: 'Analysis', name: 'Performance analysis', value: true },
  //     { section: 'Support', name: 'Email support', value: true },
  //     { section: 'Support', name: '24 / 7 call center support', value: true },
  //     { section: 'Support', name: 'Dedicated account manager', value: false },
  //   ],
  // },
  // {
  //   name: 'Enterprise' as const,
  //   slug: 'enterprise',
  //   description: 'Added flexibility to close deals at scale.',
  //   priceMonthly: 299,
  //   href: '#',
  //   highlights: [
  //     { description: 'Unlimited active team members' },
  //     { description: 'Unlimited deal progress boards' },
  //     { description: 'Source leads from over 100 verified platforms' },
  //     { description: 'RadiantAI integrations' },
  //     { description: 'Unlimited competitor analyses' },
  //   ],
  //   features: [
  //     { section: 'Features', name: 'Accounts', value: 'Unlimited' },
  //     { section: 'Features', name: 'Deal progress boards', value: 'Unlimited' },
  //     { section: 'Features', name: 'Sourcing platforms', value: '100+' },
  //     { section: 'Features', name: 'Contacts', value: 'Unlimited' },
  //     { section: 'Features', name: 'AI assisted outreach', value: true },
  //     { section: 'Analysis', name: 'Competitor analysis', value: 'Unlimited' },
  //     { section: 'Analysis', name: 'Dashboard reporting', value: true },
  //     { section: 'Analysis', name: 'Community insights', value: true },
  //     { section: 'Analysis', name: 'Performance analysis', value: true },
  //     { section: 'Support', name: 'Email support', value: true },
  //     { section: 'Support', name: '24 / 7 call center support', value: true },
  //     { section: 'Support', name: 'Dedicated account manager', value: true },
  //   ],
  // },
]

function Header() {
  return (
    <Container className="mt-16">
      <Heading as="h1">Pricing that grows with your team size.</Heading>
      <Lead className="mt-6 max-w-3xl">
        Companies all over the world have closed millions of deals with Radiant.
        Sign up today and start selling smarter.
      </Lead>
    </Container>
  )
}

function PricingCards() {
  return (
    <div className="relative py-24">
      <Gradient className="absolute inset-x-2 top-48 bottom-0 rounded-4xl ring-1 ring-black/5 ring-inset" />
      <Container className="relative">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {tiers.map((tier, tierIndex) => (
            <PricingCard key={tierIndex} tier={tier} />
          ))}
        </div>
        {/* <LogoCloud className="mt-24" /> */}
      </Container>
    </div>
  )
}

function PricingCard({ tier }: { tier: (typeof tiers)[number] }) {
  return (
    <div className="-m-2 grid grid-cols-1 rounded-4xl shadow-[inset_0_0_2px_1px_#ffffff4d] ring-1 ring-black/5 max-lg:mx-auto max-lg:w-full max-lg:max-w-md">
      <div className="grid grid-cols-1 rounded-4xl p-2 shadow-md shadow-black/5">
        <div className="rounded-3xl bg-white p-10 pb-9 shadow-2xl ring-1 ring-black/5">
          <Subheading>{tier.name}</Subheading>
          <p className="mt-2 text-sm/6 text-gray-950/75">{tier.description}</p>
          <div className="mt-8 flex items-center gap-4">
            <div className="text-5xl font-medium text-gray-950">
              ${tier.priceMonthly}
            </div>
            <div className="text-sm/5 text-gray-950/75">
              <p>USD</p>
              <p>per month</p>
            </div>
          </div>
          <div className="mt-8">
            <Button href={tier.href}>Start a free trial</Button>
          </div>
          <div className="mt-8">
            <h3 className="text-sm/6 font-medium text-gray-950">
              Start selling with:
            </h3>
            <ul className="mt-3 space-y-3">
              {tier.highlights.map((props, featureIndex) => (
                <FeatureItem key={featureIndex} {...props} />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

function PricingTable({
  selectedTier,
}: {
  selectedTier: (typeof tiers)[number]
}) {
  return (
    <Container className="py-24">
      <table className="w-full text-left">
        <caption className="sr-only">Pricing plan comparison</caption>
        <colgroup>
          <col className="w-3/5 sm:w-2/5" />
          <col
            data-selected={selectedTier === tiers[0] ? true : undefined}
            className="w-2/5 data-selected:table-column max-sm:hidden sm:w-1/5"
          />
          <col
            data-selected={selectedTier === tiers[1] ? true : undefined}
            className="w-2/5 data-selected:table-column max-sm:hidden sm:w-1/5"
          />
          <col
            data-selected={selectedTier === tiers[2] ? true : undefined}
            className="w-2/5 data-selected:table-column max-sm:hidden sm:w-1/5"
          />
        </colgroup>
        <thead>
          <tr className="max-sm:hidden">
            <td className="p-0" />
            {tiers.map((tier) => (
              <th
                key={tier.slug}
                scope="col"
                data-selected={selectedTier === tier ? true : undefined}
                className="p-0 data-selected:table-cell max-sm:hidden"
              >
                <Subheading as="div">{tier.name}</Subheading>
              </th>
            ))}
          </tr>
          <tr className="sm:hidden">
            <td className="p-0">
              <div className="relative inline-block">
                <Menu>
                  <MenuButton className="flex items-center justify-between gap-2 font-medium">
                    {selectedTier.name}
                    <ChevronUpDownIcon className="size-4 fill-gray-900" />
                  </MenuButton>
                  <MenuItems
                    anchor="bottom start"
                    className="min-w-(--button-width) rounded-lg bg-white p-1 shadow-lg ring-1 ring-gray-200 [--anchor-gap:6px] [--anchor-offset:-4px] [--anchor-padding:10px]"
                  >
                    {tiers.map((tier) => (
                      <MenuItem key={tier.slug}>
                        <Link
                          scroll={false}
                          href={`/pricing?tier=${tier.slug}`}
                          data-selected={
                            tier === selectedTier ? true : undefined
                          }
                          className="group flex items-center gap-2 rounded-md px-2 py-1 data-focus:bg-gray-200"
                        >
                          {tier.name}
                          <CheckIcon className="hidden size-4 group-data-selected:block" />
                        </Link>
                      </MenuItem>
                    ))}
                  </MenuItems>
                </Menu>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center">
                  <ChevronUpDownIcon className="size-4 fill-gray-900" />
                </div>
              </div>
            </td>
            <td colSpan={3} className="p-0 text-right">
              <Button variant="outline" href={selectedTier.href}>
                Get started
              </Button>
            </td>
          </tr>
          <tr className="max-sm:hidden">
            <th className="p-0" scope="row">
              <span className="sr-only">Get started</span>
            </th>
            {tiers.map((tier) => (
              <td
                key={tier.slug}
                data-selected={selectedTier === tier ? true : undefined}
                className="px-0 pt-4 pb-0 data-selected:table-cell max-sm:hidden"
              >
                <Button variant="outline" href={tier.href}>
                  Get started
                </Button>
              </td>
            ))}
          </tr>
        </thead>
        {[...new Set(tiers[0].features.map(({ section }) => section))].map(
          (section) => (
            <tbody key={section} className="group">
              <tr>
                <th
                  scope="colgroup"
                  colSpan={4}
                  className="px-0 pt-10 pb-0 group-first-of-type:pt-5"
                >
                  <div className="-mx-4 rounded-lg bg-gray-50 px-4 py-3 text-sm/6 font-semibold">
                    {section}
                  </div>
                </th>
              </tr>
              {tiers[0].features
                .filter((feature) => feature.section === section)
                .map(({ name }) => (
                  <tr
                    key={name}
                    className="border-b border-gray-100 last:border-none"
                  >
                    <th
                      scope="row"
                      className="px-0 py-4 text-sm/6 font-normal text-gray-600"
                    >
                      {name}
                    </th>
                    {tiers.map((tier) => {
                      let value = tier.features.find(
                        (feature) =>
                          feature.section === section && feature.name === name,
                      )?.value

                      return (
                        <td
                          key={tier.slug}
                          data-selected={
                            selectedTier === tier ? true : undefined
                          }
                          className="p-4 data-selected:table-cell max-sm:hidden"
                        >
                          {value === true ? (
                            <>
                              <CheckIcon className="size-4 fill-green-600" />
                              <span className="sr-only">
                                Included in {tier.name}
                              </span>
                            </>
                          ) : value === false || value === undefined ? (
                            <>
                              <MinusIcon className="size-4 fill-gray-400" />
                              <span className="sr-only">
                                Not included in {tier.name}
                              </span>
                            </>
                          ) : (
                            <div className="text-sm/6">{value}</div>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}
            </tbody>
          ),
        )}
      </table>
    </Container>
  )
}

function FeatureItem({
  description,
  disabled = false,
}: {
  description: string
  disabled?: boolean
}) {
  return (
    <li
      data-disabled={disabled ? true : undefined}
      className="flex items-start gap-4 text-sm/6 text-gray-950/75 data-disabled:text-gray-950/25"
    >
      <span className="inline-flex h-6 items-center">
        <PlusIcon className="size-[0.9375rem] shrink-0 fill-gray-950/25" />
      </span>
      {disabled && <span className="sr-only">Not included:</span>}
      {description}
    </li>
  )
}

function PlusIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 15 15" aria-hidden="true" {...props}>
      <path clipRule="evenodd" d="M8 0H7v7H0v1h7v7h1V8h7V7H8V0z" />
    </svg>
  )
}

function Testimonial() {
  return (
    <div className="mx-2 my-24 rounded-4xl bg-gray-900 bg-[url(/dot-texture.svg)] pt-72 pb-24 lg:pt-36">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-[384px_1fr_1fr]">
          <div className="-mt-96 lg:-mt-52">
            <div className="-m-2 rounded-4xl bg-white/15 shadow-[inset_0_0_2px_1px_#ffffff4d] ring-1 ring-black/5 max-lg:mx-auto max-lg:max-w-xs">
              <div className="rounded-4xl p-2 shadow-md shadow-black/5">
                <div className="overflow-hidden rounded-3xl shadow-2xl outline outline-1 -outline-offset-1 outline-black/10">
                  <img
                    alt=""
                    src="/testimonials/tina-yards.jpg"
                    className="aspect-3/4 w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex max-lg:mt-16 lg:col-span-2 lg:px-16">
            <figure className="mx-auto flex max-w-xl flex-col gap-16 max-lg:text-center">
              <blockquote>
                <p className="relative text-3xl tracking-tight text-white before:absolute before:-translate-x-full before:content-['“'] after:absolute after:content-['”'] lg:text-4xl">
                  Thanks to Radiant, we&apos;re finding new leads that we never
                  would have found with legal methods.
                </p>
              </blockquote>
              <figcaption className="mt-auto">
                <p className="text-sm/6 font-medium text-white">Tina Yards</p>
                <p className="text-sm/6 font-medium">
                  <span className="bg-linear-to-r from-[#fff1be] from-28% via-[#ee87cb] via-70% to-[#b060ff] bg-clip-text text-transparent">
                    VP of Sales, Protocol
                  </span>
                </p>
              </figcaption>
            </figure>
          </div>
        </div>
      </Container>
    </div>
  )
}

function HuongDan() {
  return (
    <Container className="mt-24">
      <section id="huongdan" className="scroll-mt-8">
        <Subheading className="text-center">May Mắn</Subheading>
        <Heading as="div" className="mt-2 text-center capitalize">
          Hướng dẫn sử dụng
        </Heading>
        <div className="mx-auto mt-16 mb-32 max-w-xl space-y-12">
          <dl>
            <dt className="text-sm font-semibold">
              Tạo mới: Đăng nhập với Google
            </dt>
            <dd className="mt-4 text-sm/6 text-gray-600">
              Lưu ý: mỗi tài khoản được tạo tối đa 3 chương trình cho mỗi loại,
              để được tạo thêm nhiều hơn vui long liên hệ admin :
              langtuvan@hotmail.com
            </dd>
          </dl>
          <dl>
            <dt className="text-sm font-semibold capitalize">
              Chương trình bao gồm
            </dt>
            <dd className="mt-4 text-sm/6 text-gray-600">
              <ul className="mb-6 list-disc pl-5 text-sm/6 leading-8 text-gray-600">
                <li>
                  Tên chương trình: ví dụ: Bốc số trúng thưởng công ty ABC, Vòng
                  quay may mắn
                </li>
                <li>
                  Ghi Chú: nhập các ghi chú theo mốc thời gian mà bạn muốn lưu
                  lại cho lần tiếp theo
                </li>
                <li>
                  Giải Thưởng: Nhập giải thưởng và số lượng giải (Tối đa 8 giải)
                  Giải thưởng nào đã có người trúng thì không thể xóa và sữa
                  tên, có thể tăng và giảm số lượng
                </li>
                <li>
                  Người Chơi Nhập mỗi 1 dòng: Mã nhân viên + Họ Tên (Enter) Nhập
                  dòng tiếp theo  Bấm nút Thêm
                </li>
                <li>Trúng Giải: Hiển thị danh sách Người chơi đã trúng giải</li>
              </ul>
              Bấm nút Lưu để hoàn tất lưu lại Bạn có thể Tùy chỉnh. Bấm vào Danh
              Sách , Chọn chương trình, bấm nút Tùy Chỉnh để chỉnh sữa , Bấm nút
              Quay để Chạy chương trình
            </dd>
          </dl>
          <dl>
            <dt className="text-sm font-semibold">Chạy Chương Trình:</dt>
            <dd className="mt-4 text-sm/6 text-gray-600">
              Click vào Danh Sách, chọn chương trình, bấm nút Quay
            </dd>
          </dl>
        </div>
      </section>
    </Container>
  )
}

function UngDung() {
  return (
    <Container className="mt-24">
      <section id="ungdung" className="scroll-mt-8">
        <Subheading className="text-center">May Mắn</Subheading>
        <Heading as="div" className="mt-2 text-center capitalize">
          Các trường hợp sử dụng
        </Heading>
        <div className="mx-auto mt-16 mb-32 max-w-xl space-y-12">
          <dl>
            <dt className="text-sm font-semibold">Trong ngành giáo dục:</dt>
            <dd className="mt-4 text-sm/6 text-gray-600">
              <p>
                Giáo viên có thể tạo ra vòng quay ngẫu nhiên chứa danh sách học
                sinh của các lớp học khác nhau để gọi ngẫu nhiên một học sinh
                trả lời câu hỏi. Ngoài ra, các phần thưởng cho học sinh xuất sắc
                có thể được đưa vào vòng quay random để tăng tính hứng thú trong
                lớp học.
              </p>
              <p className="mt-4">
                Đối với các trung tâm ngoại ngữ, có thể sử dụng vòng quay mini
                game để quay thưởng những món quà như sách, bút, đồ chơi, đồ
                dùng học tập, hoặc voucher khóa học. Đây là cách hiệu quả để tạo
                động lực học tập và tăng sự tương tác giữa trung tâm và học
                viên.
              </p>
            </dd>
          </dl>

          <dl>
            <dt className="text-sm font-semibold">Trò chơi và giải trí:</dt>
            <dd className="spcace-y-4 mt-4 text-sm/6 text-gray-600">
              Trò chơi vòng quay may mắn là một phần không thể thiếu trong các
              trò bốc thăm trúng thưởng, hoặc dùng làm game vòng quay sai khiến
              để quyết định ai phải thực hiện nhiệm vụ nào. Trong các buổi tiệc
              hoặc bàn nhậu, bánh xe may rủi có thể sử dụng để xác định ai phải
              uống bia, rượu hoặc ăn món đặc biệt nào đó.
            </dd>
          </dl>

          <dl>
            <dt className="text-sm font-semibold">Quyết định cá nhân:</dt>
            <dd className="spcace-y-4 mt-4 text-sm/6 text-gray-600">
              Khi phải đứng trước nhiều lựa chọn và không biết nên chọn cái nào,
              vòng quay quyết định có thể là giải pháp thú vị và nhanh chóng để
              đưa ra quyết định một cách khách quan. Những tình huống phổ biến
              như lựa chọn tên cho con, chọn địa điểm du lịch, hoặc thậm chí
              chọn món ăn cho bữa tối đều có thể trở nên đơn giản với vòng quay
              ngẫu nhiên.
            </dd>
          </dl>

          <dl>
            <dt className="text-sm font-semibold">Trong kinh doanh:</dt>
            <dd className="spcace-y-4 mt-4 text-sm/6 text-gray-600">
              Các doanh nghiệp có thể sử dụng vòng quay may mắn trong các chương
              trình khuyến mãi nhằm thu hút sự chú ý của khách hàng. Thay vì
              khuyến mãi theo cách thông thường, hãy để khách hàng tự quay số
              may mắn để nhận các phần quà ngẫu nhiên. Điều này không chỉ tăng
              sự phấn khích mà còn tạo cảm giác khách hàng là người may mắn khi
              nhận được phần quà.
            </dd>
          </dl>
        </div>
      </section>
    </Container>
  )
}

function DichVu() {
  return (
    <Container className="mt-24">
      <section id="dichvu" className="scroll-mt-8">
        <Subheading className="text-center">Dịch vụ</Subheading>
        <Heading as="div" className="mt-2 text-center capitalize">
          Website App
        </Heading>
        <div className="mx-auto mt-16 mb-32 max-w-xl space-y-12">
          <dl>
            <dt className="text-sm font-semibold">
              Viết Phầm mềm theo yêu cầu:
            </dt>
            <dd className="mt-4 text-sm/6 text-gray-600">
              <p>
                Cung cấp dịch vụ phát triển phần mềm theo yêu cầu cho tất cả
                khách hàng, từ các phần mềm desktop đến web application dự trên
                nền tảng:{' '}
                <strong>Node.js, ReactJS, NextJS, NestJS, MongoDB</strong>. Với
                đội ngũ kỹ sư giàu kinh nghiệm, chúng tôi cam kết:
              </p>
              <p></p>
              <ul className="list-disc pl-4 text-sm/6 leading-8 text-gray-600">
                <li>Tư vấn giải pháp phù hợp với nhu cầu và ngân sách</li>
                <li>Thiết kế giao diện người dùng thân thiện và dễ sử dụng</li>
                <li>Tích hợp các công nghệ mới nhất để tối ưu hóa hiệu suất</li>
                <li>
                  Đảm bảo tính bảo mật và an toàn cho dữ liệu của khách hàng
                </li>

                <li>Hỗ trợ kỹ thuật 24/7 để giải quyết mọi vấn đề phát sinh</li>
              </ul>
              <p className="mt-4">
                Liên hệ ngay với chúng tôi qua email: langtuvan@hotmail.com để
                được tư vấn chi tiết về giải pháp phần mềm phù hợp với doanh
                nghiệp của bạn.
              </p>
            </dd>
          </dl>
        </div>
      </section>
    </Container>
  )
}

export default function Pricing({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  let tier =
    typeof searchParams.tier === 'string'
      ? tiers.find(({ slug }) => slug === searchParams.tier)!
      : tiers[0]

  return (
    <>
      <main className="overflow-hidden">
        <GradientBackground />
        <Container>
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
        </Container>
        {/* <Header /> */}
        {/* <PricingCards />
      <PricingTable selectedTier={tier} /> */}

        <HuongDan />
        <UngDung />
        <DichVu />

        {/* <Testimonial /> */}
      </main>
      <Footer />
    </>
  )
}
