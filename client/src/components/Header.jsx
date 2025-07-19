import React from 'react'
import { assets } from '../assets/assets'

const Header = () => {
  return (
    <div className='flex flex-col items-center mt-20 px-4 text-gray-800  text-center'>
      <img src={assets.header_img} 
      className='w-36 h-36 rounded-full mb-6'/>
        <h1 className='flex items-center gap-2 text-xl sm:text-3xl'>Hey Developer <img className='w-8 aspect-square' src={assets.hand_wave}/></h1>
        <h2 className='text-3xl font-semibold mb-4'>Welcome to the MERN Authentication App</h2>
        <button className='border border-gray-500 rounded-full px-8 py-2.5 hover:bg-gray-200 cursor-pointer'>Get started</button>
    </div>
  )
}

export default Header
