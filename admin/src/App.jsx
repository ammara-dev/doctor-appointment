import React, { useContext } from 'react'
import Login from './pages/Login'
import { ToastContainer } from 'react-toastify';
import { AdminContext } from './context/AdminContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/admin/Dashboard'
import AddDoctors from './pages/admin/AddDoctors'
import DoctorsList from './pages/admin/DoctorsList'
import AllAppointments from './pages/admin/AllAppointments'
import { DoctorContext } from './context/DoctorContext';
import DoctorAppointments from './pages/doctor/DoctorAppointments';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import DoctorProfile from './pages/doctor/DoctorProfile';

const App = () => {

  const {aToken} = useContext(AdminContext)
  const {dToken} = useContext(DoctorContext)

  return aToken || dToken ? (
    <div className='bg-[#F8F9FD]'>
      <ToastContainer/>
      <Navbar />
      <div className='flex items-start'>
        <Sidebar/>
        < Routes>
        {/* ADMIN ROUTES */}
        < Route path='/' element={<></>}/>
        <Route path='/admin-dashboard' element={<Dashboard />}  />
        <Route path='/all-appointments' element={<AllAppointments/>} />
        <Route path='/add-doctors' element={<AddDoctors/>} />
        <Route path='/doctors-list' element={<DoctorsList/>} />
        {/* DOCTOR ROUTES */}
        <Route path='/doctor-appointments' element={<DoctorAppointments/>} />
        <Route path='/doctor-dashboard' element={<DoctorDashboard/>} />
        <Route path='/doctor-profile' element={<DoctorProfile/>} />
        </Routes>
      </div>
    </div>
  ) : (
    <>
    <Login/>
      <ToastContainer/>
      </>
  )
}

export default App
