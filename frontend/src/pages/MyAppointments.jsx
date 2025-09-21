import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect } from "react";
 

const MyAppointments = () => {
  const { BackendUrl, token, getDocData } = useContext(AppContext);

  const [appointment, setAppointment] = useState([]);
  const months = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const slotDateFormat  = (slotDate) => {
    const dateArray = slotDate.split("-");
    return dateArray[0] + " " + months[Number(dateArray[1])] + ", " + dateArray[2];
  }

  const getUserAppointments = async () => {
    try {
      const {data} = await axios.get(BackendUrl+ '/api/user/appointments', {headers : {token}});
      if(data.success){
        setAppointment(data.appointments.reverse());
      }
      
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  }

  useEffect(() => {
    if(token) getUserAppointments();
  }, [token])


  const cancelAppointment = async (appointmentId) => {
    try {
     
      const {data} = await axios.post(BackendUrl+ '/api/user/canel-appointment', {appointmentId}, {headers : {token}});
      if(data.success){
        toast.success(data.message);
        getUserAppointments();
        getDocData();
      } else{
        toast.error(data.message);
      }

    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  }

  return (
    <div>
      <p className="pb-3 mt-12 font-medium border-b text-zinc-500">My Appointments</p>
      {appointment.map((item, index) => (
  <div className="grid grid-cols-[1fr_2fr] border-b gap-4 sm:flex sm:gap-6 py-2" key={index}>
    <div>
      <img className="w-32 bg-indigo-50" src={item.docData?.image} alt="" />
    </div>
    
    <div className="flex-1 text-sm text-zinc-500">
      <p className="font-semibold text-neutral-800">{item.docData?.name}</p>
      <p>{item.docData?.speciality}</p>
      
      <p className="mt-1 font-medium text-zinc-700">Address: </p>
      <p className="text-xs">{item.docData?.address?.line1 || "No Address"}</p>
      <p className="text-xs">{item.docData?.address?.line2 || ""}</p>

      <p className="mt-1 text-xs"> 
        <span className="text-sm font-medium text-zinc-700">Date & Time: </span>
        {slotDateFormat(item.slotDate)} | {item.slotTime}
      </p>
    </div>

    <div className="flex flex-col justify-end gap-2">
      {!item.cancelled && <button className="py-2 text-sm text-center transition-all duration-300 border text-stone-500 sm:min-w-48 hover:bg-primary hover:text-white">Pay here</button>}
     {!item.cancelled && <button onClick={() => cancelAppointment(item._id)} className="py-2 text-sm text-center transition-all duration-300 border text-stone-500 sm:min-w-48 hover:bg-red-600 hover:text-white">Cancel Appointment</button>} 
     {item.cancelled && <button className="py-2 text-red-500 border border-red-500 rounded sm:min-w-48">Appointment cancelled</button>}
    </div>
  </div>
))}

    </div>
  );
};

export default MyAppointments;
