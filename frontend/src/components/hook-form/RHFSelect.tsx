
//import { SelectProps } from '@headlessui/react'
import { useFormContext, Controller } from 'react-hook-form'
import InputRequired from './InputRequired'
import { ErrorMessage, Field, Label } from '../fieldset'
import { Select } from '../select'
type Props = any & {
  name: string
  label: string
}

export default function RHFSelect({ name, label, className, ...other }: Props) {
  const { control } = useFormContext()
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Field disabled={other.disabled} className={className}>
          {label && (
            <Label>
              {label} {other.required && <InputRequired />}
            </Label>
          )}

          <Select
            {...field}
            {...other}
            ref={field.ref}
            name={name}
            id={name}
            autoComplete={name}
            invalid={error ? true : false}
          />

          {error && (
            <ErrorMessage>
              {error ? error?.message : 'Not a valid Input.'}
            </ErrorMessage>
          )}
        </Field>
      )}
    />
  )
}
