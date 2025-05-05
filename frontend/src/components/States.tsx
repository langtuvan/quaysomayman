import { CenterBox } from './LoadingScreen'
import { Button } from './button'
import { useAuthContext } from '@/auth/hooks'
import { useRouter } from 'next/navigation'

export const BadRequestError = {
  title: 'Bad Request',
  statusCode: 400,
  description: 'Đã có lỗi xảy ra vui lòng thử lại',
}

export const NotFoundError = {
  title: 'Not Found',
  statusCode: 404,
  description: 'Không tìm thấy trang này',
}

export const ForbiddenError = {
  title: 'Forbidden',
  statusCode: 403,
  description: 'Bạn không có quyền truy cập trang này',
}

export const NoAuthenticatedError = {
  title: 'No Authenticated',
  statusCode: 401,
  description: 'Bạn chưa đăng nhập',
}

export const EmptyError = {
  title: 'Empty',
  statusCode: 204,
  description: 'Không có dữ liệu',
}

export const UnknownError = {
  title: 'Unknown',
  statusCode: 500,
  description: 'Có lỗi xảy ra vui lòng thử lại',
}

function EmptySvg() {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="mx-auto size-12 text-gray-400"
    >
      <path
        d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
        strokeWidth={2}
        vectorEffect="non-scaling-stroke"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function NotFoundSvg() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className="mx-auto size-12 text-gray-400"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Zm3.75 11.625a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
      />
    </svg>
  )
}

function ForbiddenSvg() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className="mx-auto size-12 text-gray-400"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v3.75m0-10.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.25-8.25-3.286Zm0 13.036h.008v.008H12v-.008Z"
      />
    </svg>
  )
}



export function CustomStates({
  statusCode,
  title,
  description,
  action,
}: {
  statusCode: number
  title: string
  description: string
  action?: React.ReactNode
}) {
  const SvgIcon = () => {
    if (statusCode === 401) {
      // 401 - No Authenticated
      return <ForbiddenSvg />
    }

    if (statusCode === 403) {
      // 403 - Forbidden
      return <ForbiddenSvg />
    }

    if (statusCode === 404) {
      // 404 - Not Found
      return <NotFoundSvg />
    }

    if (statusCode === 400) {
      // 400 - Bad Request
      return <NotFoundSvg />
    }

    if (statusCode === 204) {
      // 400 - Bad Request
      return <EmptySvg />
    }

    return <EmptySvg />
  }

  const router = useRouter()
  return (
    <CenterBox>
      <div className="text-center">
        <SvgIcon />
        <h3 className="mt-2 space-x-2 text-sm font-semibold text-gray-900">
          {statusCode} - {description}
        </h3>

        <p className="mt-1 text-sm text-gray-500">{title}</p>

        {action ? (
          action
        ) : (
          <div className="mt-6">
            <Button color="indigo" onClick={() => router.back()}>
              Trở về
            </Button>
          </div>
        )}
      </div>
    </CenterBox>
  )
}

export function WithDashedBorder() {
  return (
    <button
      type="button"
      className="relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
    >
      <svg
        fill="none"
        stroke="currentColor"
        viewBox="0 0 48 48"
        aria-hidden="true"
        className="mx-auto size-12 text-gray-400"
      >
        <path
          d="M8 14v20c0 4.418 7.163 8 16 8 1.381 0 2.721-.087 4-.252M8 14c0 4.418 7.163 8 16 8s16-3.582 16-8M8 14c0-4.418 7.163-8 16-8s16 3.582 16 8m0 0v14m0-4c0 4.418-7.163 8-16 8S8 28.418 8 24m32 10v6m0 0v6m0-6h6m-6 0h-6"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="mt-2 block text-sm font-semibold text-gray-900">
        Create a new database
      </span>
    </button>
  )
}

export function ForbiddenStates({
  statusCode = 403,
  title = 'Forbidden',
  description = 'Bạn không có quyền truy cập trang này',
  action,
}: {
  statusCode?: number
  title?: string
  description?: string
  action?: React.ReactNode
}) {
  const router = useRouter()
  return (
    <CenterBox>
      <div className="text-center">
        <ForbiddenSvg />

        <h3 className="mt-2 space-x-2 text-sm font-semibold text-gray-900">
          {statusCode} - {description}
        </h3>

        <p className="mt-1 text-sm text-gray-500">{title}</p>

        {action ? (
          action
        ) : (
          <div className="mt-6">
            <Button color="indigo" onClick={() => router.back()}>
              Trở về
            </Button>
          </div>
        )}
      </div>
    </CenterBox>
  )
}

export function NoAuthenticatedStates({
  statusCode = 401,
  title = 'Chưa đăng nhập',
  description = 'Bạn cần đăng nhập để sử dụng chức năng này',
  action,
}: {
  statusCode?: number
  title?: string
  description?: string
  action?: React.ReactNode
}) {
  const { setOpenLoginForm } = useAuthContext()
  return (
    <CenterBox>
      <div className="text-center">
        <ForbiddenSvg />

        <h3 className="mt-2 space-x-2 text-sm font-semibold text-gray-900">
          {statusCode} - {description}
        </h3>

        <p className="mt-1 text-sm text-gray-500">{title}</p>
        <div className="mt-6">
          <Button type="button"  onClick={() => setOpenLoginForm(true)}>
            Sign In
          </Button>
        </div>
      </div>
    </CenterBox>
  )
}
