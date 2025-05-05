import React from 'react'
import { useFormContext, Controller } from 'react-hook-form'
import {  Switch } from '../switch'
import InputRequired from './InputRequired'
import { ErrorMessage, Field, Label } from '../fieldset'
import { type SwitchProps as HeadlessSwitchProps } from '@headlessui/react'
import clsx from 'clsx'
type Props = {
  label?: string
  name: string
  required: boolean
  className?: string
} & Omit<HeadlessSwitchProps, 'children'>

function RHFSwitch({
  label,
  name,
  required,
  className,
  color,
  ...other
}: Props) {
  const { control } = useFormContext()
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: fieldValue, fieldState: { error } }) => {
        const { ref, ...field } = fieldValue
        return (
          <Field
            disabled={other.disabled}
            className={clsx(
              'flex items-center gap-4 sm:flex-row sm:align-middle',
              className,
            )}
          >
            {label && (
              <Label>
                {label} {required && <InputRequired />}
              </Label>
            )}

            <Switch
              checked={field.value}
              {...field}
              name={name}
              color={(color as any) || 'sky'}
              
              //{...other}
            />

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

export default RHFSwitch
