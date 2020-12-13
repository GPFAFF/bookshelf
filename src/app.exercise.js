/** @jsx jsx */
import { jsx } from '@emotion/core'

import * as React from 'react'
// 🐨 you're going to need this:
import * as auth from 'auth-provider'
import { AuthenticatedApp } from './authenticated-app'
import { UnauthenticatedApp } from './unauthenticated-app'
import { client } from 'utils/api-client'
import { useAsync } from 'utils/hooks';
import * as colors from './styles/colors';
import { FullPageSpinner } from 'components/lib'

function ErrorMessage({ error }) {
  return (
    <div
      css={{
        color: colors.danger,
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <p>Uh oh... There's a problem. Try refreshing the app.</p>
      <pre>{error.message}</pre>
    </div>
  )
}

function useUser() {
  const [user, setUser] = React.useState(null)

  const login = form => auth.login(form).then(promiseUser => setUser(promiseUser))

  const register = form => auth.register(form).then(promiseUser => setUser(promiseUser))

  const getToken = async () => await auth.getToken();

  const logout = (form) => {
    auth.logout();
    setUser(null)
  }

  return {
    getToken,
    login,
    logout,
    register,
    user,
    setUser,
  }
}

async function getUser() {
  const token = await auth.getToken();

  console.log(token);
  let user = null;
  if (token) {
    user = await client('me', { method: 'GET', token })
  }
  return user

}

function App() {
  // 🐨 useState for the user
  // const { getToken, user, logout, setUser } = useUser();
  const { data, error, isIdle, isLoading, isSuccess, isError, run, setData, status} = useAsync()

  const login = form => auth.login(form).then(promiseUser => setData(promiseUser))

  const register = form => auth.register(form).then(promiseUser => setData(promiseUser))

  const logout = React.useCallback((form) => {
    auth.logout();
    setData(null)
  }, [setData])

  React.useEffect(() => {
    run(getUser())
      .then(data => setData(data.user))
      .catch(error => logout())
  }, [setData, run, logout])

  if (isLoading) {
    return <FullPageSpinner />
  }

  if (isError) {
    return <ErrorMessage error={error} />
  }

  return data
    ? <AuthenticatedApp user={data} logout={logout} />
    : <UnauthenticatedApp login={login} register={register} />
}

export { App }

/*
eslint
  no-unused-vars: "off",
*/
