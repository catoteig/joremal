import { SetStateAction, useState } from 'react'
import { Alert, Box, IconButton, InputAdornment, Stack, TextField, Zoom } from '@mui/material'
import { PasswordValidationIcon, SentIcon } from 'hugeicons-react'
import { useAuth } from '../AuthContext.ts'

export interface ChangeUserDataProps {
  setVisible: (visible: boolean) => void
}

const ChangeUserData = (props: ChangeUserDataProps) => {
  const { setVisible } = props
  const auth = useAuth()
  const { ChangePassword } = auth

  const [passwordFieldValue, setPasswordFieldValue] = useState<string>('')
  const [error, setError] = useState<null | string>(null)
  const resetError = () => setError(null)

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
        bgcolor: '#EDF4ED',
        border: '1px dashed grey',
        borderRadius: 2,
        p: 2,
      }}
    >
      <form onSubmit={onFormSubmit}>
        <Stack direction={'column'} spacing={2} sx={{ paddingTop: 2 }}>
          <TextField
            label={'Nytt passord'}
            variant="outlined"
            id="passwordInput"
            type="password"
            value={passwordFieldValue}
            onChange={handlePasswordFieldChange}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PasswordValidationIcon />
                </InputAdornment>
              ),
            }}
            autoFocus
          />
          <TextField
            label={'Gjenta passord'}
            variant="outlined"
            id="passwordInput"
            type="password"
            value={passwordFieldValue}
            onChange={handlePasswordFieldChange}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PasswordValidationIcon />
                </InputAdornment>
              ),
            }}
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
            sx={{ bgcolor: '#ef767a', marginTop: '1rem', color: 'white', '&:hover': { bgcolor: '#55868C' } }}
          >
            <SentIcon />
          </IconButton>
        </Box>
      </form>
    </Box>
  )
}
export default ChangeUserData
