'use client'
// Ui
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/table'
// React Hook Form
import { useFieldArray, useFormContext } from 'react-hook-form'

export default function WheelWinnersForm() {
  const { control } = useFormContext()
  const { fields } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormProvider)
    name: 'winners', // unique name for your Field Array
    keyName: 'fieldId',
    //rules: { minLength: 1, maxLength: 4 },
  })

  // Sort fields by manv (employee ID) in ascending order
  // const sortedFields = [...fields].sort((a: any, b: any) =>
  //   a.key.localeCompare(b.key, undefined, { numeric: true }),
  // )

  // sort by prize key number
  const sortedFields = [...fields].sort((a: any, b: any) => a.key - b.key)

  return (
    <Table grid dense striped className="h-96 overflow-y-scroll">
      <TableHead>
        <TableRow className="bg-slate-100">
          <TableHeader>STT</TableHeader>
          <TableHeader>Mã NV</TableHeader>
          <TableHeader>Họ Tên</TableHeader>
          <TableHeader>Giải thưởng</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {sortedFields &&
          sortedFields.length > 0 &&
          sortedFields.map((winner: any, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell className="font-medium">{winner.manv}</TableCell>
              <TableCell>{winner.name}</TableCell>
              <TableCell className="text-zinc-500">{winner.prize}</TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  )
}
