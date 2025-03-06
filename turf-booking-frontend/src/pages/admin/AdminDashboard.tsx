import Input from '@/custom-components/Input'
import React from 'react'

type Props = {}

const handleChange=()=>{}
const handleSubmit=()=>{}

function AdminDashboard({}: Props) {
  return (
    <div>
        Admin
        <div className=' h-[100vh] flex items-center justify-center p-10'>
            <div className="w-full  md:w-[450px]">
                    <h1 className='text-center text-white font-bold text-4xl mb-10 md:text-6xl'>Login</h1>
                    <form className=' flex flex-col gap-3 bg-white p-6 min-h-[150px] rounded-xl drop-shadow-xl' onSubmit={handleSubmit}>
                    <Input name="name" value={"s"} onChange={handleChange} />
                    <Input name="email" value={"ww"} onChange={handleChange} />
                    {/* <Input name="otp" value={otp} onChange={handleOTPChange} /> */}
                    {/* <Button type="submit" text="Login" onClick={()=>setAction('login')} /> */}
                    {/* <Button type="submit" text="Register" onClick={()=>setAction('register')} /> */}
                    </form>
                    {/* {message && <p className="text-center mt-4">{message}</p>} */}
            </div>

            </div>

    </div>
  )
}

export default AdminDashboard