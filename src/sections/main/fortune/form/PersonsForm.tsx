'use client'
import { Button } from '@/components/button'
import { Dialog, DialogBody, DialogTitle } from '@/components/dialog'
import { Divider } from '@/components/divider'
import { Description, Field, Label } from '@/components/fieldset'
import { CopyIcon, TrashIcon } from '@/components/Icon/ActionIcon'
import { Textarea } from '@/components/textarea'
import { useRef, useState } from 'react'
// Ui
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/table'
// Table
import {
  //ColumnResizeMode,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  //SortingState,
  //SortingTableState,
  useReactTable,
} from '@tanstack/react-table'
// React Hook Form
import {
  Dropdown,
  DropdownButton,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
} from '@/components/dropdown'
import { Input } from '@/components/input'
import { ChevronUpDownIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import { useFieldArray, useFormContext } from 'react-hook-form'

import { Checkbox } from '@/components/checkbox'
import { BASE_URL } from '@/config-global'
import { paths } from '@/routes/paths'
import { ViewColumnsIcon } from '@heroicons/react/24/outline'

interface ColumnFilter {
  id: string
  value: any
}
type ColumnFiltersState = ColumnFilter[]

const columnHelper = createColumnHelper<any>()

const columns = [
  // columnHelper.accessor('id', {
  //   id: 'id',
  // }),

  columnHelper.display({
    id: 'index',
    size: 50,
    //enableColumnFilter: false,
    enableSorting: true,
    enableResizing: false,
    header: () => (
      <div className="text-center">
        <strong>STT</strong>
      </div>
    ),
    cell: ({ row }) => <div className="text-center">{row.index + 1}</div>,
  }),

  columnHelper.accessor('manv', {
    cell: (info) => <span className="runcate">{info.getValue()}</span>,
    header: ({ column }) => (
      <span className="flex w-full items-center justify-between gap-2">
        <strong>Mã</strong>
        <ChevronUpDownIcon className="h-4 w-4" />
      </span>
    ),
  }),
  columnHelper.accessor('name', {
    cell: (info) => <span className="runcate">{info.getValue()}</span>,
    header: ({ column }) => (
      <span className="flex w-full items-center justify-between gap-2">
        <strong>Họ Tên</strong>
        <ChevronUpDownIcon className="h-4 w-4" />
      </span>
    ),
  }),
]

export default function WheelPersonsForm() {
  const [openDialog, setOpenDialog] = useState(false)
  const { control, getValues } = useFormContext()
  const { fields, append, remove } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormProvider)
    name: 'persons', // unique name for your Field Array
  })

  const inputRef = useRef<any>('')

  const handleAddPerson = () => {
    // convert string to array
    const textAreaValue = inputRef.current.value
    const persons = textAreaValue.split('\n').map((person: any) => {
      const [manv, ...name] = person.split(' ')
      const newName = name.join(' ')
      return { id: 'new', manv, name: newName }
    })
    persons.forEach((person: any) => {
      if (!person.manv || !person.name) return
      append(person)
    })

    inputRef.current.value = ''
    setOpenDialog(false)
  }

  const handleRemovePerson = (index: number) => {
    remove(index)
  }

  // @tanstack/react-table
  const [columnVisibility, setColumnVisibility] = useState({})
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]) // can set initial column filter state here
  //const [sorting, setSorting] = useState<SortingState>([])
  const [columnSizing, setColumnSizing] = useState<any>({})
  const [columnOrder, setColumnOrder] = useState(['index', 'manv', 'name'])

  // Add drag and drop functionality to header cells
  const [draggedColumn, setDraggedColumn] = useState<string | null>(null)

  function handleDragStart(columnId: string) {
    setDraggedColumn(columnId)
  }

  function handleDragOver(e: React.DragEvent, targetColumnId: string) {
    e.preventDefault()
    if (!draggedColumn || draggedColumn === targetColumnId) return

    const currentOrder = [...columnOrder]
    const draggedIdx = currentOrder.indexOf(draggedColumn)
    const targetIdx = currentOrder.indexOf(targetColumnId)

    if (draggedIdx !== -1 && targetIdx !== -1) {
      currentOrder.splice(draggedIdx, 1)
      currentOrder.splice(targetIdx, 0, draggedColumn)
      setColumnOrder(currentOrder)
    }
  }

  const table = useReactTable({
    data: fields,
    columns,
    getCoreRowModel: getCoreRowModel(), // rows
    getSortedRowModel: getSortedRowModel(), // sort
    getFilteredRowModel: getFilteredRowModel(), //filter needed for client-side filtering
    defaultColumn: {
      //size: 100, //starting column size
      minSize: 30, //enforced during column resizing
      maxSize: 1000, //enforced during column resizing
    },
    initialState: {
      columnVisibility: {
        id: true,
      },
    },
    state: {
      columnFilters,
      //sorting,
      columnSizing,
      columnOrder,
      columnVisibility,
    },
    //columnResizeMode: 'onChange' as ColumnResizeMode,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnOrderChange: setColumnOrder,
    onColumnFiltersChange: setColumnFilters,
    //onSortingChange: setSorting,
    onColumnSizingChange: setColumnSizing,
  })

  // Add ColumnChooser component
  function ColumnChooser() {
    return (
      <Dropdown>
        <DropdownButton>
          <ViewColumnsIcon className="h-4 w-4" />
        </DropdownButton>
        <DropdownMenu anchor="bottom">
          {table
            .getAllColumns()
            .filter((column) => column.getCanHide())
            // .filter((column) => column.getCanHide() && column.id !== 'id')
            .map((column) => {
              return (
                <DropdownItem
                  key={column.id}
                  className="flex items-center space-x-2"
                >
                  <Checkbox
                    checked={column.getIsVisible()}
                    onChange={(value) => {
                      column.toggleVisibility(!!value)
                    }}
                    // onCheckedChange={(value) =>
                    //   column.toggleVisibility(!!value)
                    // }
                  />
                  <DropdownLabel>
                    {column.id === 'manv'
                      ? 'Mã'
                      : column.id === 'name'
                        ? 'Họ Tên'
                        : column.id === 'index'
                          ? 'STT'
                          : column.id}
                  </DropdownLabel>
                </DropdownItem>
              )
            })}
        </DropdownMenu>
      </Dropdown>
    )
  }

  // cofig
  const type = getValues('type')
  const id = getValues('id')
  const generateUrl = (manv: number) => {
    if (type === 'wheel') {
      return BASE_URL + paths.main.fortune.wheel.detail(id) + '?player=' + manv
    }
    return BASE_URL + paths.main.fortune.random.detail(id) + '?player=' + manv
  }

  return (
    <>
      {/* <Box className="mb-4 flex items-center justify-end rounded-md p-2 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
        <ColumnChooser />
      </Box> */}

      <Table grid dense striped className="h-96 overflow-y-scroll">
        <TableHead>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow className="bg-zinc-100" key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHeader
                  key={header.id}
                  draggable={header.column.getCanSort()}
                  onDragStart={() => handleDragStart(header.column.id)}
                  onDragOver={(e) => handleDragOver(e, header.column.id)}
                  className={clsx(
                    'relative',
                    header.column.getCanSort()
                      ? 'cursor-pointer select-none'
                      : '',
                    draggedColumn === header.column.id ? 'opacity-50' : '',
                  )}
                  style={{
                    width: header.getSize(),
                  }}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                  {header.column.getCanResize() && (
                    <div
                      onMouseDown={header.getResizeHandler()}
                      onTouchStart={header.getResizeHandler()}
                      className={`resizer ${
                        header.column.getIsResizing() ? 'isResizing' : ''
                      }`}
                    />
                  )}
                </TableHeader>
              ))}
              <TableHeader className="w-10 text-center">#</TableHeader>
              <TableHeader className="w-10 text-center">#</TableHeader>
            </TableRow>
          ))}

          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableCell key={header.id}>
                  {header.isPlaceholder ? null : (
                    <>
                      {header.column.getCanFilter() ? (
                        <>
                          <Input
                            type="text"
                            //value={header.column.getFilterValue()}
                            onChange={(e) =>
                              header.column.setFilterValue(e.target.value)
                            }
                          />
                        </>
                      ) : null}
                    </>
                  )}
                </TableCell>
              ))}
              <TableCell></TableCell>
              <TableCell></TableCell>
            </TableRow>
          ))}
        </TableHead>

        <TableBody>
          {table.getRowModel().rows.map((row, index) => (
            <TableRow key={row.id + index}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
              <TableCell className="w-10 text-center">
                <TrashIcon
                  onClick={() => {
                    handleRemovePerson(index)
                  }}
                />
              </TableCell>
              <TableCell className="w-10 text-center">
                <CopyIcon value={generateUrl(row.original.manv)} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Divider className="my-6" />

      <Button
        variant="secondary"
        className="float-right"
        onClick={() => setOpenDialog(true)}
      >
        {' '}
        + Thêm mã
      </Button>

      <Dialog open={openDialog} onClose={setOpenDialog}>
        <DialogTitle>Refund payment</DialogTitle>

        <DialogBody>
          <Field className="mt-9">
            <Label htmlFor="persons">Thêm người mới</Label>
            <Description>
              Nhập danh sách người tham gia quay thưởng, mỗi người trên một dòng
              <br />
              Ví dụ: <br />
              123456 Nguyễn Văn A <br />
              123457 Trần Văn B <br />
              123458 Lê Thị C <br />
            </Description>
            <Textarea
              ref={inputRef}
              id="persons"
              rows={10}
              placeholder="Nhập danh sách người tham gia"
            />

            <Button
              onClick={handleAddPerson}
              className="mt-4 w-full"
              variant="secondary"
            >
              Thêm
            </Button>
          </Field>
        </DialogBody>
      </Dialog>
    </>
  )
}
