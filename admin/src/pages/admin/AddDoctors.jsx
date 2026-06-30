import { useContext, useState } from "react";
import { assets } from "../../assets/assets";
import { AdminContext } from "../../context/AdminContext";
import { toast } from "react-toastify";
import axios from "axios";

const AddDoctors = () => {
  const [docImage, setDocImage] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [experience, setExperience] = useState("1 year");
  const [fees, setFees] = useState("");
  const [speciality, setSpeciality] = useState("General Physician");
  const [education, setEducation] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [about, setAbout] = useState("");

  const { backendUrl, aToken } = useContext(AdminContext);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      if (!docImage) {
        return toast.error("Please upload doctor image");
      }
      const formData = new FormData();
      formData.append("image", docImage);
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("experience", experience);
      formData.append("fees", Number(fees));
      formData.append("speciality", speciality);
      formData.append("degree", education);
      formData.append(
        "address",
        JSON.stringify({ line1: address1, line2: address2 })
      );
      formData.append("about", about);

      formData.forEach((value, key) => {
        console.log(`${key}: ${value}`);
      });

      const { data } = await axios.post(
        backendUrl + 'api/admin/add-doctor',formData, { headers: { aToken } }
      );
      if (data.success) {
        toast.success(data.message);
        setDocImage(false)
        setName("")
        setEmail("")
        setPassword("")
        setFees("")
        setAbout("")
        setEducation("")
        setAddress1("")
        setAddress2("")
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error)
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="w-full m-5">
      <p className="mb-3 text-lg font-medium">Add Doctors</p>
      <div className="w-full max-w-4xl px-8 py-8 bg-white border rounded max-h-[80vh] overflow-y-scroll">
        <div className="flex items-center gap-4 mb-8 text-gray-800">
          <label htmlFor="doc-img">
            <img
              className="w-16 bg-gray-100 rounded-full cursor-pointer"
              src={
                docImage ? URL.createObjectURL(docImage) : assets.upload_area
              }
              alt=""
            />
          </label>
          <input
            onChange={(e) => setDocImage(e.target.files[0])}
            type="file"
            id="doc-img"
            hidden
          />
          <p>
            Upload doctor <br /> picture
          </p>
        </div>

        <div className="flex flex-col gap-10 text-gray-600 lg:flex-row">
          <div className="flex flex-col w-full gap-4 lg:flex-1 ">
            <div className="flex flex-col flex-1 gap-1">
              <p>Doctor Name</p>
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                className="px-3 py-2 border rounded"
                type="text"
                placeholder="Name"
                required
              />
            </div>

            <div className="flex flex-col flex-1 gap-1">
              <p>Doctor Email</p>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className="px-3 py-2 border rounded"
                type="email"
                placeholder="Email"
                required
              />
            </div>

            <div className="flex flex-col flex-1 gap-1">
              <p>Password</p>
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className="px-3 py-2 border rounded"
                type="password"
                placeholder="Password"
                required
              />
            </div>

            <div className="flex flex-col flex-1 gap-1">
              <p>Experience</p>
              <select onChange={(e) => setExperience(e.target.value)}
                value={experience} className="px-3 py-2 border rounded" name="" id="">
                <option value="1 year">1 year</option>
                <option value="2 year">2 year</option>
                <option value="3 year">3 year</option>
                <option value="4 year">4 year</option>
                <option value="5 year">5 year</option>
                <option value="6 year">6 year</option>
                <option value="7 year">7 year</option>
                <option value="8 year">8 year</option>
                <option value="9 year">9 year</option>
                <option value="10 year">10 year</option>
              </select>
            </div>

            <div className="flex flex-col flex-1 gap-1">
              <p>Fees</p>
              <input
                onChange={(e) => setFees(e.target.value)}
                value={fees}
                className="px-3 py-2 border rounded"
                type="number"
                placeholder="Fees"
                required
              />
            </div>
          </div>

          <div className="flex flex-col w-full gap-4 lg:flex-1">
            <div className="flex flex-col gap-1">
              <p>Speciality</p>
              <select onChange={(e) => setSpeciality(e.target.value)}
                value={speciality} className="px-3 py-2 border rounded" name="" id="">
                <option value="General physician">General physician</option>
                <option value="Gynecologist">Gynecologist</option>
                <option value="Dermatologist">Dermatologist</option>
                <option value="Pediatricians">Pediatricians</option>
                <option value="Neurologist">Neurologist</option>
                <option value="Gastroenterologist">Gastroenterologist</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <p>Education</p>
              <input
                onChange={(e) => setEducation(e.target.value)}
                value={education}
                className="px-3 py-2 border rounded"
                type="text"
                placeholder="Education"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <p>Address</p>
              <input
                onChange={(e) => setAddress1(e.target.value)}
                value={address1}
                className="px-3 py-2 border rounded"
                type="text"
                placeholder="Address 1"
                required
              />
              <input
                onChange={(e) => setAddress2(e.target.value)}
                value={address2}
                className="px-3 py-2 border rounded"
                type="text"
                placeholder="Address 2"
                required
              />
            </div>
          </div>
        </div>

        <div>
          <p className="mt-4 mb-2">About me</p>
          <textarea
            onChange={(e) => setAbout(e.target.value)}
            value={about}
            className="w-full px-4 pt-2 border rounded"
            placeholder="write about doctors"
            required
            rows={5}
          />
        </div>

        <button
          type="submit"
          className="px-10 py-3 mt-4 text-white rounded-full bg-primary"
        >
          Add doctor
        </button>
      </div>
    </form>
  );
};

export default AddDoctors;
