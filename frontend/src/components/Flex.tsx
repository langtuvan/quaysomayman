import clsx from 'clsx'

export function Flex({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      className={clsx(
        'flex',
        className,
      )}
      {...props}
    />
  )
}
