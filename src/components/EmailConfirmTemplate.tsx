type EmailConfirmTemplateProps = {
  email: string
  token: string
}

const EmailConfirmTemplate = ({ email, token }: EmailConfirmTemplateProps) => {
  return (
    <div>
      <h1>Welcome, {email}</h1>
      <a href={`http://localhost:3000/api/auth/confirm-email?token=${token}`}>Confirm your email</a>
    </div>
  )
}

export default EmailConfirmTemplate
