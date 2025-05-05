import clsx from 'clsx'

export function Section({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'section'>) {
  return <section className={clsx('', className)} {...props} />
}
