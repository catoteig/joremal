import { useContext, useState } from 'react'
import LoginSignupForm from './components/loginSignupForm.tsx'
import { AuthContext } from './AuthContext.ts'

const SignIn = () => {
  const { LogIn } = useContext(AuthContext)

  const [emailFieldValue, setEmailFieldValue] = useState<string>('')

  const [passwordFieldValue, setPasswordFieldValue] = useState<string>('')

  const handleEmailFieldChange = (e: { target: { value: string } }) => {
    setEmailFieldValue(e.target.value)
  }
  const handlePasswordFieldChange = (e: { target: { value: string } }) => {
    setPasswordFieldValue(e.target.value)
  }

  const onSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    LogIn({ email: emailFieldValue, password: passwordFieldValue })
  }

  return (
    <LoginSignupForm
      onSubmit={onSubmit}
      buttonName={'Logg inn'}
      subTitle={'Logg inn'}
      emailFieldValue={emailFieldValue}
      handleEmailFieldChange={handleEmailFieldChange}
      passwordFieldValue={passwordFieldValue}
      handlePasswordFieldChange={handlePasswordFieldChange}
    />
  )
}

export default SignIn
