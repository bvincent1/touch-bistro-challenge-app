import { createTheme } from '@mui/material/styles'
import { red } from '@mui/material/colors'

// A custom theme for this app
const theme = createTheme({
  cssVariables: true,
  palette: {
    primary: {
      main: '#556cd6',
    },
    secondary: {
      main: '#19857b',
    },
    error: {
      main: red.A400,
    },
  },
  components: {
    MuiContainer: {
      styleOverrides: {
        root: {
          marginTop: 15,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          padding: '1em',
          minHeight: '20em',
          minWidth: '30em',
        },
      },
    },
  },
})

export default theme
