import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/router'

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
        return (
          <div>
            <Link href="/change-password">Forgot Password?</Link>
            {/* other elements */}
          </div>
        )
      }

      setUser(user)
      checkAttendance(user.id)
    }

    getUser()
  }, [])

  const checkAttendance = async (userId: string) => {
    const today = new Date().toISOString().split('T')[0]

    const { data,
