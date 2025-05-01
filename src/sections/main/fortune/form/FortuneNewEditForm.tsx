'use client'
import _ from 'lodash'
import { Fragment, useEffect, useMemo, useState } from 'react'
// components
import { Badge } from '@/components/badge'
import { Button } from '@/components/button'
import { CardBody, CardFooter, CardLayout } from '@/components/Card'
import { Flex } from '@/components/Flex'
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
// React Hook Form
import { RHFTextAreas, RHFTextField } from '@/components/hook-form'
import FormProvider from '@/components/hook-form/FormProvider'
import { useCustomRouter } from '@/hooks/useCustomRouter'
import { getObjectHasChanged } from '@/utils/getDifference'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'
// fields array
import WheelPersonsForm from './PersonsForm'
import WheelPrizesForm from './PrizesForm'
import WheelWinnersForm from './WinnersForm'
// apolo client
import {
  CREATE_FORTUNE,
  DELETE_FORTUNE,
  GET_FORTUNE,
  UPDATE_FORTUNE,
} from '@/graphql/fortune'
import { gql, useMutation } from '@apollo/client'
import { stripTypename } from '@apollo/client/utilities'

import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from '@/components/dialog'
import { Divider } from '@/components/divider'
import { Field, Fieldset, Label } from '@/components/fieldset'
import { Heading } from '@/components/Heading'
import { TrashIcon } from '@/components/Icon/ActionIcon'
import { ProcessingScreen } from '@/components/LoadingScreen'
import { Strong, Text } from '@/components/textComponent'
import { MutationApolloError } from '@/providers/apolloClient/utils'
import { paths } from '@/routes/paths'
import { PencilIcon } from '@heroicons/react/20/solid'
import SettingBtn from './SettingBtn'

const timeOut = 21

type Person = {
  id?: string
  manv: string
  name: string
  email?: string
  phone?: string
}

type Prize = {
  id?: string
  key: number
  name: string
  qty: number
}

type Winner = Person & {
  prizeId: string
  prize: string
  key: number
}

type FormValuesProps = {
  id?: string
  title: string
  description?: string
  persons?: Person[]
  winners?: Winner[]
  prizes: Prize[]
  type: string
  errorMessage?: string
}

type CurrentDataProps = {
  id?: string
  title: string
  description?: string
  persons: Person[]
  winners?: Winner[]
  prizes: Prize[]
  type: string

  //started: boolean
}

type Props = {
  currentData?: CurrentDataProps
  addType: string
}

function getRandomNumber(excludedNumbers: number[]) {
  let randomNum
  do {
    randomNum = Math.floor(Math.random() * (10000 - 1000 + 1)) + 1000
  } while (excludedNumbers.includes(randomNum))
  return randomNum
}

const generatePersons = (number: number, excludedNumbers: number[]) => {
  return Array.from({ length: number }, (_, i) => {
    const newCode = `${getRandomNumber(excludedNumbers)}`
    return {
      manv: newCode,
      name: `Người chơi ${newCode}`,
    }
  })
}

const TEST_PRIZES = [
  { key: 1, name: '📱 iPhone 15', qty: 1 },
  { key: 2, name: '📱 laptop Dell', qty: 1 },
  { key: 3, name: '📱 Tivi', qty: 1 },
  { key: 4, name: '🎁 Quà Bí Mật', qty: 1 },
  { key: 5, name: '💰 Voucher 1.000K', qty: 1 },
  { key: 6, name: '💰 Voucher 500K', qty: 1 },
  { key: 7, name: '💰 Voucher 200K', qty: 2 },
  { key: 8, name: '🎟️ May mắn lần sau', qty: 10 },
]

