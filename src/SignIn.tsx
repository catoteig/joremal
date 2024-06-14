import { useState } from 'react'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { getDb } from './services/db.tsx'
import LoginSignupForm from './components/loginSignupForm.tsx'

const Login = () => {
  getDb()
  const auth = getAuth()
  const navigate = useNavigate()

  const [emailFieldValue, setEmailFieldValue] = useState<string>('')

  const [passwordFieldValue, setPasswordFieldValue] = useState<string>('')

  const handleEmailFieldChange = (e: { target: { value: string } }) => {
    setEmailFieldValue(e.target.value)
  }
  const handlePasswordFieldChange = (e: { target: { value: string } }) => {
    setPasswordFieldValue(e.target.value)
  }

  const onLogin = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    signInWithEmailAndPassword(auth, emailFieldValue, passwordFieldValue)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user
        navigate('/home')
        console.log('user:', user)
      })
      .catch((error) => {
        const errorCode = error.code
        const errorMessage = error.message
        console.log(errorCode, errorMessage)
      })
  }

  return (
    <LoginSignupForm
      onSubmit={onLogin}
      buttonName={'Logg inn'}
      subTitle={'Logg inn'}
      loginLink
      emailFieldValue={emailFieldValue}
      handleEmailFieldChange={handleEmailFieldChange}
      passwordFieldValue={passwordFieldValue}
      handlePasswordFieldChange={handlePasswordFieldChange}
    />
  )
}

export default Login
