import { createContext, useContext, useState } from 'react'

const UserContext = createContext<{
  user: string
  setUser: (name: string) => null
}>({
  user: '',
  setUser: () => null,
})

const USER_KEY = 'quiz-user'

/**
 * User Context provider
 */
export const UserProvider: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const [user, setUser] = useState<string>(localStorage.getItem(USER_KEY) || '')

  return (
    <UserContext.Provider
      value={{
        user: user,
        setUser: (name: string) => {
          setUser(name)
          localStorage.setItem(USER_KEY, name)
          return null
        },
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

/**
 * Hook for accessing / setting user. Syncs the value to localstorage
 * @returns {{user: string, setUser: (name: string) => void}}
 */
// eslint-disable-next-line react-refresh/only-export-components
export const useUser = () => useContext(UserContext)
