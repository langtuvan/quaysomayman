'use client'
import { Section } from './section'
import { useState } from 'react'
import clsx from 'clsx'
import { useCustomRouter } from '@/hooks/useCustomRouter'

export function Box({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  return <div className={clsx('', className)} {...props} />
}

export function BoxRing({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <Box
      className={clsx('hover:ring-2 hover:ring-orange-500', className)}
      {...props}
    />
  )
}

export function BoxBorderDashed({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <Box
      className={clsx(
        'truncate rounded-sm border border-dashed border-orange-600 p-1 text-xs text-orange-600',
        className,
      )}
      {...props}
    />
  )
}

export function CollapseBox({
  children,
  section,
  className = '',
}: {
  section: string
  children: React.ReactNode
  className?: string
}) {
  const [isOpen, setIsOpen] = useState(false)
  const { replaceRoute } = useCustomRouter()

  const handleOnClickBtn = () => {
    setIsOpen(!isOpen)
    isOpen && replaceRoute(`#${section}`)
  }

  return (
    <Box
      className={clsx(
        'relative h-auto space-y-4 overflow-hidden rounded-md bg-white p-2 shadow-md',
        !isOpen && 'max-h-[600px] min-h-56',
        className,
      )}
    >
      <Section id={section}>
        {children}
        <Box
          className={clsx(
            'text-center',
            !isOpen
              ? 'absolute inset-x-0 bottom-0 bg-green-50 py-24 opacity-80 backdrop-blur-sm backdrop-opacity-20'
              : 'py-6',
          )}
        >
          <span
            onClick={handleOnClickBtn}
            className="cursor-pointer rounded-md border-2 border-green-500 bg-slate-50 px-12 py-2.5 text-sm font-semibold text-green-600 shadow-sm hover:bg-green-800 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            {isOpen ? ' Thu gọn nội dung' : 'Xem thêm nội dung'}
          </span>
        </Box>
      </Section>
    </Box>
  )
}
