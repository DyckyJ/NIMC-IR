import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/router'
import { sendEmail } from '@/services/brevo'
import Link from 'next/link'

export default function ChangePassword() {
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    import { sendEmail } from '@/services/brevo' // Import the email service

    const handleChangePassword = async (e: React.FormEvent) => {
      e.preventDefault()
      setError('')
      setSuccess('')
    
      // Check if new passwords match
      if (newPassword !== confirmPassword) {
        setError('New password and confirm password do not match.')
        return
      }
    
      setLoading(true)
    
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser()
    
      if (userError || !user) {
        setError('Could not fetch user data.')
        setLoading(false)
        return
      }
    
      try {
        // Update the password
        const { error } = await supabase.auth.updateUser({
          password: newPassword,
        })
    
        if (error) {
          setError(error.message)
        } else {
          // Send confirmation email via Brevo
          await sendEmail({
            toEmail: user.email!,
            subject: 'Your Password Was Changed',
            htmlContent: `<p>Your password has been successfully changed.</p>`,
            textContent: `Your password has been successfully changed.`,
          })
    
          setSuccess('Password updated successfully.')
          router.push('/login')  // Redirect to login after password change
        }
      } catch (err) {
        setError('Failed to change password.')
      }
    
      setLoading(false)
    }
    

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: '2rem' }}>
      <h2>Change Password</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      <form onSubmit={handleChangePassword}>
        <div>
          <label htmlFor="oldPassword">Old Password</label>
          <input
            id="oldPassword"
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="newPassword">New Password</label>
          <input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="confirmPassword">Confirm New Password</label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Changing Password...' : 'Change Password'}
        </button>
      </form>
    </div>
  )
}
