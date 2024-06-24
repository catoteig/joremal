import { SetStateAction, useRef, useState } from 'react'
import { Alert, Box, IconButton, InputAdornment, Stack, TextField, Zoom } from '@mui/material'
import { PasswordValidationIcon, SentIcon } from 'hugeicons-react'
import { useAuth } from '../AuthContext.ts'

export interface ChangeUserDataProps {
  setVisible: (visible: boolean) => void
}

const ChangeUserData = (props: ChangeUserDataProps) => {
  const { setVisible } = props
  const auth = useAuth()
  const { ChangePassword, user } = auth

  const [passwordFieldValue, setPasswordFieldValue] = useState<string>('')
  const [error, setError] = useState<null | string>(null)
  const resetError = () => setError(null)

  const passwordRef = useRef<HTMLInputElement>(null)

  const handlePasswordFieldChange = (e: { target: { value: SetStateAction<string> } }) => {
    resetError()
    setPasswordFieldValue(e.target.value)
  }

  const onFormSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    if (!passwordFieldValue.trim()) return
    const res = await ChangePassword(passwordFieldValue)

    if (res) {
      setError(res)
      if (passwordRef.current) passwordRef.current.value = ''
    } else {
      setVisible(false)
    }
  }

  return (
    <Box
      sx={{
        position: 'absolute',
        top: '30%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 'calc(100% - 4rem)',
        maxWidth: '30rem',
        bgcolor: 'secondary.light',
        border: '1px dashed grey',
        borderRadius: 2,
        p: 2,
      }}
    >
      <form onSubmit={onFormSubmit}>
        <Stack direction={'column'} spacing={2} sx={{ paddingTop: 2 }}>
          {user && (
            <TextField
              label={'E-post'}
              variant="outlined"
              id="email"
              type="text"
              value={user.email}
              fullWidth
              disabled
            />
          )}
          <TextField
            label={'Nytt passord'}
            variant="outlined"
            id="passwordInput"
            type="password"
            value={passwordFieldValue}
            onChange={handlePasswordFieldChange}
            fullWidth
            ref={passwordRef}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PasswordValidationIcon />
                </InputAdornment>
              ),
            }}
            autoFocus
          />
          {error && (
            <Zoom in={true} key="errormessage">
              <Alert variant={'outlined'} severity="error">
                {error}
              </Alert>
            </Zoom>
          )}
        </Stack>
        <Box flexDirection={'column'} textAlign={'right'}>
          <IconButton
            type="submit"
            disabled={!passwordFieldValue}
            title={'Opprett'}
            size="large"
            sx={{ bgcolor: 'warning.main', marginTop: '1rem', color: 'white', '&:hover': { bgcolor: 'primary.main' } }}
          >
            <SentIcon />
          </IconButton>
        </Box>
      </form>
    </Box>
  )
}
export default ChangeUserData
