import validator from "validator";
import bcrypt, { hash } from "bcrypt";
import userModel from "../model/userModel.js";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../model/doctorsModel.js";
import appointmentModel from "../model/appointmentModel.js";

// API to register User

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.json({ success: false, message: "Missing Details" });
    }

    //validate email format
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "please enter a valid email",
      });
    }

    //validating strong password
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "please enter a strong pasword",
      });
    }

    //hashing user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = {
      name,
      email,
      password: hashedPassword,
    };

    const newUser = new userModel(userData);
    const user = await newUser.save();

    //token for login
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error.message);
    return res.json({ success: false, message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (isPasswordMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY);
      return res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid Credentials" });
    }
  } catch (error) {
    console.log(error.message);
    return res.json({ success: false, message: error.message });
  }
};

//API to get  User profile
const getProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const userData = await userModel.findById(userId).select("-password");
    res.json({ success: true, userData });
  } catch (error) {
    console.log(error.message);
    return res.json({ success: false, message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { name, phone, address, dob, gender } = req.body;
    const imageFile = req.file;

    if (!name || !phone || !address || !dob || !gender) {
      return res.json({ success: false, message: "Missing Details" });
    }

    await userModel.findByIdAndUpdate(userId, {
      name,
      phone,
      address: JSON.parse(address),
      dob,
      gender,
    });

    if (imageFile) {
      //upload image to cloudinary
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      const imageUrl = imageUpload.secure_url;

      await userModel.findByIdAndUpdate(userId, { image: imageUrl });
    }

    return res.json({ success: true, message: "Profile Update" });
  } catch (error) {
    console.log(error.message);
    return res.json({ success: false, message: error.message });
  }
};

//API to book slots
const bookAppointment = async (req, res) => {
  try {
    const { docId, slotDate, slotTime } = req.body;
      const userId = req.userId;

    const docData = await doctorModel.findById(docId).select("-password");

    if (!docData.available) {
      return res.json({ success: false, message: "Doctor is not available" });
    }

    let slots_booked = docData.slots_booked;
    //checking for availability of slot
    if (slots_booked[slotDate]) {
      if (slots_booked[slotDate].includes(slotTime)) {
        return res.json({ success: false, message: "Slot already booked" });
      } else {
        slots_booked[slotDate].push(slotTime);
      }
    } else {
      slots_booked[slotDate] = [];
      slots_booked[slotDate].push(slotTime);
    }

    const userData = await userModel.findById(userId).select("-password");

    const rawDocData = docData.toObject();
    delete rawDocData.slots_booked;

    const appointmentData = {
      userId,
      docId,
      slotDate,
      slotTime,
      userData,
      docData : rawDocData,
      date: Date.now(),
      amount: docData.fees,
    };

    const appointment = new appointmentModel(appointmentData);
    await appointment.save();


    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    return res.json({ success: true, message: "Appointment Booked" });


  } catch (error) {
    console.log(error.message);
    return res.json({ success: false, message: error.message });
  }
};


//API to get all appointments of user
const listAppointments = async (req, res) => {
  try {
    const userId = req.userId;
    const appointments = await appointmentModel.find({ userId: req.userId });
console.log("Booking userId:", req.userId);
console.log("Fetching appointments for userId:", req.userId);


    return res.json({ success: true, appointments });
    
  } catch (error) {
   console.log(error.message);
    return res.json({ success: false, message: error.message }); 
  }
}

//API to cancle appointment
const cancelAppointment = async (req, res) => {
  try {
    const {userId, appointmentId} = req.body;
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


export { registerUser, loginUser, getProfile, updateProfile, bookAppointment, listAppointments, cancelAppointment };
