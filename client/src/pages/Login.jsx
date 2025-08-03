import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { set } from 'mongoose';
import {toast} from 'react-toastify';


const Login = () => {
    const navigate = useNavigate();
    const {backendUrl, setIsLoggedIn} = useContext(AppContext);

    const [state, setState] = useState('Sign Up')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const onSubmitHandler = async (e) => {
        try {
            e.preventDefault();
            axios.defaults.withCredentials = true; // Ensure cookies are sent with requests
            if(state === "Sign Up" )
            {
                const {data} = await axios.post(`${backendUrl}/api/auth/register`, {name, email, password});
                if(data.success) {
                    setIsLoggedIn(true);
                    navigate('/');
                } else{
                    toast.error(data.message);
                }
            }else{
                const {data} = await axios.post(`${backendUrl}/api/auth/login`, { email, password});
                if(data.success) {
                    setIsLoggedIn(true);
                    navigate('/');
                } else{
                    toast.error(data.message);
                }
            }
         }
        catch (error) {
            console.error("Error during form submission:", error);
            toast.error("An error occurred. Please try again.");}
    }

  return (
    <div className='flex  items-center justify-center min-h-screen px-6 bg-[url("/bg_img.png")] bg-cover bg-center relative'>
      <img onClick={() => navigate('/')} src={assets.logo} className='absolute left-5 top-5 w-28 sm:left-20 sm:w-32 cursor-pointer'/>
      <div>
        <h2>{state==="Sign Up" ? "create  account": "Login"}</h2>
        <p>{state==="Sign Up" ? "create your account": "Login to your account"}</p>
        <form className='bg-[#333A5C]' onSubmit={onSubmitHandler}>
            <h1 className='text-center text-white text-3xl pt-4'>{state}</h1>
            {state === "Sign Up" && (
                <div className='mb-4 p-5 flex items-center gap-4 w-full max-w-md '>
                    <img src={assets.person_icon} className='h-6'/>
                    <input type="text" placeholder='Username' onChange = { e => setName(e.target.value)}
                    value = {name} className='border border-gray-300 rounded-full px-4 py-2 w-full mt-2 bg-white' required/>
                </div>
            )}
            <div className='mb-4 p-5 flex items-center gap-4 w-full max-w-md '>
                <img src={assets.person_icon} className='h-6'/>
                <input type="email" placeholder='Email Id' onChange = { e => setEmail(e.target.value)}
                value = {email} className='border border-gray-300 rounded-full px-4 py-2 w-full mt-2 bg-white' required/>
            </div>
            <div className='mb-4 p-5 flex items-center gap-4 w-full max-w-md '>
                <img src={assets.person_icon} className='h-6'/>
                <input type="password" placeholder='Password' onChange = { e => setPassword(e.target.value)} value={password}
                className='border border-gray-300 rounded-full px-4 py-2 w-full mt-2 bg-white' required/>
            </div>
            <p onClick={() => navigate('/reset-password')} className='text-white cursor-pointer'>forgot password</p>
            <button className='cursor-pointer text-white border border-black bg-green-500 rounded-3xl p-2'>{state}</button>
        </form >
        {state === "Sign Up" ? (
            <p className='text-black'>Already have an account?  {' '}
                <span onClick={() => setState('Login')} className='cursor-pointer text-amber-400'>Login Here</span>
            </p>
        ):(
            <p className='text-black'>Don't have an account?  {' '}
                <span onClick={() => setState('Sign Up')} className='cursor-pointer text-amber-400'>Sign Up</span>
            </p>
        )}
      </div>
    </div>
  )
}

export default Login
