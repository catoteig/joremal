import { Alert, Box, IconButton, Link, Stack, TextField } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import Typography from '@mui/material/Typography'
import { SentIcon } from 'hugeicons-react'

export interface LoginSignupFormProps {
  onSubmit(e: { preventDefault: () => void }): Promise<void> | void
  emailFieldValue: string
  handleEmailFieldChange: any
  passwordFieldValue: string
  handlePasswordFieldChange: any
  subTitle: string
  buttonName: string
  loginLink?: boolean
  error: string | null
}

const LoginSignupForm = (props: LoginSignupFormProps) => {
  const {
    onSubmit,
    subTitle,
    buttonName,
    loginLink = false,
    emailFieldValue,
    handleEmailFieldChange,
    passwordFieldValue,
    handlePasswordFieldChange,
    error = null,
  } = props

  return (
    <Grid container spacing={'1rem'} margin={'0 1rem'} height={'4rem'} width={'calc(100vw - 2rem)'} maxWidth={'400px'}>
      <Grid xs={12}>{<h1>J</h1>}</Grid>
      <Grid xs={12} padding={0} paddingTop={'1rem'}>
        <Box
          component={'form'}
          sx={{ border: '1px dashed grey', borderRadius: 2 }}
          bgcolor={'#EDF4ED'}
          padding={'1rem'}
        >
          <Typography>
            <p>{subTitle}</p>
          </Typography>
          <Stack spacing={'1rem'}>
            <TextField
              id="emailInput"
              label="E-post"
              variant="outlined"
              type={'email'}
              autoComplete={'username'}
              value={emailFieldValue}
              onChange={handleEmailFieldChange}
            />
            <TextField
              id={'passwordInput'}
              label={'Passord'}
              variant={'outlined'}
              type={'password'}
              name={'password'}
              autoComplete={'current-password'}
              value={passwordFieldValue}
              onChange={handlePasswordFieldChange}
            />
            {error && (
              <Alert variant={'filled'} severity="error">
                {error}
              </Alert>
            )}
          </Stack>
          <Box flexDirection={'column'} textAlign={'right'}>
            <IconButton
              type="submit"
              disabled={!/.+@.+\..+/.test(emailFieldValue) || !passwordFieldValue}
              onClick={onSubmit}
              title={buttonName}
              size="large"
              sx={{ bgcolor: '#ef767a', marginTop: '1rem', color: 'white', '&:hover': { bgcolor: '#55868C' } }}
            >
              <SentIcon />
            </IconButton>
          </Box>
        </Box>
      </Grid>
      <Grid xs={12} textAlign={'end'}>
        {loginLink ? (
          <p>
            Har du bruker? <Link href="/login">Logg inn</Link>
          </p>
        ) : (
          <p>
            Ny? <Link href="/signup">Opprett bruker</Link>
          </p>
        )}
      </Grid>
    </Grid>
  )
}

export default LoginSignupForm
