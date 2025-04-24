import SibApiV3Sdk from 'sib-api-v3-sdk'

// Initialize Brevo API client
const defaultClient = SibApiV3Sdk.ApiClient.instance
const apiKey = defaultClient.authentications['apiKey']
apiKey.apiKey = process.env.BREVO_API_KEY

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi()

// Send email function
export async function sendEmail({
  toEmail,
  subject,
  htmlContent,
  textContent,
}: {
  toEmail: string
  subject: string
  htmlContent: string
  textContent: string
}) {
  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail()
  sendSmtpEmail.subject = subject
  sendSmtpEmail.htmlContent = htmlContent
  sendSmtpEmail.textContent = textContent
  sendSmtpEmail.sender = { email: 'your-email@example.com' } // Your email (can be a placeholder email)
  sendSmtpEmail.to = [{ email: toEmail }]

  try {
    const response = await apiInstance.sendTransacEmail(sendSmtpEmail)
    console.log('Email sent successfully:', response)
  } catch (error) {
    console.error('Error sending email:', error)
  }
}

