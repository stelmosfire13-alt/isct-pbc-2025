'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { loginSchema, type LoginInput } from '@/lib/validations/auth'
import { login } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? 'Signing in...' : 'Sign in'}
    </Button>
  )
}

export function LoginForm() {
  const [state, formAction] = useFormState(login, null)
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect')

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  })

  return (
    <form
      action={formAction}
      onSubmit={(evt) => {
        evt.preventDefault()
        const form = evt.currentTarget
        handleSubmit(() => {
          const formData = new FormData(form)
          // Preserve redirect parameter
          if (redirect) {
            formData.set('redirect', redirect)
          }
          formAction(formData)
        })(evt)
      }}
      className="space-y-4"
    >
      {state?.error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">
          {state.error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          {...registerField('email')}
        />
        {errors.email && (
          <p className="text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Enter your password"
          {...registerField('password')}
        />
        {errors.password && (
          <p className="text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      <SubmitButton />

      <p className="text-center text-sm text-slate-600">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="font-medium text-slate-900 hover:underline">
          Create account
        </Link>
      </p>
    </form>
  )
}
