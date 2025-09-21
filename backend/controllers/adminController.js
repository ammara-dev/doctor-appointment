import validator from "validator";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../model/doctorsModel.js";
import jwt from "jsonwebtoken";
import appointmentModel from "../model/appointmentModel.js";
import userModel from "../model/userModel.js";

//api for adding doctors

const addDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      speciality,
      degree,
      experience,
      about,
      fees,
      address,
    } = req.body;

    const imageFile = req.file;

    if (
      !name ||
      !email ||
      !password ||
      !speciality ||
      !degree ||
      !experience ||
      !about ||
      !fees ||
      !address
    ) {
      return res.json({ success: false, message: "Missing Details" });
    }

    //validate email format
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Invalid Email" });
    }

    //validating strong password
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please enter strong password",
      });
    }

    //hashing doctor password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //upload image to cloudinary
    const uploadImage = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });
    const imageUrl = uploadImage.secure_url;

    const doctor = {
      name,
      image: imageUrl,
      email,
      password: hashedPassword,
      speciality,
      degree,
      experience,
      about,
      fees,
      address: JSON.parse(address),
    };

    const newDoctor = new doctorModel(doctor);
    await newDoctor.save();
    res.json({ success: true, message: "Doctor added successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error in adding doctor" });
  }
};

//API for login admin
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("ENV EMAIL:", process.env.ADMIN_EMAIL);
    console.log("REQ EMAIL:", email);
    console.log("ENV PASSWORD:", process.env.ADMIN_PASSWORD);
    console.log("REQ PASSWORD:", password);

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(
        { email: process.env.ADMIN_EMAIL },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "1d" }
      );

      return res.json({ success: true, message: "Login successful", token });
    } else {
      return res.json({ success: false, message: "Invalid Credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error in admin login" });
  }
};

//api to get all doctors list for admin panel

const allDoctors = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select("-password");
    res.json({success : true, doctors})
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error in admin login" });
  }
};


//api to get all appointments list for admin panel
const appointmentsAdmin = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({});
    res.json({success : true, appointments})
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}

//API to cancle appointment
const appointmentCancel = async (req, res) => {
  try {
    const { appointmentId} = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);

    const {docId, slotDate, slotTime} = appointmentData;

    const docData = await doctorModel.findById(docId).select("-password");

    let slots_booked = docData.slots_booked;
    

    slots_booked[slotDate] = slots_booked[slotDate].filter((slot) => slot !== slotTime);

    await doctorModel.findByIdAndUpdate(docId, { slots_booked });
    await appointmentModel.findByIdAndUpdate(appointmentId, {cancelled : true});

    return res.json({ success: true, message: "Appointment Cancelled" });

    

  } catch (error) {
    console.log(error.message);
    return res.json({ success: false, message: error.message }); 
  }
}


const adminDashboard = async (req, res) => {
  try {
      const doctor = await doctorModel.find({});
      const appointment = await appointmentModel.find({});
      const user = await userModel.find({});

      const dashData = {
        doctors : doctor.length,  
        appointments : appointment.length,
        patients : user.length,
        latestAppoinment : appointment.reverse().slice(0,5)
      }

      return res.json({ success: true, dashData });



  } catch (error) {
    console.log(error.message);
    return res.json({ success: false, message: error.message }); 
  }
}


export { addDoctor, loginAdmin, allDoctors, appointmentsAdmin , appointmentCancel, adminDashboard};
