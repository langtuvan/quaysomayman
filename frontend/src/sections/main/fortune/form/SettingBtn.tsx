'use client'
import { useState } from 'react'
// hooks
import { useAuthContext } from '@/auth/hooks'
import { useCustomRouter } from '@/hooks/useCustomRouter'
// components
import { Button } from '@/components/button'
import { Label } from '@/components/fieldset'
import { Select } from '@/components/select'
// graphql
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogTitle,
} from '@/components/dialog'
import { Field } from '@/components/fieldset'
import {
  GET_RANDOM_FORTUNES_BY_USER,
  GET_WHEEL_FORTUNES_BY_USER,
} from '@/graphql/fortune'
import { useQuery } from '@apollo/client'
// icons
import { WrenchIcon } from '@heroicons/react/20/solid'

import { Heading } from '@/components/Heading'
import { Text } from '@/components/textComponent'
import SSOLogin from '@/sections/auth/LoginOA'

import { paths } from '@/routes/paths'

export default function SettingBtn({
  btnIcon = false,
  type,
}: {
  btnIcon?: boolean
  type: string
}) {
  const { goTo, useParams } = useCustomRouter()
  const { authenticated, user } = useAuthContext()
  console.log(authenticated, 'user', user)
  let [isOpen, setIsOpen] = useState(false)
  const { data } = useQuery(
    type === 'wheel' ? GET_WHEEL_FORTUNES_BY_USER : GET_RANDOM_FORTUNES_BY_USER,
    {
      skip: !authenticated,
      fetchPolicy: 'cache-first',
    },
  )

  const path =
    type === 'wheel' ? paths.main.fortune.wheel : paths.main.fortune.random

  const params = useParams<{ id: string }>()
  const [id, setId] = useState<string | null>(params?.id || null)

  const handleOnChangeSelect = (event: any) => {
    if (event.target.value) {
      setId(event.target.value)
    } else setId(null)
  }

  const list = data?.wheelFortunes || data?.randomFortunes || []

  return (
    <>
      {btnIcon ? (
        <Button
          variant="secondary"
          type="button"
          onClick={() => setIsOpen(true)}
        >
          <WrenchIcon className="size-6" />
        </Button>
      ) : (
        <Button
          type="button"
          variant="secondary"
          onClick={() => setIsOpen(true)}
        >
          Danh sách
        </Button>
      )}

      <Dialog open={isOpen} onClose={setIsOpen}>
        <DialogTitle className="uppercase">Danh sách</DialogTitle>

        <DialogBody>
          {list.length > 0 ? (
            <Field>
              <Label>Danh sách của bạn</Label>
              <Select defaultValue={id as any} onChange={handleOnChangeSelect}>
                <option value="">Chọn ...</option>
                {list.map((data: any) => (
                  <option
                    //disabled={data.id === wheel}
                    key={data.id}
                    value={data.id}
                  >
                    {data.title}
                  </option>
                ))}
              </Select>
            </Field>
          ) : (
            <Text>Chưa có dánh sách</Text>
          )}

          {!authenticated && (
            <>
              <Heading className="mb-3">Đăng nhập để sử dụng miễn phí</Heading>
              <SSOLogin />
            </>
          )}
        </DialogBody>
        <DialogActions>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>

          {authenticated && (
            <>
              <>
                <Button
                  className="cursor-pointer"
                  disabled={!id}
                  onClick={() => (
                    goTo(path.detail(id as string)), setIsOpen(false)
                  )}
                >
                  Quay
                </Button>
                <Button
                  variant="secondary"
                  className="cursor-pointer"
                  disabled={!id}
                  onClick={() => (
                    goTo(path.edit(id as string)), setIsOpen(false)
                  )}
                >
                  Tùy Chỉnh
                </Button>
              </>

              <Button
                color="green"
                className="cursor-pointer"
                onClick={() => (goTo(path.new), setIsOpen(false))}
              >
                Tạo mới
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </>
  )
}
