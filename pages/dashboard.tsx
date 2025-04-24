import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [status, setStatus] = useState('')
  const [hasClockedIn, setHasClockedIn] = useState(false)

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()

      if (!user || error) {
        router.push('/login')
        return
      }

      setUser(user)
      checkAttendance(user.id)
    }

    getUser()
  }, [])

  const checkAttendance = async (userId: string) => {
    const today = new Date().toISOString().split('T')[0]

    const { data, error } = await supabase
      .from('attendance')
      .select('*')
      .eq('user_id', userId)
      .eq('date', today)
      .single()

    if (data) {
      setHasClockedIn(true)
      setStatus(data.status)
    }
  }

  const handleClockIn = async () => {
    const today = new Date().toISOString().split('T')[0]

    const { error } = await supabase.from('attendance').insert([
      {
        user_id: user.id,
        date: today,
        status: 'present',
      },
    ])

    if (!error) {
      setHasClockedIn(true)
      setStatus('present')
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: '2rem' }}>
      <h2>Welcome to Your Dashboard</h2>
      <p>
        Not you? <Link href="/change-password">Forgot Password?</Link>
      </p>
      {hasClockedIn ? (
        <p>You have already clocked in today. Status: <strong>{status}</strong></p>
      ) : (
        <button onClick={handleClockIn}>Clock In</button>
      )}
    </div>
  )
}
