import { useState } from 'react'
import { supabase } from '@/superbase-attendance/lib/supabaseClient'
import { useRouter } from 'next/router'

export default function RegisterPage() {
  const router = useRouter()

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    department: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Step 1: Sign up user with Supabase Auth
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    // Step 2: Add user data to the 'users' table
    const { error: dbError } = await supabase.from('users').insert([
      {
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        department: form.department,
        approved: false, // Admin will approve
      },
    ])

    if (dbError) {
      setError(dbError.message)
    } else {
      alert('Registration complete! Await admin approval.')
      router.push('/login')
    }

    setLoading(false)
  }

  return (
    <div style={{ maxWidth: 500, margin: 'auto', padding: '2rem' }}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input name="first_name" placeholder="First Name" onChange={handleChange} required />
        <input name="last_name" placeholder="Last Name" onChange={handleChange} required />
        <input name="email" placeholder="Email" type="email" onChange={handleChange} required />
        <input name="department" placeholder="Department" onChange={handleChange} required />
        <input name="password" placeholder="Password (8-digits)" type="password" onChange={handleChange} minLength={8} required />
        <button type="submit" disabled={loading}>{loading ? 'Registering...' : 'Register'}</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  )
}
