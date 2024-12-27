import React from 'react'
import Login from '../components/Login'

type Props = {}

function LoginPage({}: Props) {
  return (
    <div className=' h-[100vh] flex items-center justify-center p-10'>
        <Login />
        <div className="h-full w-full bg-gradient-to-r from-myBlue to-myPink absolute -z-10">
        </div>
    </div>
  )
}

export default LoginPage