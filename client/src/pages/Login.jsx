import React, { useState } from 'react'
import { assets } from '../assets/assets'

const Login = () => {

    const [state, setState] = useState('Sign Up')

  return (
    <div className='flex  items-center justify-center min-h-screen px-6 bg-[url("/bg_img.png")] bg-cover bg-center relative'>
      <img src={assets.logo} className='absolute left-5 top-5 w-28 sm:left-20 sm:w-32 cursor-pointer'/>
      <div>
        <h2>{state==="Sign Up" ? "create  account": "Login"}</h2>
        <p>{state==="Sign Up" ? "create your account": "Login to your account"}</p>
        <form className='bg-[#333A5C]'>
            <h1 className='text-center text-white text-3xl pt-4'>{state}</h1>
            {state === "Sign Up" && (
                <div className='mb-4 p-5 flex items-center gap-4 w-full max-w-md '>
                    <img src={assets.person_icon} className='h-6'/>
                    <input type="text" placeholder='Username' className='border border-gray-300 rounded-full px-4 py-2 w-full mt-2 bg-white' required/>
                </div>
            )}
            <div className='mb-4 p-5 flex items-center gap-4 w-full max-w-md '>
                <img src={assets.person_icon} className='h-6'/>
                <input type="email" placeholder='Email Id' className='border border-gray-300 rounded-full px-4 py-2 w-full mt-2 bg-white' required/>
            </div>
            <div className='mb-4 p-5 flex items-center gap-4 w-full max-w-md '>
                <img src={assets.person_icon} className='h-6'/>
                <input type="text" placeholder='Password' className='border border-gray-300 rounded-full px-4 py-2 w-full mt-2 bg-white' required/>
            </div>
            <p className='text-white cursor-pointer'>forgot password</p>
            <button className='cursor-pointer text-white border border-black bg-green-500 rounded-3xl p-2'>{state}</button>
        </form>
        {state === "Sign Up" ? (
            <p className='text-black'>Already have an account?  {' '}
                <span onClick={() => setState('Login')} className='cursor-pointer text-amber-400'>Login Here</span>
            </p>
        ):(
            <p className='text-black'>Already have an account?  {' '}
                <span onClick={() => setState('Sign Up')} className='cursor-pointer text-amber-400'>Sign Up</span>
            </p>
        )}
      </div>
    </div>
  )
}

export default Login
