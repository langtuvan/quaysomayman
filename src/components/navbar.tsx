'use client'

import { useAuthContext } from '@/auth/hooks'
import { ApolloClient, InMemoryCache } from '@apollo/client'
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react'
import { Bars2Icon } from '@heroicons/react/24/solid'
import { motion } from 'framer-motion'
import {
  Dropdown,
  DropdownButton,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
} from './dropdown'
import { Link } from './link'
import { PlusGrid, PlusGridItem, PlusGridRow } from './plus-grid'
import { ArrowRightStartOnRectangleIcon } from '@heroicons/react/16/solid'

const links = [
  { href: '/vong-quay-may-man', label: 'Vòng Quay May Mắn' },
  { href: '/con-so-may-man', label: 'Con Số May Mắn' },
  { href: '/gioi-thieu', label: 'Giới thiệu' },
]

function DesktopNav() {
  const { authenticated, user, signOut } = useAuthContext()
  // appolo client
  const client = new ApolloClient({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_API,
    cache: new InMemoryCache(),
  })

  const handleLogout = () => {
    signOut()
    client.resetStore()
  }
  return (
    <nav className="relative hidden lg:flex">
      {links.map(({ href, label }) => (
        <PlusGridItem key={href} className="relative flex">
          <Link
            href={href}
            className="flex items-center px-4 py-3 text-base font-medium text-gray-950 bg-blend-multiply data-hover:bg-black/[2.5%]"
          >
            {label}
          </Link>
        </PlusGridItem>
      ))}
      <PlusGridItem className="relative flex">
        <Dropdown>
          <DropdownButton as={'div'}>
            <Link
              href={authenticated ? '#' : '/login'}
              className="flex items-center px-4 py-3 text-base font-medium text-gray-950 bg-blend-multiply data-hover:bg-black/[2.5%]"
            >
              {user?.name || 'Đăng nhập'}
            </Link>
          </DropdownButton>
          <DropdownMenu anchor="bottom" className="z-50">
            <DropdownItem onClick={handleLogout}>
              <ArrowRightStartOnRectangleIcon />
              <DropdownLabel>Thoát</DropdownLabel>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </PlusGridItem>
    </nav>
  )
}

function MobileNavButton() {
  return (
    <DisclosureButton
      className="flex size-12 items-center justify-center self-center rounded-lg data-hover:bg-black/5 lg:hidden"
      aria-label="Open main menu"
    >
      <Bars2Icon className="size-6" />
    </DisclosureButton>
  )
}

function MobileNav() {
  return (
    <DisclosurePanel className="lg:hidden">
      <div className="flex flex-col gap-6 py-4">
        {links.map(({ href, label }, linkIndex) => (
          <motion.div
            initial={{ opacity: 0, rotateX: -90 }}
            animate={{ opacity: 1, rotateX: 0 }}
            transition={{
              duration: 0.15,
              ease: 'easeInOut',
              rotateX: { duration: 0.3, delay: linkIndex * 0.1 },
            }}
            key={href}
          >
            <Link href={href} className="text-base font-medium text-gray-950">
              {label}
            </Link>
          </motion.div>
        ))}
      </div>
      <div className="absolute left-1/2 w-screen -translate-x-1/2">
        <div className="absolute inset-x-0 top-0 border-t border-black/5" />
        <div className="absolute inset-x-0 top-2 border-t border-black/5" />
      </div>
    </DisclosurePanel>
  )
}

export function Navbar({ banner }: { banner?: React.ReactNode }) {
  return (
    <Disclosure as="header" className="pt-12 sm:pt-16">
      <PlusGrid>
        <PlusGridRow className="relative flex justify-between">
          <div className="relative flex gap-6">
            <PlusGridItem className="py-3">
              <Link href="/" title="Home">
                MAY MẮN
              </Link>
            </PlusGridItem>
            {banner && (
              <div className="relative hidden items-center py-3 lg:flex">
                {banner}
              </div>
            )}
          </div>
          <DesktopNav />
          <MobileNavButton />
        </PlusGridRow>
      </PlusGrid>
      <MobileNav />
    </Disclosure>
  )
}
