import { Box } from './Box'
import clsx from 'clsx'

const CardLayout = ({
  className = '',
  children,
}: {
  className?: string
  children: React.ReactNode
}) => (
  <Box
    className={clsx(
      'card-ring divide-y divide-gray-200 overflow-hidden rounded-xl lg:rounded-2xl lg:shadow-sm lg:ring-2',
    )}
  >
    {children}
  </Box>
)

const CardHeader = ({
  className = '',
  children,
}: {
  className?: string
  children: React.ReactNode
}) => (
  <div
    className={clsx(
      'flex flex-row items-center justify-between rounded-t-xl py-3 align-middle ring-0 lg:rounded-t-2xl lg:bg-zinc-100 lg:px-8 dark:lg:bg-zinc-900',
      className,
    )}
  >
    {children}
  </div>
)

const CardBody = ({
  className = '',
  children,
}: {
  className?: string
  children: React.ReactNode
}) => <Box className={clsx('my-3 lg:p-8', className)}>{children}</Box>

const CardFooter = ({
  className = '',
  children,
}: {
  className?: string
  children: React.ReactNode
}) => (
  <Box
    className={clsx(
      'boder-t-2 flex flex-row items-center justify-between py-3 align-middle lg:px-8',
      className,
    )}
  >
    {children}
  </Box>
)

export { CardLayout, CardHeader, CardBody, CardFooter }
