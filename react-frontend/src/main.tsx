import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from '@mui/material/styles'
import { Container, CssBaseline } from '@mui/material'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import './index.css'

import theme from './theme.tsx'
import Header from './components/Header.tsx'
import QuizzesHomePage from './pages/QuizzesHomePage.tsx'
import QuestionPage from './pages/QuestionPage.tsx'
import ResultPage from './pages/ResultPage.tsx'
import { UserProvider } from './hooks/use-user.tsx'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          <CssBaseline />
          <BrowserRouter>
            <Header />
            <Container maxWidth="lg" sx={{ padding: '5em' }}>
              <Routes>
                <Route index element={<Navigate replace to="/home" />} />
                <Route path="/home" element={<QuizzesHomePage />} />
                <Route path="/questions/:id" element={<QuestionPage />} />
                <Route path="/results/:id" element={<ResultPage />} />
              </Routes>
            </Container>
          </BrowserRouter>
        </UserProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </StrictMode>,
)
