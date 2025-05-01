import { useFormContext, Controller } from 'react-hook-form'
import InputRequired from './InputRequired'
import {
  type InputProps as HeadlessInputProps,
} from '@headlessui/react'
import { Description, ErrorMessage, Field, Label } from '../fieldset'
import { Input } from '../input'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'

type Props = HeadlessInputProps & {
  description?: string
  label?: string
  name: string
  className?: string
}

export default function RHFTextField({
  name,
  label,
  description,
  type = 'text',
  className,
  ...other
}: Props) {
  const [hide, setHide] = useState(true)
  const { control } = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const { value, ...copyField } = field
        return (
          <Field disabled={other.disabled} className={className}>
            {label && (
              <Label>
                {label} {other.required && <InputRequired />}
              </Label>
            )}

            {type !== 'password' ? (
              <>
                <Input
                  {...copyField}
                  value={type === 'number' && value === 0 ? '' : value}
                  onChange={(event) => {
                    if (type === 'number') {
                      field.onChange(Number(event.target.value))
                    } else {
                      field.onChange(event.target.value)
                    }
                  }}
                  {...other}
                  type={type}
                  name={name}
                  id={name}
                  ref={field.ref}
                  invalid={error ? true : false}
                />
              </>
            ) : (
              <>
                <div className="relative mt-2 rounded-md shadow-sm">
                  <Input
                    {...field}
                    {...other}
                    type={hide ? 'password' : 'text'}
                    name={name}
                    id={name}
                    ref={field.ref}
                    invalid={error ? true : false}
                  />

                  <div className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3">
                    {hide ? (
                      <>
                        <EyeIcon
                          className="h-5 w-5 cursor-pointer text-gray-400 hover:text-indigo-400"
                          aria-hidden="true"
                          onClick={() => setHide(false)}
                        />
                      </>
                    ) : (
                      <>
                        <EyeSlashIcon
                          className="h-5 w-5 cursor-pointer text-gray-400 hover:text-indigo-400"
                          aria-hidden="true"
                          onClick={() => setHide(true)}
                        />
                      </>
                    )}
                  </div>
                </div>
              </>
            )}

            {description && <Description>{description || ''}</Description>}

            {error && (
              <ErrorMessage>
                {error ? error?.message : 'Not a valid Input.'}
              </ErrorMessage>
            )}
          </Field>
        )
      }}
    />
  )
}
