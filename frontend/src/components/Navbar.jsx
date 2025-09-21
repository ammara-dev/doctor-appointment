import { NavLink, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
const Navbar = () => {
  const navigate = useNavigate();

  const [showMenu, setShowMenu] = useState(false);
  const {token, setToken, userData} = useContext(AppContext);

  const logout = () => {
    setToken(false)
    localStorage.removeItem('token')
  }

  return (
    <div className="flex items-center justify-between py-4 mb-5 text-sm border-b border-b-gray-400">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        className="cursor-pointer w-44"
      />
      <ul className="items-start hidden gap-5 font-medium md:flex">
        <NavLink to="/">
          <li className="p-1">HOME</li>
          <hr className="border-none outline-none h-0.5 w-3/5 m-auto bg-primary hidden" />
        </NavLink>
        <NavLink to="/doctors">
          <li className="p-1">ALL DOCTORS</li>
          <hr className="border-none outline-none h-0.5 w-3/5 m-auto bg-primary hidden" />
        </NavLink>
        <NavLink to="/about">
          <li className="p-1">ABOUT</li>
          <hr className="border-none outline-none h-0.5 w-3/5 m-auto bg-primary hidden" />
        </NavLink>
        <NavLink to="/contact">
          <li className="p-1">CONTACT</li>
          <hr className="border-none outline-none h-0.5 w-3/5 m-auto bg-primary hidden" />
        </NavLink>
      </ul>
      <div className="flex items-center gap-4">
        {token && userData ? (
          <div className="relative flex items-center gap-2 cursor-pointer group">
            <img className="w-8 rounded-full" src={userData.image} alt="" />
           
            <div className="absolute top-0 right-0 z-20 hidden text-base font-medium text-gray-600 pt-14 group-hover:block">
              <div className="flex flex-col p-4 m-4 rounded min-w-48 bg-stone-100">
                <p
                  onClick={() => navigate("/my-profile")}
                  className="cursor-pointer hover:text-black"
                >
                  My Profile
                </p>
                <p
                  onClick={() => navigate("/my-appointments")}
                  className="cursor-pointer hover:text-black"
                >
                  My Appointment
                </p>
                <p
                  onClick={logout}
                  className="cursor-pointer hover:text-black"
                >
                  Logout
                </p>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="hidden px-8 py-3 text-white rounded-full bg-primary margin-5 md:block"
          >
            Create Account
          </button>
        )}

        <img
          className="w-6 md:hidden"
          onClick={() => setShowMenu(true)}
          src={assets.menu_icon}
          alt=""
        />

        {/* -------------MOBILE MENU------------ */}
        <div className={`${showMenu ? 'fixed w-full' : 'h-0 w-0' } bottom-0 top-0 right-0 z-20 overflow-hidden transition-all bg-white md:hidden`}>
          <div className="flex items-center justify-between px-8 py-6">
            <img className="w-32" src={assets.logo} alt="" />
            <img className="w-7" src={assets.cross_icon} alt="" onClick={() => setShowMenu(false)}/>
            </div>
            <ul className="flex flex-col items-center gap-2 px-5 mt-5 text-xl font-medium">
              <NavLink  onClick={() => setShowMenu(false)} to={'/'}> <p className='inline-block px-4 py-2 rounded'>HOME</p> </NavLink>
              <NavLink  onClick={() => setShowMenu(false)} to={'/doctors'}> <p className='inline-block px-4 py-2 rounded'>ALL DOCTORS</p> </NavLink>
              <NavLink  onClick={() => setShowMenu(false)} to={'/about'}>  <p className='inline-block px-4 py-2 rounded'>ABOUT</p> </NavLink>
              <NavLink  onClick={() => setShowMenu(false)} to={'/contact'}>  <p className='inline-block px-4 py-2 rounded'>CONTACT US</p> </NavLink>
            </ul>
          
        </div>
      </div>
    </div>
  );
};

export default Navbar;
