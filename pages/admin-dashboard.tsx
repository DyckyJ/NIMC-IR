import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/router'

export default function AdminDashboard() {
  const [attendanceData, setAttendanceData] = useState<any[]>([])
  const [dateFilter, setDateFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    const checkAdmin = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (typeof window !== 'undefined' && (!user || userError || user.email !== 'admin@example.com')) {
        router.push('/login')
        return
      }

      loadAttendanceData()
    }

    checkAdmin()
  }, [])

  const loadAttendanceData = async () => {
    setLoading(true)
    setError('')

    const { data, error: fetchError } = await supabase
      .from('attendance')
      .select('*, users (id, email, department)')

    if (fetchError) {
      setError('Failed to load attendance data.')
    } else if (data) {
      setAttendanceData(data)
    }

    setLoading(false)
  }

  const handleDateFilterChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateFilter(e.target.value)

    if (e.target.value) {
      const { data, error: filterError } = await supabase
        .from('attendance')
        .select('*, users (id, email, department)')
        .eq('date', e.target.value)

      if (filterError) {
        setError('Error filtering by date.')
      } else if (data) {
        setAttendanceData(data)
      }
    } else {
      loadAttendanceData()
    }
  }

  return (
    <div style={{ maxWidth: 800, margin: 'auto', padding: '2rem' }}>
      <h2>Admin Dashboard</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading ? (
        <p>Loading attendance data...</p>
      ) : (
        <div>
          <label htmlFor="date-filter">Filter by Date: </label>
          <input
            id="date-filter"
            type="date"
            value={dateFilter}
            onChange={handleDateFilterChange}
          />

          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>Email</th>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>Department</th>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>Date</th>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.length > 0 ? (
                attendanceData.map((attendance) => (
                  <tr key={attendance.id}>
                    <td style={{ border: '1px solid #ccc', padding: '8px' }}>{attendance.users?.email}</td>
                    <td style={{ border: '1px solid #ccc', padding: '8px' }}>{attendance.users?.department}</td>
                    <td style={{ border: '1px solid #ccc', padding: '8px' }}>{attendance.date}</td>
                    <td style={{ border: '1px solid #ccc', padding: '8px' }}>{attendance.status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '1rem' }}>No attendance data found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
