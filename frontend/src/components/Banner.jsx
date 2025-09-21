import React from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const Banner = () => {

    const navigate = useNavigate();

  return (
    <div className="flex px-6 my-20 rounded-lg bg-primary lg-px-12 md:mx-10 sm:px-10 md:px-14 ">
      {/* --------LEFT SIDE------- */}
      <div className="flex-1 py-8 lg:pl-5 sm:py-10 md:py-16 lg:py-24">
        <div className="text-xl font-semibold text-white lg:text-4xl sm:text-2xl md:text-3xl">
          <p>Book Appointment</p>
          <p className="mt-4">With 100+ Trusted Doctors</p>
          </div>
          <button onClick={() => {navigate('/login'); scrollTo(0,0)}} className="px-8 py-3 mt-6 text-sm transition-all bg-white rounded-full hover:scale-105 sm:text-base">Create account</button>
        
      </div>
      {/* -----------RIGHT SIDE---------- */}
      <div className="hidden md:block md:w-1/2 lg:w-[370px] relative">
        <img className="absolute bottom-0 right-0 w-full mx-w-md" src={assets.appointment_img} alt="" />
      </div>
    </div>
  );
};

export default Banner;
