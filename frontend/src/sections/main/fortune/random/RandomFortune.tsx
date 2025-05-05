'use client'
import { Button } from '@/components/button'
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogTitle,
} from '@/components/dialog'
import { Flex } from '@/components/Flex'
import { Strong, Text } from '@/components/textComponent'
import { MusicalNoteIcon, SpeakerXMarkIcon } from '@heroicons/react/20/solid'
import _ from 'lodash'
import { useEffect, useMemo, useRef, useState } from 'react'
// React Hook Form
import { BoxRing } from '@/components/Box'
import { RHFSelect } from '@/components/hook-form'
import FormProvider from '@/components/hook-form/FormProvider'
import { GET_FORTUNE, SPIN_RANDOM } from '@/graphql/fortune'
import { useMutation } from '@apollo/client'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'
import SettingBtn from '../form/SettingBtn'
import { useRandomNumber } from './useRandomNumber'
// mock
import { persons as PERSONS_DEMO } from '@/_mock/fortune'
import { Container } from '@/components/container'
import { ErrorMessage, Fieldset } from '@/components/fieldset'
import { MutationApolloError } from '@/providers/apolloClient/utils'
import { Field, Label } from '@headlessui/react'

const timeOut = 4

type Person = {
  id?: string
  manv: string
  name: string
  email?: string
  phone?: string
}

type Prize = {
  id: string
  name: string
  qty: number
}

type Winner = Person & {
  prizeId: string
  prize: string
}

type FormValuesProps = {
  id: string
  prizeId: string
  prizes?: Prize[]
  errorMessage?: string
}

type CurrentDataProps = {
  id: string
  title: string
  prizes: Prize[]
}

type Props = {
  demo?: boolean
  autoPlay?: boolean
  currentData: CurrentDataProps
}

