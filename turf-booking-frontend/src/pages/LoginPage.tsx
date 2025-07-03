import React from 'react'
import Login from '../custom-components/Login'

type Props = {}

function LoginPage({}: Props) {
  return (
    <div className=' h-[100vh] flex items-center justify-center p-10  bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 '>
        <Login />
        {/* <div className="h-full w-full bg-gradient-to-r from-myBlue to-myPink absolute -z-10">
        </div> */}
   </div>
  )
}

export default LoginPage