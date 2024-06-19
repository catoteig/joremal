import LoginSignupForm from './components/loginSignupForm.tsx'
import { SetStateAction, useState } from 'react'
import { useAuth } from './AuthContext.ts'

const SignUp = () => {
  const auth = useAuth()
  const { SignUp } = auth

  const [emailFieldValue, setEmailFieldValue] = useState<string>('')

  const [passwordFieldValue, setPasswordFieldValue] = useState<string>('')

  const [error, setError] = useState<null | string>(null)
  const resetError = () => setError(null)

  const handleEmailFieldChange = (e: { target: { value: SetStateAction<string> } }) => {
    resetError()
    setEmailFieldValue(e.target.value)
  }
  const handlePasswordFieldChange = (e: { target: { value: SetStateAction<string> } }) => {
    resetError()
    setPasswordFieldValue(e.target.value)
  }

  const onSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    const res = await SignUp({ email: emailFieldValue, password: passwordFieldValue })
    if (res) setError(res)
  }

  return (
    <LoginSignupForm
      onSubmit={onSubmit}
      buttonName={'Opprett'}
      subTitle={'Opprett ny bruker'}
      loginLink
      emailFieldValue={emailFieldValue}
      handleEmailFieldChange={handleEmailFieldChange}
      passwordFieldValue={passwordFieldValue}
      handlePasswordFieldChange={handlePasswordFieldChange}
      error={error}
    />
  )
}

export default SignUp
