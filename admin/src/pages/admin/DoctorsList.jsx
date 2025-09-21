import React, { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";

const DoctorsList = () => {
  const { doctors, aToken, getAllDoctors, changeAvailability } = useContext(AdminContext);

  useEffect(() => {
    if (aToken) {
      getAllDoctors();
    }
  }, [aToken]);
  return (
    <div className="m-5 overflow-y-scroll max-h-[90vh]">
      <h1 className="text-lg font-medium">All Doctors</h1>
      <div className="flex flex-wrap w-full gap-4 pt-5 gap-y-6">
        {doctors.map((item, value) => (
          <div className="overflow-hidden border border-indigo-200 max-w-56 rounded-xl group cursor-pointer:" key={value}>
            <img className="transition-all duration-300 bg-indigo-50 group-hover:bg-primary" src={item.image} alt="" />
            <div className="p-4">
              <p className="text-lg font-medium text-neutral-800">{item.name}</p>
              <p className="text-sm text-zinc-600">{item.speciality}</p>
              <div className="flex items-center gap-1 mt-2 text-sm">
                <input onChange={() => changeAvailability(item._id)} type="checkbox" checked={item.available} />
                <p>Available</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorsList;
