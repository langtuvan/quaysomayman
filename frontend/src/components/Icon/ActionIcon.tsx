import {
  TrashIcon as TrashHeroIcon,
  ClipboardDocumentIcon,
  ClipboardDocumentCheckIcon,
  ArrowPathIcon,
} from '@heroicons/react/20/solid'
import clsx from 'clsx'
import { useState } from 'react'
import copy from 'copy-to-clipboard'
import { set } from 'nprogress'

export function RefeshIcon({
  className = '',
  onClick,
}: {
  className?: string
  onClick?: () => void
}) {
  'use client'
  return (
    <ArrowPathIcon
      className={clsx(
        'active:scale-120 h-4 w-4 text-slate-600 hover:text-slate-500 active:text-indigo-500',
        className,
      )}
      onClick={() => {
        onClick && onClick()
      }}
    />
  )
}

export function TrashIcon({
  className = '',
  onClick,
}: {
  className?: string
  onClick?: () => void
}) {
  return (
    <TrashHeroIcon
      className={clsx(
        'active:scale-120 h-4 w-4 text-red-500 hover:text-slate-500 active:text-indigo-500',
        className,
      )}
      onClick={() => {
        onClick && onClick()
      }}
    />
  )
}

export function CopyIcon({
  className = '',
  value,
}: {
  className?: string
  value: string
}) {
  const [isCopied, setIsCopied] = useState(false)
  const handleOnClick = () => {
    setIsCopied(true)
    setTimeout(() => {
      setIsCopied(false)
    }, 2000)
    copy(value)
  }

  return !isCopied ? (
    <ClipboardDocumentIcon
      className={clsx(
        'h-4 w-4 hover:text-slate-500 active:scale-95 active:text-indigo-500',
        className,
      )}
      onClick={handleOnClick}
    />
  ) : (
    <ClipboardDocumentCheckIcon className="h-4 w-4 text-indigo-600 hover:scale-110" />
  )
}
