import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/router'

export default function AdminDashboard() {
  const [attendanceData, setAttendanceData] = useState<any[]>([])
  const [dateFilter, setDateFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAdmin = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()

      // Check if user is admin (you can set a role or flag in the user table)
      if (!user || error || user.email !== 'admin@example.com') {
        router.push('/login')
        return
      }

      loadAttendanceData()  // If admin is logged in, load data
    }

    checkAdmin()
  }, [])

  const loadAttendanceData = async () => {
    setLoading(true)

    const { data, error } = await supabase
      .from('attendance')
      .select('*, users (id, email, department)')

    if (data) {
      setAttendanceData(data)
    }

    setLoading(false)
  }

  const handleDateFilterChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateFilter(e.target.value)

    if (e.target.value) {
      const { data, error } = await supabase
        .from('attendance')
        .select('*, users (id, email, department)')
        .eq('date', e.target.value)

      if (data) {
        setAttendanceData(data)
      }
    } else {
      loadAttendanceData()
    }
  }

  return (
    <div style={{ maxWidth: 800, margin: 'auto', padding: '2rem' }}>
      <h2>Admin Dashboard</h2>
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
          
          <table>
            <thead>
              <tr>
                <th>Email</th>
                <th>Department</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.length > 0 ? (
                attendanceData.map((attendance) => (
                  <tr key={attendance.id}>
                    <td>{attendance.users?.email}</td>
                    <td>{attendance.users?.department}</td>
                    <td>{attendance.date}</td>
                    <td>{attendance.status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4}>No attendance data found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
