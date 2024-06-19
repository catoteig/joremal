import LoginSignupForm from './components/loginSignupForm.tsx'
import { SetStateAction, useContext, useState } from 'react'
import { AuthContext } from './AuthContext.ts'

const SignUp = () => {
  const { SignUp } = useContext(AuthContext)

  const [emailFieldValue, setEmailFieldValue] = useState<string>('')

  const [passwordFieldValue, setPasswordFieldValue] = useState<string>('')

  const handleEmailFieldChange = (e: { target: { value: SetStateAction<string> } }) => {
    setEmailFieldValue(e.target.value)
  }
  const handlePasswordFieldChange = (e: { target: { value: SetStateAction<string> } }) => {
    setPasswordFieldValue(e.target.value)
  }

  const onSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    SignUp({ email: emailFieldValue, password: passwordFieldValue })
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
    />
  )
}

export default SignUp
