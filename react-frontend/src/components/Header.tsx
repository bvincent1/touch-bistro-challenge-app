import { AppBar, Button, Toolbar, Typography } from '@mui/material'
import { useUser } from '../hooks/use-user'
import { useNavigate } from 'react-router'

/**
 * App header, includes logout button
 * @returns {React.ReactNode}
 */
export default function Header() {
  const { user, setUser } = useUser()
  const nav = useNavigate()

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 0, cursor: 'pointer' }}
          onClick={() => nav('/home')}
        >
          TouchBistro Tests
        </Typography>
        <div style={{ flexGrow: 1 }} />
        <Typography>{user}</Typography>
        <Button
          variant="outlined"
          sx={{
            marginLeft: '2em',
            color: 'white',
            backgroundColor: 'cornflowerblue',
          }}
          onClick={() => {
            setUser('')
            nav('/home')
          }}
        >
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  )
}
