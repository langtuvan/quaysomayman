'use client'
import { useFormContext, Controller } from 'react-hook-form'
import InputRequired from './InputRequired'

import {
  type TextareaProps 
  
} from '@headlessui/react'

import { Description, ErrorMessage, Field, Label } from '@/components/fieldset'
import { Textarea } from '@/components/textarea'
type Props = TextareaProps & {
  description?: string
  label?: string
  name: string
  rows?: number
  className?: string
}

export default function RHFTextAreas({
  description,
  label,
  name,
  rows = 3,
  className,
  ...other
}: Props) {
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

          <Textarea
            {...field}
            {...other}
            name={name}
            id={name}
            ref={field.ref}
            rows={rows}
            invalid={error ? true : false}
          />

          {description && <Description>{description || ''}</Description>}

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
