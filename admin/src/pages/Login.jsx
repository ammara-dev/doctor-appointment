import { useContext, useState } from "react";
import {AdminContext} from "../context/AdminContext";
import axios from "axios";
import { toast } from "react-toastify";
import {DoctorContext} from "../context/DoctorContext";


const Login = () => {

  const [state, setState] = useState("Admin");
  const {setAToken, backendUrl} = useContext(AdminContext)
  const {setDToken} = useContext(DoctorContext)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const onSubmitHandler = async (e) =>{
    e.preventDefault()
    
    try {
        if(state === 'Admin'){
            const {data} = await axios.post(backendUrl + 'api/admin/login', {email, password})
            if(data.success){
              localStorage.setItem("aToken", data.token)
                setAToken(data.token);
            } else{
              toast.error(data.message)
            }
        } else{
          const {data} = await axios.post(backendUrl + 'api/doctor/login', {email, password})
         
          if(data.success){
              localStorage.setItem("dToken", data.token)
                setDToken(data.token);
                console.log(data.token)
            } else{
              toast.error(data.message)
            }
        }
    } catch (error) {
        console.log(error.message)
        toast.error(error.message)
    }


  }



  return (
    <form onSubmit={(onSubmitHandler)}  className="min-h-[80vh] flex items-center">
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg">
        <p className="m-auto text-2xl font-semibold">
          <span className="text-primary">{state}</span> Login
        </p>
        <div className="w-full">
          <p>Email</p>
          <input
          onChange={(e) => setEmail(e.target.value)} value={email}
            className="w-full border-[#DADADA] border rounded mt-1 p-2"
            type="email"
            required
          />
        </div>

        <div className="w-full">
          <p>Password</p>
          <input
          onChange={(e) => setPassword(e.target.value)} value={password}
            className="w-full border-[#DADADA] border rounded mt-1 p-2"
            type="password"
            required
          />
        </div>
        <button className="w-full py-2 text-base text-white rounded-md bg-primary">
          Login
        </button>

        {state === "Admin" ? (
          <p>
            Doctor Login?{" "}
            <span
              className="underline cursor-pointer text-primary"
              onClick={() => setState("Doctor")}
            >
              Click here
            </span>
          </p>
        ) : (
          <p>
            Admin Login?{" "}
            <span
              className="underline cursor-pointer text-primary"
              onClick={() => setState("Admin")}
            >
              Click here
            </span>
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;
