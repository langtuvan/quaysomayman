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
import { useCustomRouter } from '@/hooks/useCustomRouter'
import { MusicalNoteIcon, SpeakerXMarkIcon } from '@heroicons/react/20/solid'
import { ChevronDoubleDownIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import { motion } from 'framer-motion'
import { useMemo, useRef, useState } from 'react'
// React Hook Form
import FormProvider from '@/components/hook-form/FormProvider'
import { SPIN_WHEEL } from '@/graphql/fortune'
import { useMutation } from '@apollo/client'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'
import SettingBtn from '../form/SettingBtn'
// mock
import { persons as PERSONS_DEMO } from '@/_mock/fortune'
import { Fieldset } from '@/components/fieldset'
import { RHFTextField } from '@/components/hook-form'

const timeOut = 21

type Person = {
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
  player: string
}

type CurrentDataProps = {
  id: string
  title: string
  persons: Person[]
  prizes: Prize[]
}

type Props = {
  demo?: boolean
  currentData: CurrentDataProps
  getPlayer?: string
  autoPlay?: boolean
  isCurrentUser?: boolean
  autoList?: Person[]
}

export default function WheelFortuneForm({
  demo = false,
  currentData,
  getPlayer,
  autoPlay = false,
  isCurrentUser = false,
  autoList = [],
}: Props) {
  const prizes = currentData?.prizes || []
  // hooks
  const { removeQueryParam } = useCustomRouter()
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
  const [angle, setAngle] = useState(0)
  const [winner, setWinner] = useState<Winner | null>(null)
  const [spinning, setSpinning] = useState(false)
  const segmentAngle = 360 / prizes?.length

  // RHF
  const defaultValues = useMemo(
    () => ({
      id: !demo ? currentData?.id || '' : 'demoTest',
      //player: getPlayer,
      player: !demo ? getPlayer || '' : 'demoTest',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [getPlayer],
  )

  const FormSchema = Yup.object().shape({
    id: Yup.string().required(),
    player: Yup.string().required('Chưa nhập mã quay'),
    // .test('check-prizes-available', 'Đã hết giải thưởng', (_, ctx) => {
    //   const availablePrizes = prizes.some((prize: any) => prize.qty > 0)
    //   ctx.createError({
    //     path: 'prizes',
    //     message: 'Đã hết giải thưởng',
    //   }) // create error to show message
    //   return availablePrizes
    // })
    // .test('check-player-won', 'Mã quay đã trúng giải', (value, ctx) => {
    //   const winner = winners?.find((winner: Winner) => winner.manv === value)
    //   return !winner
    // })
    // .test('check-player-exists', 'Mã quay không tồn tại', (value, ctx) => {
    //   const person = persons.find((person: Person) => person.manv === value)
    //   return !!person
    // }),
  })

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(FormSchema),
    defaultValues,
  })

  const { handleSubmit, setValue, setError, getValues } = methods

  // mutation
  const [spinWheelFn, {}] = useMutation(SPIN_WHEEL, {})

  // onSubmit
  const onSubmit = async (data: FormValuesProps) => {
    if (spinning) return

    if (demo) {
      // Select random prize from available ones
      const randomPrizeIndex = Math.floor(Math.random() * prizes.length)
      spinWheel(prizes[randomPrizeIndex].id)
      // stop spinning
      setTimeout(
        async () => {
          setSpinning(false)
          winnerAudioRef.current?.play()
          backgroundAudioRef &&
            backgroundAudioRef.current &&
            backgroundAudioRef.current.volume &&
            (backgroundAudioRef.current!.volume = 1)

          setWinner({
            manv: 'DemoTest',
            name: PERSONS_DEMO[Math.floor(Math.random() * PERSONS_DEMO.length)],
            prize: prizes[randomPrizeIndex].name,
            prizeId: prizes[randomPrizeIndex].id,
          })
        },
        (timeOut + 1) * 1000,
      )

      if (autoPlay) {
        // onClose dialog
        setTimeout(
          () => {
            handleOnCloseDialog()
            // setValue('player', '')
          },
          (timeOut + 10) * 1000,
        )

        // auto play next player
        setTimeout(
          () => {
            setValue('player', 'DemoTest')
          },
          (timeOut + 12) * 1000,
        )

        // auto submit
        setTimeout(
          () => {
            handleSubmit(onSubmit)()
          },
          (timeOut + 14) * 1000,
        )
      }

      return
    }
    spinWheelFn({
      variables: {
        id: data?.id,
        input: {
          player: data.player,
        },
      },

      onCompleted: (data) => {
        const winner = data?.winner
        spinWheel(winner?.prizeId)
        // stop spinning
        setTimeout(
          async () => {
            setSpinning(false)
            winnerAudioRef.current?.play()
            backgroundAudioRef && (backgroundAudioRef.current!.volume = 1)
            winner && setWinner(winner as Winner)
          },
          (timeOut + 1) * 1000,
        )

        if (autoPlay && isCurrentUser && autoList.length > 0) {
          const getPlayerIndex = autoList.findIndex(
            (person) => person.manv === getValues('player'),
          )

          // if autoList.length === getplayerIndex + 1 then stop auto play
          if (autoList.length === getPlayerIndex + 1) {
            return
          }

          // onClose dialog
          setTimeout(
            () => {
              handleOnCloseDialog()
              // setValue('player', '')
            },
            (timeOut + 10) * 1000,
          )

          // auto play next player
          setTimeout(
            () => {
              setValue('player', autoList[getPlayerIndex + 1].manv, {
                shouldDirty: true,
                shouldTouch: true,
              })
              removeQueryParam(['player'])
            },
            (timeOut + 12) * 1000,
          )

          // auto submit
          setTimeout(
            () => {
              handleSubmit(onSubmit)()
            },
            (timeOut + 14) * 1000,
          )
        }
      },
      onError: (error: any) => {
        const graphQLErrors = error.graphQLErrors[0]
        if (graphQLErrors) {
          return setError('player', {
            type: 'manual',
            message: graphQLErrors?.message || 'Mã quay không hợp lệ',
          })
        }
      },
    })
  }

  const spinWheel = async (winnerPrizeId: string) => {
    // start spinning sound
    startAudioRef && startAudioRef?.current?.play()
    backgroundAudioRef &&
      backgroundAudioRef.current &&
      backgroundAudioRef.current.volume &&
      (backgroundAudioRef.current!.volume = 0.4)
    setAngle(0)

    // Randomize the number of turns and the final angle
    const randomTurns =
      Math.floor(Math.random() * (prizes.length - 1)) + (prizes.length - 1)
    const finalAngle = randomTurns * 360 + Math.floor(Math.random() * 360)

    const WheelIndex =
      Math.floor((360 - ((angle + finalAngle) % 360)) / segmentAngle) %
      prizes.length

    const selectedWheel = prizes[WheelIndex]

    //check if selected prize is the same as selected wheel
    if (winnerPrizeId !== selectedWheel.id) {
      return spinWheel(winnerPrizeId)
    }
    setAngle(finalAngle)
    setSpinning(true)
  }

  const handleOnCloseDialog = () => {
    setWinner(null)
    setAngle(0)
  }

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
        <DialogTitle>Vòng quay may mắn</DialogTitle>

        <DialogBody>
          <Text>
            Chúc mừng: <Strong>{winner?.name}</Strong> ! Bạn trúng:{' '}
            <Strong>{winner?.prize}</Strong>
          </Text>
        </DialogBody>
        <DialogActions>
          <Button onClick={handleOnCloseDialog}>Cancel</Button>
        </DialogActions>
      </Dialog>
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="font-display mb-16 text-6xl/[0.9] font-medium tracking-tight text-balance text-gray-950 sm:text-8xl/[0.8] md:text-6xl/[0.8]">
          Vòng Quay May Mắn
        </h1>
        <div className="relative mt-6">
          <div className="absolute -top-2 left-1/2 z-50 -translate-x-1/2 -translate-y-1 transform bg-yellow-200">
            <ChevronDoubleDownIcon className="size-9" />
          </div>
          <motion.div
            animate={{ rotate: angle }}
            transition={{
              duration: spinning ? timeOut : 0,
              ease: 'easeOut',
            }}
            className="relative flex h-96 w-96 items-center justify-center rounded-full border-4 border-gray-800 bg-white shadow-lg"
            style={{
              background: clsx(
                prizes.length === 3 &&
                  `conic-gradient( #FF6B6B 0deg ${360 / 3}deg, #4ECDC4 ${360 / 3}deg ${(2 * 360) / 3}deg, #45B7D1 ${(2 * 360) / 3}deg 360deg )`,
                prizes.length === 4 &&
                  `conic-gradient( #FF6B6B 0deg ${360 / 4}deg, #4ECDC4 ${360 / 4}deg ${(2 * 360) / 4}deg, #45B7D1 ${(2 * 360) / 4}deg ${(3 * 360) / 4}deg, #96CEB4 ${(3 * 360) / 4}deg 360deg )`,

                prizes.length === 5 &&
                  `conic-gradient( #FF6B6B 0deg ${360 / 5}deg, #4ECDC4 ${360 / 5}deg ${(2 * 360) / 5}deg, #45B7D1 ${(2 * 360) / 5}deg ${(3 * 360) / 5}deg, #96CEB4 ${(3 * 360) / 5}deg ${(4 * 360) / 5}deg, #FFEEAD ${(4 * 360) / 5}deg 360deg )`,
                prizes.length === 6 &&
                  `conic-gradient( #FF6B6B 0deg ${360 / 6}deg, #4ECDC4 ${360 / 6}deg ${(2 * 360) / 6}deg, #45B7D1 ${(2 * 360) / 6}deg ${(3 * 360) / 6}deg, #96CEB4 ${(3 * 360) / 6}deg ${(4 * 360) / 6}deg, #FFEEAD ${(4 * 360) / 6}deg ${(5 * 360) / 6}deg, #D4A5A5 ${(5 * 360) / 6}deg 360deg )`,
                prizes.length === 7 &&
                  `conic-gradient( #FF6B6B 0deg ${360 / 7}deg, #4ECDC4 ${360 / 7}deg ${(2 * 360) / 7}deg, #45B7D1 ${(2 * 360) / 7}deg ${(3 * 360) / 7}deg, #96CEB4 ${(3 * 360) / 7}deg ${(4 * 360) / 7}deg, #FFEEAD ${(4 * 360) / 7}deg ${(5 * 360) / 7}deg, #D4A5A5 ${(5 * 360) / 7}deg ${(6 * 360) / 7}deg, #4ECDC4 ${(6 * 360) / 7}deg 360deg )`,
                prizes.length === 8 &&
                  `conic-gradient( #FF6B6B 0deg ${360 / 8}deg, #4ECDC4 ${360 / 8}deg ${(2 * 360) / 8}deg, #45B7D1 ${(2 * 360) / 8}deg ${(3 * 360) / 8}deg, #96CEB4 ${(3 * 360) / 8}deg ${(4 * 360) / 8}deg, #FFEEAD ${(4 * 360) / 8}deg ${(5 * 360) / 8}deg, #D4A5A5 ${(5 * 360) / 8}deg ${(6 * 360) / 8}deg, #4ECDC4 ${(6 * 360) / 8}deg ${(7 * 360) / 8}deg, #45B7D1 ${(7 * 360) / 8}deg 360deg )`,
                prizes.length === 9 &&
                  `conic-gradient( #FF6B6B 0deg ${360 / 9}deg, #4ECDC4 ${360 / 9}deg ${(2 * 360) / 9}deg, #45B7D1 ${(2 * 360) / 9}deg ${(3 * 360) / 9}deg, #96CEB4 ${(3 * 360) / 9}deg ${(4 * 360) / 9}deg, #FFEEAD ${(4 * 360) / 9}deg ${(5 * 360) / 9}deg, #D4A5A5 ${(5 * 360) / 9}deg ${(6 * 360) / 9}deg, #4ECDC4 ${(6 * 360) / 9}deg ${(7 * 360) / 9}deg, #45B7D1 ${(7 * 360) / 9}deg ${(8 * 360) / 9}deg, #96CEB4 ${(8 * 360) / 9}deg 360deg`,
                prizes.length === 10 &&
                  `conic-gradient( #FF6B6B 0deg ${360 / 10}deg, #4ECDC4 ${360 / 10}deg ${(2 * 360) / 10}deg, #45B7D1 ${(2 * 360) / 10}deg ${(3 * 360) / 10}deg, #96CEB4 ${(3 * 360) / 10}deg ${(4 * 360) / 10}deg, #FFEEAD ${(4 * 360) / 10}deg ${(5 * 360) / 10}deg, #D4A5A5 ${(5 * 360) / 10}deg ${(6 * 360) / 10}deg, #4ECDC4 ${(6 * 360) / 10}deg ${(7 * 360) / 10}deg, #45B7D1 ${(7 * 360) / 10}deg ${(8 * 360) / 10}deg, #96CEB4 ${(8 * 360) / 10}deg ${(9 * 360) / 10}deg, #FFEEAD ${(9 * 360) / 10}deg 360deg`,
              ),
            }}
          >
            {prizes.map((prize, index) => (
              <div
                key={index}
                className="absolute font-bold text-white"
                style={{
                  transform: `rotate(${index * segmentAngle + segmentAngle / 2}deg) translateY(-120px) rotate(-${index * segmentAngle + segmentAngle / 2}deg)`,
                  textAlign: 'center',
                  width: '100px',
                  left: '50%',
                  marginLeft: '-50px',
                }}
              >
                {prize.name}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
      {/* Wheel */}
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Fieldset
          disabled={spinning}
          className="mt-9 flex flex-col items-center justify-center gap-4"
        >
          <RHFTextField
            disabled={demo}
            label="Nhập Mã "
            name="player"
            className="w-48"
            type="text"
            placeholder="Nhập Mã "
          />
          {/* 
          <Field>
            <Label>Nhập Mã</Label>

            <Input
              disabled={demo}
              name="player"
              type="text"
              placeholder="Nhập Mã "
              className={clsx(
                'block w-full rounded-lg border border-transparent shadow-sm ring-1 ring-black/10',
                'px-[calc(--spacing(2)-1px)] py-[calc(--spacing(1.5)-1px)] text-base/6 sm:text-sm/6',
                'w-48 data-focus:outline data-focus:outline-2 data-focus:-outline-offset-1 data-focus:outline-black',
              )}
            />
          </Field> */}

          <Button
            type="submit"
            color="indigo"
            disabled={spinning}
            className="w-48"
          >
            {spinning ? 'Đang Quay...' : 'Quay Ngay'}
          </Button>

          <Flex className="flex-row gap-4">
            <Button onClick={() => handleOnToggleBgAudio(playingBgAudio)}>
              {playingBgAudio ? (
                <SpeakerXMarkIcon className="size-6" />
              ) : (
                <MusicalNoteIcon className="size-6" />
              )}
            </Button>
            <SettingBtn btnIcon type="wheel" />
          </Flex>
        </Fieldset>
      </FormProvider>
    </>
  )
}
