import { useContext, useEffect, useState } from "react"
import { AppContext } from "../context/AppContext"
import { useNavigate } from "react-router-dom";


const RelateDoctors = ({speciality, docId}) => {
    const navigate = useNavigate();
    const {doctors} = useContext(AppContext);
    const [relDoc, setRelDoc] = useState([])

    useEffect(() =>{
        if(doctors.length > 0 && speciality){
            const doctorsData = doctors.filter((doc) => doc.speciality === speciality && doc._id != docId )
            setRelDoc(doctorsData);
        }
    }, [doctors, docId, speciality])
  return (
    <div>
      <div className="flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10">
        <h1 className="text-3xl font-medium">Top Doctors to Book</h1>
        <p className="text-sm text-center sm:w-1/3">Simply browse through our extensive list of trusted doctors.</p>
        <div className="grid w-full gap-4 px-3 pt-5 grid-cols-auto gap-y-6 sm:px-0">
      {relDoc.slice(0, 10).map((item, index) => (
        <div onClick={() => {navigate(`/appointment/${item._id}`); scrollTo(0, 0)}} key={index} className="overflow-hidden border border-blue-200 cursor-pointer rounded-xl hover:translate-y-[-10px] transition-all duration-500">
            <img className="bg-blue-50" src={item.image}      alt="" />
            <div className="p-4">
           <div className={`flex items-center gap-2 text-sm text-center
               ${item.available ? 'text-green-500' : 'text-gray-500' }  `}>
                <p className={`w-2 h-2 ${item.available ? 'bg-green-500' : 'bg-gray-500' } rounded-full`}></p><p>{item.available ? 'Available' : 'Not available'}</p>
            </div> 
            <p className="text-xl font-medium text-gray-900">{item.name}</p>
            <p className="text-sm text-gray-600">{item.speciality}</p>
        </div></div>
      ))}
      </div>
      <button onClick={() => { navigate('/doctors'); scrollTo(0, 0)}} className="px-12 py-3 mt-10 text-gray-600 rounded-full bg-blue-50">more</button>
    </div>
    </div>
  )
}

export default RelateDoctors
