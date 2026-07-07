"use client"

import { useForm, UseFormReturn, FieldValues, ControllerRenderProps } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ZodType, z } from "zod"
import { useState, useCallback } from "react"

export type { UseFormReturn, FieldValues, ControllerRenderProps }

/**
 * Hook for form validation with Zod schema
 */
export function useZodForm<TSchema extends z.ZodType>(
  schema: TSchema,
  defaultValues?: z.infer<TSchema>
) {
  const form = useForm({
    resolver: zodResolver(schema) as any,
    defaultValues,
    mode: "onBlur",
  })

  return form
}

/**
 * Hook for async form submission with loading state
 */
export function useAsyncForm<T extends FieldValues>(
  form: UseFormReturn<T>,
  onSubmit: (data: T) => Promise<void>
) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const handleSubmit = useCallback(
    async (data: T) => {
      setIsSubmitting(true)
      setSubmitError(null)
      setSubmitSuccess(false)

      try {
        await onSubmit(data)
        setSubmitSuccess(true)
      } catch (error: any) {
        setSubmitError(error.message || "An error occurred")
      } finally {
        setIsSubmitting(false)
      }
    },
    [onSubmit]
  )

  const resetForm = useCallback(() => {
    form.reset()
    setSubmitError(null)
    setSubmitSuccess(false)
  }, [form])

  return {
    isSubmitting,
    submitError,
    submitSuccess,
    handleSubmit: form.handleSubmit(handleSubmit),
    resetForm,
  }
}

/**
 * Hook for inline field validation
 */
export function useFieldValidation<T extends FieldValues>(
  form: UseFormReturn<T>,
  fieldName: keyof T
) {
  const fieldState = form.formState.errors[fieldName]
  const hasError = !!fieldState
  const errorMessage = fieldState?.message as string | undefined

  return {
    hasError,
    errorMessage,
    isValid: !hasError && form.formState.touchedFields[fieldName as string],
  }
}