export default function FortuneNewEditForm({ currentData, addType }: Props) {
  const [isProcessing, setIsProcessing] = useState(false)
  //hooks
  const { goTo, replaceRoute } = useCustomRouter()
  const path =
    addType === 'wheel' ? paths.main.fortune.wheel : paths.main.fortune.random

  //Apollo mutation
  const [addFn] = useMutation(CREATE_FORTUNE, {
    update(cache, { data: { createFortune } }) {
      addType === 'wheel'
        ? cache.modify({
            fields: {
              wheelFortunes(existingFortunes = []) {
                const fortune = cache.writeFragment({
                  data: createFortune,
                  fragment: gql`
                    fragment Fortune on fortune {
                      id
                      type
                      title
                    }
                  `,
                })
                return [...existingFortunes, fortune]
              },
            },
          })
        : cache.modify({
            fields: {
              randomFortunes(existingFortunes = []) {
                const fortune = cache.writeFragment({
                  data: createFortune,
                  fragment: gql`
                    fragment Fortune on fortune {
                      id
                      type
                      title
                    }
                  `,
                })
                return [...existingFortunes, fortune]
              },
            },
          })

      // cache.writeQuery({
      //   query: GET_FORTUNE,
      //   variables: { id: createFortune.id },
      //   data: { fortune: createFortune },
      // })
    },

    // refetchQueries: [
    //   currentData?.type === 'wheel'
    //     ? GET_WHEEL_FORTUNES_BY_USER
    //     : GET_RANDOM_FORTUNES_BY_USER,
    // ],
  })
  const [updateFn] = useMutation(UPDATE_FORTUNE, {
    //refetchQueries: [GET_FORTUNE],
    //update cache
    update(cache, { data: { updateFortune: fortune } }) {
      // Check if the cache contains the fortune data
      if (currentData?.id && fortune) {
        const updateData = { fortune }
        // update cache
        cache.writeQuery({
          query: GET_FORTUNE,
          variables: { id: currentData.id },
          data: updateData,
        })
      }
    },
  })

  const [deleteFn] = useMutation(DELETE_FORTUNE, {
    update(cache, { data: { deleteFortune } }) {
      cache.modify({
        fields: {
          wheelFortunes(existingFortunes = []) {
            return existingFortunes.filter(
              (fortune: any) =>
                fortune.__ref !== `FortuneModel:${deleteFortune.id}`,
            )
          },
          randomFortunes(existingFortunes = []) {
            return existingFortunes.filter(
              (fortune: any) =>
                fortune.__ref !== `FortuneModel:${deleteFortune.id}`,
            )
          },
        },
      })
    },
  })

  //React Hook Form
  const defaultValues = useMemo(
    () => ({
      id: currentData?.id || '',
      title: currentData?.title || '',
      description: currentData?.description || '',
      persons: currentData?.persons || [],
      prizes: currentData?.prizes || [],
      winners: currentData?.winners || [],
      type: currentData?.type || addType,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentData],
  )

  useEffect(() => {
    reset({
      id: currentData?.id || '',
      title: currentData?.title || '',
      description: currentData?.description || '',
      persons: currentData?.persons || [],
      prizes: currentData?.prizes || [],
      winners: currentData?.winners || [],
      type: currentData?.type || addType,
    })
  }, [currentData])

  const FormSchema = Yup.object().shape({
    title: Yup.string().required('This is required'),
    type: Yup.string().required('This is required'),
    persons: Yup.array().of(
      Yup.object()
        .shape({
          manv: Yup.string().required('This is required'),
          name: Yup.string().required('This is required'),
        })
        .required('This is required'),
    ),
    //.required('This is required'),
    prizes: Yup.array()
      .of(
        Yup.object().shape({
          key: Yup.number().required('This is required'),
          name: Yup.string().required('This is required'),
          qty: Yup.number().required('This is required'),
        }),
      )
      .required('This is required'),
  })

  const methods = useForm<any>({
    resolver: yupResolver(FormSchema),
    defaultValues,
  })

  const {
    handleSubmit,
    watch,
    reset,
    setValue,
    setError,
    formState: { dirtyFields, errors, isDirty },
  } = methods

  const onSubmit = async (formData: FormValuesProps) => {
    setIsProcessing(true)
    const { id, winners, ...data } = formData

    let input = currentData
      ? getObjectHasChanged<FormValuesProps>(dirtyFields, data)
      : data

    const mutationFn = id ? updateFn : addFn
    const variables = id
      ? {
          id,
          input: stripTypename(input),
        }
      : { input: data }

    await mutationFn({
      variables,

      onCompleted: (data) => {
        if (!currentData?.id) {
          const { id } = data?.createFortune
          replaceRoute(path.edit(id))
        }
      },
      onError: (apolloError) => {
        const errors = MutationApolloError(apolloError)
        errors?.message?.map(({ field, message }) =>
          setError(field as keyof FormValuesProps, {
            message,
            type: 'manual',
          }),
        )
        setIsProcessing(false)
      },
    })

    setTimeout(() => {
      setIsProcessing(false)
    }, 1200)
  }

  // delete fortune
  const [isDeleting, setIsDeleting] = useState(false)
  const onDelete = async () => {
    if (!currentData?.id) return
    setIsProcessing(true)
    await deleteFn({
      variables: { id: currentData.id },
      onCompleted: () => {
        setIsDeleting(false)
        goTo(path.root)
      },
    })
    setTimeout(() => {
      setIsProcessing(false)
    }, 1200)
  }

  const { persons, prizes, winners, description } = watch()

  const handleOnClickUseExample = () => {
    const oldPersons = watch('persons') || []

    const getPersonsManv =
      watch('persons')?.map(({ manv }: any) => Number(manv)) || []

    const getWinnersManv =
      watch('winners')?.map(({ manv }: any) => Number(manv)) || []

    const examplePersons = generatePersons(
      _.sumBy(prizes, 'qty') - (oldPersons?.length || 0),
      [...getPersonsManv, ...getWinnersManv],
    )

    if (!currentData) {
      setValue('prizes', TEST_PRIZES)
    }

    setValue('persons', [...oldPersons, ...examplePersons], {
      shouldDirty: true,
    })
  }

  const [openConFirm, setOpenConFirm] = useState(false)
  const handleOnClickPlay = () => {
    if (isDirty) {
      return setOpenConFirm(true)
    } else {
      goTo(`${path.detail(currentData?.id as string)}`)
    }
  }
  const DiaglogSubmit = () => {
    if (currentData?.id) {
      setOpenConFirm(false)
      handleSubmit(onSubmit)().then(() => {
        const url = `${path.detail(currentData?.id as string)}`
        goTo(url)
      })
    }
  }

  const [isOpenDescriptionDialog, setIsOpenDescriptionDialog] = useState(false)

  return (
    <>
      {isProcessing && <ProcessingScreen />}
      <CardLayout className="bg-white">
        <FormProvider
          methods={methods}
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 gap-y-4 bg-zinc-50 select-none dark:bg-zinc-900"
        >
          <Fieldset disabled={isProcessing}>
            <CardBody className="space-y-4">
              <RHFTextField
                name="title"
                label="Tiêu đề"
                placeholder="Nhập tiêu đề"
                required
              />
              <Field className="gap-3">
                <Label className="flex items-center gap-2">
                  Mô tả / Ghi chú{' '}
                  <PencilIcon
                    className="h4 w-4"
                    onClick={() => setIsOpenDescriptionDialog(true)}
                  />
                </Label>
                <Text>{description}</Text>
              </Field>

              <Dialog
                open={isOpenDescriptionDialog}
                onClose={setIsOpenDescriptionDialog}
              >
                <DialogTitle>Nhập Mô tả / Ghi chú</DialogTitle>

                <DialogBody>
                  <RHFTextAreas
                    name="description"
                    placeholder="Nhập mô tả"
                    rows={10}
                    maxLength={1000}
                  />
                </DialogBody>
                <DialogActions>
                  <Button
                    variant="outline"
                    onClick={() => setIsOpenDescriptionDialog(false)}
                  >
                    Cancel
                  </Button>
                </DialogActions>
              </Dialog>

              <Divider className="my-3" />

              <TabGroup defaultIndex={2}>
                <div className="-mx-4 mb-6 flex overflow-x-auto sm:mx-0">
                  <div className="flex-auto border-b border-gray-200 px-4 sm:px-0">
                    <TabList className="-mb-px flex space-x-2">
                      <Tab className="flex flex-row border-b-2 border-transparent px-2 py-3 text-sm font-medium whitespace-nowrap data-[hover]:rounded-lg data-[hover]:border-b-indigo-500 data-[hover]:bg-zinc-100 data-[selected]:rounded-lg data-[selected]:border-b-indigo-500 data-[selected]:bg-zinc-100 data-[selected]:text-lg">
                        <Text>🎉 Trúng giải</Text>
                        <Badge>{winners?.length || 0}</Badge>
                      </Tab>
                      <Tab className="flex flex-row border-b-2 border-transparent px-2 py-3 text-sm font-medium whitespace-nowrap data-[hover]:rounded-lg data-[hover]:border-b-indigo-500 data-[hover]:bg-zinc-100 data-[selected]:rounded-lg data-[selected]:border-b-indigo-500 data-[selected]:bg-zinc-100 data-[selected]:text-lg">
                        <Text>🎟️ Người chơi</Text>
                        <Badge>{persons?.length}</Badge>
                      </Tab>
                      <Tab className="flex flex-row border-b-2 border-transparent px-2 py-3 text-sm font-medium whitespace-nowrap data-[hover]:rounded-lg data-[hover]:border-b-indigo-500 data-[hover]:bg-zinc-100 data-[selected]:rounded-lg data-[selected]:border-b-indigo-500 data-[selected]:bg-zinc-100 data-[selected]:text-lg">
                        <Text>🏆 Giải thưởng</Text>
                        <Badge className="font-bold">
                          {_.sumBy(prizes, 'qty')} / {prizes.length}
                        </Badge>
                      </Tab>
                    </TabList>
                  </div>
                </div>

                <TabPanels as={Fragment}>
                  {/* {nhap danh sach trung giai} */}
                  <TabPanel>
                    <WheelWinnersForm />
                  </TabPanel>

                  {/* {nhap danh sach nguoi choi} */}
                  <TabPanel>
                    <WheelPersonsForm />
                  </TabPanel>

                  {/* {nhap giai thuong} */}
                  <TabPanel>
                    <WheelPrizesForm />
                  </TabPanel>
                </TabPanels>
              </TabGroup>
            </CardBody>
            <CardFooter className="flex flex-col justify-between gap-2 lg:flex-row">
              <Flex className="align-center flex-row items-start gap-2">
                <Button variant="secondary" onClick={handleOnClickUseExample}>
                  Sử dụng dữ liệu mẫu
                </Button>
                <Button variant="secondary" onClick={() => setIsDeleting(true)}>
                  <TrashIcon />
                </Button>
                <Dialog
                  open={isDeleting}
                  onClose={setIsDeleting}
                  className="z-50"
                >
                  <DialogTitle>Xóa vòng quay</DialogTitle>
                  <DialogBody className="flex flex-col gap-2">
                    <Heading>Bạn có chắc chắn muốn xóa không?</Heading>
                    <Text>
                      <Strong>
                        Chú ý: Dữ liệu sẽ không thể khôi phục lại được.
                      </Strong>
                    </Text>
                  </DialogBody>
                  <DialogActions className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsDeleting(false)}
                    >
                      Hủy
                    </Button>
                    <Button color="red" onClick={onDelete}>
                      Xóa
                    </Button>
                  </DialogActions>
                </Dialog>
              </Flex>
              <Flex className="gap-2">
                {/* {errors && errors.errorMessage && (
                  <Badge color="red" className="text-red-500">
                    {errors.errorMessage.message}
                  </Badge>
                )} */}

                <SettingBtn type={addType} />

                {currentData?.id ? (
                  <>
                    <Button variant="secondary" href={path.new}>
                      Tạo mới
                    </Button>
                    <Button variant="outline" onClick={() => reset()}>
                      Reset
                    </Button>
                    <Button
                      variant="secondary"
                      href={`${path.detail(currentData?.id)}?autoPlay=true&player=${currentData?.persons[0]?.manv}`}
                    >
                      Quay Tự Động
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={handleOnClickPlay}
                      // href={`${path.detail(currentData?.id)}`}
                    >
                      Quay
                    </Button>
                    <Dialog open={openConFirm} onClose={setOpenConFirm}>
                      <DialogTitle>Cảnh Báo</DialogTitle>
                      <DialogDescription>
                        Có thay đổi dữ liệu chưa được lưu lại. Bạn có muốn lưu
                        lại trước khi quay không?
                      </DialogDescription>

                      <DialogActions>
                        <Button onClick={DiaglogSubmit}>Lưu</Button>
                        <Button
                          variant="outline"
                          href={`${path.detail(currentData?.id)}`}
                        >
                          Không lưu
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </>
                ) : (
                  <Button variant="secondary" onClick={() => reset()}>
                    Reset
                  </Button>
                )}

                <Button type="submit">Lưu</Button>
              </Flex>
            </CardFooter>
          </Fieldset>
        </FormProvider>
      </CardLayout>
    </>
  )
}
