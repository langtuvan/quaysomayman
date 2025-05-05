'use client'
// Ui
import { Fieldset } from '@/components/fieldset'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/table'
// React Hook Form
import { TrashIcon } from '@/components/Icon/ActionIcon'
import { Badge } from '@/components/badge'
import { Button } from '@/components/button'
// import { Input } from '@/components/input'
import { MinusIcon, PlusIcon } from '@heroicons/react/20/solid'
import clsx from 'clsx'
import _ from 'lodash'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { Input } from '@headlessui/react'

export default function WheelPrizesForm() {
  const { control, setValue, getValues, watch } = useFormContext()
  const { fields, append, remove, update } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormProvider)
    name: 'prizes', // unique name for your Field Array
    keyName: 'fieldId', // unique key for each item in the list (default: id)
    rules: { minLength: 4, maxLength: 8 },
  })

  const handleAdd = () => {
    if (fields.length >= 8) return
    const keyArr = fields?.map((item: any) => item.key) || []
    const maxNumber = keyArr.length === 0 ? 0 : Math.max(...keyArr)
    append({
      //id: 'new',
      key: maxNumber + 1,
      name: '',
      qty: 1,
    })
  }

  const handleRemove = (index: number) => {
    const findItem: any = fields[index]
    if (winners.some((item: any) => item.prizeId === findItem?.id)) {
      alert('Giải thưởng đã có người trúng, không thể xóa!')
      return
    }
    remove(index)
  }

  const onChangeQuantity = (index: number, action: 'inc' | 'des') => {
    const prize = watch(`prizes[${index}]`)
    if (prize.qty <= 1 && action === 'des') return
    const updateQty = action === 'inc' ? prize.qty + 1 : prize.qty - 1

    update(index, {
      id: prize.id,
      key: prize.key,
      name: prize.name,
      qty: updateQty,
    })
  }

  const winners = watch('winners')
  const sumByPrizesQty = _.sumBy(watch('prizes'), 'qty')

  return (
    <>
      <Fieldset>
        <Table grid dense striped className="h-96 overflow-y-scroll">
          <TableHead>
            <TableRow className="bg-slate-100">
              <TableHeader>STT</TableHeader>
              <TableHeader>
                Tên giải <Badge>{fields?.length || 0}</Badge>
              </TableHeader>
              <TableHeader>
                Số lượng <Badge>{sumByPrizesQty}</Badge>
              </TableHeader>
              <TableHeader>#</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {fields &&
              fields.length > 0 &&
              fields.map((prize: any, index: number) => (
                <TableRow key={prize.fieldId}>
                  <TableCell className="font-medium">{prize.key}</TableCell>

                  <TableCell className="font-medium">
                    <Input
                      disabled={
                        winners.some(
                          (item: any) => item.prizeId === prize.id,
                        ) || false
                      }
                      name={`prizes[${index}].name`}
                      value={getValues(`prizes[${index}].name`)}
                      onChange={(e) =>
                        setValue(`prizes[${index}].name`, e.target.value)
                      }
                      className={clsx(
                        'block w-full rounded-lg border border-transparent shadow-sm ring-1 ring-black/10',
                        'px-[calc(--spacing(2)-1px)] py-[calc(--spacing(1.5)-1px)] text-base/6 sm:text-sm/6',
                        'data-focus:outline data-focus:outline-2 data-focus:-outline-offset-1 data-focus:outline-black',
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <span className="isolate inline-flex items-center gap-x-2 rounded-md border border-gray-300 p-2 text-center shadow-sm ring-1 ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
                      <MinusIcon
                        aria-hidden="true"
                        className="h-5 w-5 cursor-pointer hover:text-slate-500 active:scale-90 active:text-slate-700"
                        onClick={() => onChangeQuantity(index, 'des')}
                      />

                      <span className="text-md w-6 text-center active:scale-90">
                        {getValues(`prizes[${index}].qty`)}
                      </span>

                      <PlusIcon
                        aria-hidden="true"
                        className="h-5 w-5 cursor-pointer hover:text-slate-500 active:text-slate-700"
                        onClick={() => onChangeQuantity(index, 'inc')}
                      />
                    </span>
                  </TableCell>
                  <TableCell>
                    <TrashIcon onClick={() => handleRemove(index)} />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>

        <Button
          variant="secondary"
          className="float-right mt-6"
          onClick={() => handleAdd()}
        >
          + Thêm giải
        </Button>
      </Fieldset>
    </>
  )
}
