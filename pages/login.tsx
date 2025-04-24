import { useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '@/superbase-attendance/lib/supabaseClient'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    <Link href="/change-password">Forgot Password?</Link>

    // Attempt to sign in
    const

