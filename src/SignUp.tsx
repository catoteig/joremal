import { useNavigate } from 'react-router-dom'
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth'
import { getDb } from './services/db.tsx'
import LoginSignupForm from './components/loginSignupForm.tsx'
import { useState } from 'react'

const SignUp = () => {
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

  const onSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()

    await createUserWithEmailAndPassword(auth, emailFieldValue, passwordFieldValue)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user
        console.log(user)
        navigate('/login')
        // ...
      })
      .catch((error) => {
        const errorCode = error.code
        const errorMessage = error.message
        console.log(errorCode, errorMessage)
        // ..
      })
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
