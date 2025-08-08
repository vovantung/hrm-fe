// // Next Imports
// import type { Metadata } from 'next'

// // Component Imports

// // Server Action Imports
// import { getServerMode } from '@core/utils/serverHelpers'
// import LoginTXU from '@/views/pages/auth/LoginTXU'

// export const metadata: Metadata = {
//   title: 'Login',
//   description: 'Login to your account'
// }

// const LoginPage = async () => {
//   // Vars
//   const mode = await getServerMode()

//   return <LoginTXU mode={mode} />
// }

// export default LoginPage

import LoginTXU from '@/views/pages/auth/LoginTXU'

const LoginPage = () => {
  return (
    <div className='flex flex-col justify-center items-center min-bs-[100dvh] p-6'>
      <LoginTXU />
    </div>
  )
}

export default LoginPage
