// 🐨 create and export a React context variable for the AuthContext
// 💰 using React.createContext

import React, { createContext, useContext } from 'react';
/** @jsx jsx */
import { jsx } from '@emotion/core'
import * as auth from 'auth-provider'
import { FullPageSpinner, FullPageErrorFallback } from '../components/lib'
import { client } from '../utils/api-client'
import { useAsync } from '../utils/hooks'

const AuthContext = createContext()
AuthContext.displayName = 'Authorization Context'

const useAuth = () => {
  return useContext(AuthContext)
}

async function getUser() {
  let user = null

  const token = await auth.getToken()
  if (token) {
    const data = await client('me', { token })
    user = data.user
  }

  return user
}

const AuthProvider = (props) => {
  const {
    data: user,
    error,
    isLoading,
    isIdle,
    isError,
    isSuccess,
    run,
    setData,
  } = useAsync()

  React.useEffect(() => {
    run(getUser())
  }, [run])

  const login = form => auth.login(form).then(user => setData(user))
  const register = form => auth.register(form).then(user => setData(user))
  const logout = () => {
    auth.logout()
    setData(null)
  }

  if (isLoading || isIdle) {
    return <FullPageSpinner />
  }

  if (isError) {
    return <FullPageErrorFallback error={error} />
  }

  if (isLoading || isIdle) {
    return <FullPageSpinner />
  }

  if (isError) {
    return <FullPageErrorFallback error={error} />
  }

  if (isSuccess) {
    const value = { user, login, register, logout }
    return (
      <AuthContext.Provider value={value} {...props} />
    )
  }
}

export { AuthProvider, useAuth }
