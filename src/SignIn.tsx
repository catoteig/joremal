import { useState } from 'react'
import LoginSignupForm from './components/loginSignupForm.tsx'
import { useAuth } from './AuthContext.ts'

const SignIn = () => {
  const auth = useAuth()
  const { LogIn } = auth

  const [emailFieldValue, setEmailFieldValue] = useState<string>('')

  const [passwordFieldValue, setPasswordFieldValue] = useState<string>('')
  const [error, setError] = useState<null | string>(null)
  const resetError = () => setError(null)

  const handleEmailFieldChange = (e: { target: { value: string } }) => {
    resetError()
    setEmailFieldValue(e.target.value)
  }
  const handlePasswordFieldChange = (e: { target: { value: string } }) => {
    resetError()
    setPasswordFieldValue(e.target.value)
  }

  const onSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    const res = await LogIn({ email: emailFieldValue, password: passwordFieldValue })
    if (res) setError(res)
  }

  return (
    <LoginSignupForm
      onSubmit={onSubmit}
      buttonName={'Logg inn'}
      subTitle={'Logg inn'}
      loginLink={false}
      emailFieldValue={emailFieldValue}
      handleEmailFieldChange={handleEmailFieldChange}
      passwordFieldValue={passwordFieldValue}
      handlePasswordFieldChange={handlePasswordFieldChange}
      error={error}
    />
  )
}

export default SignIn
