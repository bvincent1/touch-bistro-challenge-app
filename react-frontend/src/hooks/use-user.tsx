import { createContext, useContext, useState } from 'react'

const UserContext = createContext<{
  user: string
  setUser: (name: string) => null
}>({
  user: '',
  setUser: () => null,
})

export const UserProvider: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const [user, setUser] = useState<string>('')

  return (
    <UserContext.Provider
      value={{
        user: user,
        setUser: (name: string) => {
          setUser(name)
          return null
        },
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)
