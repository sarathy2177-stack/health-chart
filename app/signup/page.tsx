import Link from 'next/link'
import { AuthForm } from '@/components/auth-form'
export default function SignupPage() { return <main className="auth-page"><div className="brand-mark">BEN<span>.</span></div><section className="auth-card"><p className="eyebrow">YOUR NEXT CHAPTER</p><h1>Create your account</h1><p className="subtitle">A clearer view of you starts here.</p><AuthForm mode="signup" /><p className="auth-foot">Already have an account? <Link href="/login">Log in</Link></p></section></main> }
