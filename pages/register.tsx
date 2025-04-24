import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
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

    // Clean inputs
    const cleanedForm = {
      ...form,
      email: form.email.trim(),
      first_name: form.first_name.trim(),
      last_name: form.last_name.trim(),
      department: form.department.trim(),
    }

    // Step 1: Sign up user with Supabase Auth
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: cleanedForm.email,
      password: form.password,
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    // Step 2: Add user to custom "users" table
    const { error: dbError } = await supabase.from('users').insert([
      {
        first_name: cleanedForm.first_name,
        last_name: cleanedForm.last_name,
        email: cleanedForm.email,
        department: cleanedForm.department,
        approved: false,
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
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
        <input name="department" placeholder="Department" onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password (8+ characters)" minLength={8} onChange={handleChange} required />
        <button type="submit" disabled={loading}>{loading ? 'Registering...' : 'Register'}</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  )
}
