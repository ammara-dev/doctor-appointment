import doctorModel from "../model/doctorsModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import appointmentModel from "../model/appointmentModel.js";
// change availability of doctor

const changeAvailability = async (req, res) => {
  try {
    const { docId } = req.body;
    const docData = await doctorModel.findById(docId);
    await doctorModel.findByIdAndUpdate(docId, {
      available: !docData.available,
    });
    res.json({ success: true, message: "Availability changed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// get doctors list
const doctorList = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select(["-password", "-email"]);
    res.json({ success: true, doctors });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//API for loginDoctor

const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;
    const doctor = await doctorModel.findOne({ email });
    if (!doctor) {
      return res.json({ success: false, message: "Invalid Credentials" });
    }

    const isMatch = await bcrypt.compare(password, doctor.password);

    if (isMatch) {
      const token = await jwt.sign(
        { id: doctor._id },
        process.env.JWT_SECRET_KEY
      );
      return res.json({ success: true, token });
    } else {
      return res.json({ success: false, message: "Invalid Credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//API TO GET THE APPOINTMENT OF A DOCTOR FOR DOCTOR PANEL
const getDoctorAppointments = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({ docId: req.docId });
    return res.json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API FOR COMPLETEE APPOINTMENT
const appointmentComplete = async (req, res) => {
  try {
    const {appointmentId } = req.body;
    const docId = req.docId;

    const appointmentData = await appointmentModel.findById(appointmentId);

    if (appointmentData && appointmentData.docId === docId) {
      await appointmentModel.findByIdAndUpdate(appointmentId, {
        isCompleted: "true",
      });

      return res.json({ success: true, message: "Appointment Completed" });
    } else {
      return res.json({ success: false, message: "Marked Failed" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API TO CANCEL APPOINTMENT FOR DOCTOR PANEL
const appointmentCancel = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const docId = req.docId;

    const appointmentData = await appointmentModel.findById(appointmentId);

    if (appointmentData && appointmentData.docId === docId) {
      await appointmentModel.findByIdAndUpdate(appointmentId, {
        cancelled: "true",
      });

      return res.json({ success: true, message: "Appointment Cancelled" });
    } else {
      return res.json({ success: false, message: "Cancellation Failed" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


//API to get dashboard data for doctor panel
 
const doctorDashboard = async(req, res) => {
  try {
    const docId = req.docId;
    const appointments = await appointmentModel.find({docId})
    let earnings = 0;
    appointments.map((item) => {
      if(item.isCompleted || item.payment) {
        earnings += item.amount
    }})

    let patients = []

    appointments.map((item) => {
      if(!patients.includes(item.userId)) {
        patients.push(item.userId)
      }})

const dashData = {
  earnings,
  appointments: appointments.length,
  patients: patients.length,
  latestAppointments: appointments.reverse().slice(0,5)
}

return res.json({success: true, dashData})

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}


//API TO GET DOCTOR PROFILE FOR DOCTOR PANEL
const doctorProfile = async (req, res) => { 
  try {
    
    const docId = req.docId

    const profileData = await doctorModel.findById(docId).select('-password')
    return res.json({success: true, profileData})
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}


//API TO UPDATE DOCTOR PROFILE FOR DOCTOR PANEL
const updateDoctorProfile = async (req, res) => { 
  try {
    const {fees, available, address} = req.body;
    const docId = req.docId
    await doctorModel.findByIdAndUpdate(docId, {fees, available, address})
    return res.json({success: true, message: "Profile Updated"})
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}
  

export {
  changeAvailability,
  doctorList,
  loginDoctor,
  getDoctorAppointments,
  appointmentCancel,
  appointmentComplete,
  doctorDashboard,
  updateDoctorProfile, 
  doctorProfile
};
