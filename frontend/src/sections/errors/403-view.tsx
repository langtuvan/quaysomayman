'use client'
import { Button } from '@/components/button'
import { Heading } from '@/components/Heading'
import { Text } from '@/components/textComponent'
import { CenterBox } from '@/components/LoadingScreen'
import { useCustomRouter } from '@/hooks/useCustomRouter'

import { Flex } from '@/components/Flex'

type Props = {
  statusCode?: number
  title?: string
  description?: string
}

export default function View403({
  statusCode = 403,
  title = 'Forbidden',
  description = 'Bạn không có quyền truy cập vào trang này.',
}: Props) {
  const { router } = useCustomRouter()
  return (
    <CenterBox>
      <Flex className="flex-col items-center justify-center gap-3 text-center">
        <Text>{statusCode}</Text>
        <Heading level={1}>{title}</Heading>
        <Text>{description}</Text>
        <Flex className="flex-row gap-x-4 text-center">
          <Button  onClick={() => router.back()}>
            Back
          </Button>
          <Button color="blue" onClick={() => router.refresh()}>
            Tải lại
          </Button>
        </Flex>
      </Flex>
    </CenterBox>
  )
}
