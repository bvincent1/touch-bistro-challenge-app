import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from '@mui/material/styles'
import {
  AppBar,
  Container,
  CssBaseline,
  Toolbar,
  Typography,
} from '@mui/material'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import './index.css'

import theme from './theme.tsx'
import QuizzesHome from './pages/QuizzesHome.tsx'
import { UserProvider } from './hooks/use-user.tsx'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          <CssBaseline />
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                TouchBistro Tests
              </Typography>
            </Toolbar>
          </AppBar>
          <Container maxWidth="lg" sx={{ padding: '5em' }}>
            <BrowserRouter>
              <Routes>
                <Route index element={<Navigate replace to="/home" />} />
                <Route path="/home" element={<QuizzesHome />} />
              </Routes>
            </BrowserRouter>
          </Container>
        </UserProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </StrictMode>,
)
