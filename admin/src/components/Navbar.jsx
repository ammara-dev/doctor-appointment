import React, { useContext } from 'react'
import { AdminContext } from '../context/AdminContext'
import {assets} from '../assets/assets'
import {useNavigate} from 'react-router-dom'
import { DoctorContext } from '../context/DoctorContext'



const Navbar = () => {
    
    const {aToken, setAToken} = useContext(AdminContext);
    const {dToken, setDToken} = useContext(DoctorContext);
    const navigate = useNavigate()


    const logout = () => {
        navigate('/')
        aToken && setAToken('')
        aToken && localStorage.removeItem('aToken')
        dToken && setDToken('')
        dToken && localStorage.removeItem('dToken')
    }


  return (
    <div className='flex items-center justify-between px-4 py-3 bg-white border-b sm:px-10'>
      <div className='flex items-center gap-2 text-sm'>
        <img className='cursor-pointer w-36 sm:w-40' src={assets.admin_logo} alt="" />
        <p className='px-2.5 py-0.3 text-gray-600 border rounded-full border-gray-500'>{aToken ? 'Admin' : 'Doctor'}</p>
      </div>
      <button onClick={logout} className='px-10 py-2 text-white transition-all duration-300 border rounded-full bg-primary'>Logout</button>
    </div>
  )
}

export default Navbar
