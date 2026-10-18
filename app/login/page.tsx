import Link from 'next/link'
import { AuthForm } from '@/components/auth-form'
export default function LoginPage() { return <AuthShell title="Welcome back" subtitle="Sign in to your BEN profile."><AuthForm mode="login" /><p className="auth-foot">Don&apos;t have an account? <Link href="/signup">Create one</Link></p></AuthShell> }
function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) { return <main className="auth-page"><div className="brand-mark">BEN<span>.</span></div><section className="auth-card"><p className="eyebrow">PERSONAL WELLNESS</p><h1>{title}</h1><p className="subtitle">{subtitle}</p>{children}</section></main> }
