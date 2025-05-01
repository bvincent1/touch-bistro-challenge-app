import { AppBar, Button, Toolbar, Typography } from '@mui/material'
import { useUser } from '../hooks/use-user'
import { useNavigate } from 'react-router'

export default function Header() {
  const { user, setUser } = useUser()
  const nav = useNavigate()

  return (
    <AppBar position="static">
      <Toolbar>
        <Button
          variant="text"
          sx={{ color: 'white' }}
          onClick={() => nav('/home')}
        >
          Home
        </Button>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          TouchBistro Tests
        </Typography>
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