export default function RandomFortuneForm({
  currentData,
  demo = false,
}: Props) {
  // hooks

  const [winner, setWinner] = useState<Winner | null>(null)
  const [number, setNumber] = useState<any>({
    five: 0,
    four: 0,
    three: 0,
    two: 0,
    one: 0,
  })

  const { randomNumber: fiveNumber, setIsRunning: setIsRunningFive } =
    useRandomNumber(number.five, timeOut * 1000)
  const { randomNumber: fourNumber, setIsRunning: setIsRunningFour } =
    useRandomNumber(number.four, (timeOut + 2) * 1000)
  const { randomNumber: threeNumber, setIsRunning: setIsRunningthree } =
    useRandomNumber(number.three, (timeOut + 4) * 1000)
  const { randomNumber: twoNumber, setIsRunning: setIsRunningTwo } =
    useRandomNumber(number.two, (timeOut + 5) * 1000)
  const { randomNumber: oneNumber, setIsRunning: setIsRunningOne } =
    useRandomNumber(number.one, (timeOut + 6) * 1000)

  const setIsRunning = () => {
    setIsRunningFive(true)
    setIsRunningFour(true)
    setIsRunningthree(true)
    setIsRunningTwo(true)
    setIsRunningOne(true)
  }

  // audio
  const [playingBgAudio, setPlayingBgAudio] = useState(false)
  const startAudioRef = useRef<React.ElementRef<'audio'>>(null)
  const winnerAudioRef = useRef<React.ElementRef<'audio'>>(null)
  const backgroundAudioRef = useRef<React.ElementRef<'audio'>>(null)
  const handleOnToggleBgAudio = (playingBgAudio: boolean) => {
    if (playingBgAudio) {
      backgroundAudioRef.current?.pause()
    } else {
      backgroundAudioRef.current?.play()
    }
    setPlayingBgAudio(!playingBgAudio)
  }

  // wheel
  const [spinning, setSpinning] = useState(false)

  // mutation
  const [randomFn, {}] = useMutation(SPIN_RANDOM, {
    //update cache
    update(cache, { data }) {
      const { randomWinner } = data
      const getCache: any = cache.readQuery({
        query: GET_FORTUNE,
        variables: { id: currentData.id },
      })
      const updatedData = {
        fortune: {
          ...getCache.fortune,
          persons: getCache.fortune.persons.filter(
            (person: Person) => person.id !== randomWinner.id,
          ),
          winners: [...getCache.fortune.winners, randomWinner],
          prizes: getCache.fortune.prizes.map((prize: Prize) => {
            if (prize.id === randomWinner.prizeId) {
              return {
                ...prize,
                qty: prize.qty - 1,
              }
            }
            return prize
          }),
        },
      }
      cache.writeQuery({
        query: GET_FORTUNE,
        variables: { id: currentData.id },
        data: updatedData,
      })
      // set next prizeId
      setTimeout(
        () => {
          setValue('prizes', updatedData.fortune.prizes)
          // set prizeId with prizé qty > 0
          const currentPrize = updatedData.fortune.prizes.find(
            (prize: Prize) => prize.id === randomWinner.prizeId,
          )
          if (currentPrize.qty === 0) {
            const findNextPrize = updatedData.fortune.prizes
              .reverse()
              .find((prize: Prize) => prize.qty > 0)
            if (!findNextPrize) return
            setValue('prizeId', findNextPrize.id)
          } else {
            setValue('prizeId', randomWinner.prizeId)
          }
        },
        (timeOut + 9) * 1000,
      )
    },
  })

  // RHF
  const defaultValues = useMemo(
    () => ({
      id: currentData?.id || 'demoTest',
      prizeId: demo ? 'demoTest' : '',
      prizes: currentData?.prizes || [],
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentData?.prizes],
  )

  const FormSchema = Yup.object().shape({
    id: Yup.string().required(),
    prizeId: Yup.string().required('Chưa nhập mã quay'),
  })

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(FormSchema),
    defaultValues,
  })

  const {
    handleSubmit,
    setValue,
    setError,
    watch,
    formState: { errors },
  } = methods

  useEffect(() => {
    setValue('id', currentData?.id || 'demoTest')
  }, [currentData.id, setValue])

  // set default select prize Id
  useEffect(() => {
    const prizes = watch('prizes')
    if (!prizes) return
    const findNextPrize = prizes.reverse().find((prize: Prize) => prize.qty > 0)

    if (!findNextPrize) return
    setValue('prizeId', findNextPrize.id)
  }, [])

  // onSubmit
  const onSubmit = async (data: FormValuesProps) => {
    if (spinning) return

    setSpinning(true)

    if (demo) {
      // random number
      const randomNumber = Math.floor(Math.random() * 90000) + 10000
      // set run & number
      setIsRunning()
      setNumber(extractDigits(randomNumber))
      // stop run
      setTimeout(
        () => {
          setSpinning(false)
          // winnerAudioRef.current?.play()
          // backgroundAudioRef && (backgroundAudioRef.current!.volume = 0.4)

          setWinner({
            manv: randomNumber.toString(),
            name: PERSONS_DEMO[Math.floor(Math.random() * PERSONS_DEMO.length)],
            prize: 'Giải đặc biệt',
            prizeId: '1',
          })
        },
        (timeOut + 8) * 1000,
      )

      setTimeout(
        () => {
          handleOnCloseDialog()
          setValue('prizeId', 'DemoTest')
          setNumber({
            five: 0,
            four: 0,
            three: 0,
            two: 0,
            one: 0,
          })
        },
        (timeOut + 14) * 1000,
      )

      // auto submit
      setTimeout(
        () => {
          handleSubmit(onSubmit)()
        },
        (timeOut + 16) * 1000,
      )

      return
    }

    // mutation database
    await randomFn({
      variables: {
        id: data?.id,
        input: {
          prizeId: data.prizeId,
        },
      },
      onCompleted: (data) => {
        // set winner number
        const winner = data?.randomWinner
        const newNumber = extractDigits(_.toNumber(winner.manv))
        setNumber(newNumber)
        setIsRunning()

        // start spinning sound
        // startAudioRef && startAudioRef?.current?.play()
        // backgroundAudioRef && (backgroundAudioRef.current!.volume = 0.4)

        setTimeout(
          async () => {
            setSpinning(false)
            // winnerAudioRef.current?.play()
            // backgroundAudioRef && (backgroundAudioRef.current!.volume = 1)
            setWinner(winner as Winner)
          },
          (timeOut + 8) * 1000,
        )
      },
      onError: (apolloError) => {
        setSpinning(false)
        const errors = MutationApolloError(apolloError)

        errors?.message?.map(({ field, message }) =>
          setError(field as keyof FormValuesProps, {
            message,
            type: 'manual',
          }),
        )
        //setIsProcessing(false)
      },
    })
  }

  const handleOnCloseDialog = () => {
    setWinner(null)
  }

  const { prizes } = watch()
  const title = currentData?.title

  return (
    <>
      <audio
        ref={startAudioRef}
        src="/sounds/tieng_vong_xoay_may_man.mp3"
        preload="auto"
      />
      <audio ref={winnerAudioRef} src="/sounds/nhac_nen_trao_giai_thuong.mp3" />
      <audio
        ref={backgroundAudioRef}
        src="/sounds/nhac_beat_lo_to_nhac_nen_keu_loto.mp3"
        preload="auto"
      />

      {/* Dialog show winner */}
      <Dialog open={Boolean(winner)} onClose={handleOnCloseDialog}>
        <DialogTitle>Sổ xố may mắn</DialogTitle>

        <DialogBody>
          <Text>
            Chúc mừng: <Strong>{winner?.name}</Strong> ! Bạn trúng:{' '}
            <Strong>{winner?.prize}</Strong>
          </Text>
        </DialogBody>
        <DialogActions>
          <Button autoFocus onClick={handleOnCloseDialog}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <Container>
        <h1 className="font-display mb-16 text-6xl/[0.9] font-medium tracking-tight text-balance text-gray-950 sm:text-8xl/[0.8] md:text-6xl/[0.8]">
          Con Số May Mắn
        </h1>
        <div className="flex flex-col items-center justify-center gap-4">
          <Flex className="flex-row gap-4 font-mono text-5xl text-orange-600 md:text-7xl">
            <BoxRing className="rounded-lg border-2 bg-zinc-100 p-2 text-center shadow-sm">
              <p>{fiveNumber || 0}</p>
            </BoxRing>
            <BoxRing className="rounded-lg border-2 bg-zinc-100 p-2 text-center shadow-sm">
              <p>{fourNumber || 0}</p>
            </BoxRing>
            <BoxRing className="rounded-lg border-2 bg-zinc-100 p-2 text-center shadow-sm">
              <p>{threeNumber || 0}</p>
            </BoxRing>
            <BoxRing className="rounded-lg border-2 bg-zinc-100 p-2 text-center shadow-sm">
              <p>{twoNumber || 0}</p>
            </BoxRing>
            <BoxRing className="rounded-lg border-2 bg-zinc-100 p-2 text-center shadow-sm">
              <p>{oneNumber || 0}</p>
            </BoxRing>
          </Flex>
        </div>
        {/* Wheel */}
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Fieldset
            disabled={spinning}
            className="mt-9 flex flex-col items-center justify-center gap-4"
          >
            <Field className="mt-8 space-y-3">
              <Label className="text-sm/5 font-medium">Chọn giải thưởng</Label>
            </Field>
            <RHFSelect disabled={demo} name="prizeId" className="w-48">
              {demo && <option value={1}>Giải DEMO</option>}
              <option>chọn...</option>
              {prizes &&
                prizes?.length > 0 &&
                prizes?.map((prize) => {
                  if (prize.qty === 0) return
                  return (
                    <option key={prize.id} value={prize.id}>
                      {prize.name} ({prize.qty} phần thưởng)
                    </option>
                  )
                })}
            </RHFSelect>
            {errors && errors.errorMessage && (
              <Field>
                <ErrorMessage>{errors.errorMessage.message}</ErrorMessage>
              </Field>
            )}

            <Button
              autoFocus
              type="submit"
              disabled={spinning}
              className="w-48"
            >
              {spinning ? 'Đang Quay...' : 'Quay Ngay'}
            </Button>

            <Flex className="flex-row gap-4">
              <Button
                onClick={() => handleOnToggleBgAudio(playingBgAudio)}
                variant="secondary"
              >
                {playingBgAudio ? (
                  <SpeakerXMarkIcon className="size-6" />
                ) : (
                  <MusicalNoteIcon className="size-6" />
                )}
              </Button>
              <SettingBtn btnIcon type="random" />
            </Flex>
          </Fieldset>
        </FormProvider>
      </Container>
    </>
  )
}

function extractDigits(number: number) {
  let five = Math.floor(number / 10000) % 10 // Lấy hàng chục nghìn
  let four = Math.floor(number / 1000) % 10 // Lấy hàng nghìn
  let three = Math.floor(number / 100) % 10 // Lấy hàng trăm
  let two = Math.floor(number / 10) % 10 // Lấy hàng chục
  let one = number % 10 // Lấy hàng đơn vị

  return {
    five,
    four,
    three,
    two,
    one,
  }
}
