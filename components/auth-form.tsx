'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'

export function AuthForm({ mode }: { mode: 'login' | 'signup' }) {
  const router = useRouter()
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (event.nativeEvent.isComposing || (event as unknown as KeyboardEvent).keyCode === 229) return
    setError(''); setPending(true)
    const form = new FormData(event.currentTarget)
    const email = String(form.get('email') || '')
    const password = String(form.get('password') || '')
    const result = mode === 'login' ? await authClient.signIn.email({ email, password }) : await authClient.signUp.email({ email, password, name: `${form.get('firstName')} ${form.get('lastName')}` })
    if (result.error) { setError(result.error.message || 'Unable to complete this request.'); setPending(false); return }
    if (mode === 'signup') {
      const response = await fetch('/api/profile', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: form.get('username'), firstName: form.get('firstName'), lastName: form.get('lastName') }) })
      if (!response.ok) { setError((await response.json()).error || 'Unable to create your profile.'); setPending(false); return }
    }
    router.push('/dashboard'); router.refresh()
  }
  return <form onSubmit={submit} className="flex flex-col gap-4">
    {mode === 'signup' && <div className="grid grid-cols-2 gap-3"><label className="field">First name<input name="firstName" required /></label><label className="field">Last name<input name="lastName" required /></label></div>}
    {mode === 'signup' && <label className="field">Username<input name="username" required minLength={3} maxLength={20} pattern="[A-Za-z0-9._]+" placeholder="your.name" /></label>}
    <label className="field">Email<input name="email" type="email" required placeholder="you@example.com" /></label>
    <label className="field">Password<input name="password" type="password" required minLength={8} placeholder="At least 8 characters" /></label>
    {error && <p role="alert" className="error">{error}</p>}
    <button disabled={pending} className="primary-button" type="submit">{pending ? 'Please wait…' : mode === 'login' ? 'Log in' : 'Create account'}</button>
    <button type="button" disabled className="google-button">Continue with Google <span>Coming soon</span></button>
  </form>
}
