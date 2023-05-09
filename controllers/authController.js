import userModel from '../models/userModel.js'
import doctorModel from '../models/doctorModel.js'
import appointmentModel from '../models/appointmentModel.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import moment from 'moment'


//register callback
export const registerController = async (req, res) => {
  try {
    const exisitingUser = await userModel.findOne({ email: req.body.email });
    if (exisitingUser) {
      return res
        .status(200)
        .send({ message: "User Already Exist, Please login!", success: false });
    }
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    req.body.password = hashedPassword;
    const newUser = new userModel(req.body);
    await newUser.save();
    res.status(201).send({ message: "Register Sucessfully", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `Register Controller ${error.message}`,
    });
  }
};

// login callback
export const loginController = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(200)
        .send({ message: "user not found please register!", success: false });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res
        .status(200)
        .send({ message: "Invlid EMail or Password", success: false });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d"
    });
    res.status(200).send({ message: "Login Success", success: true, token });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: `Error in Login Controller ${error.message}` });
  }
};

export const authController = async (req, res) => {
  try {
    const user = await userModel.findById({ _id: req.body.userId });
    user.password = undefined
    if (!user) {
      return res.status(200).send({
        message: "user not found please register!",
        success: false,
      });
    } else {
      res.status(200).send({
        success: true,
        data: user,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "authorization error",
      success: false,
      error,
    });
  }
};

//Apply Doctor 
export const applyDoctorController = async (req, res) => {

  try {
    const newDoctor = await doctorModel({ ...req.body, status: 'pending' });
    await newDoctor.save()
    const adminUser = await userModel.findOne({ isAdmin: true });
    const notification = adminUser.notification;
    notification.push({
      type: 'apply-doctor-request',
      message: `${newDoctor.firstName} ${newDoctor.lastName} Has Applied for a Dector Account`,
      data: {
        doctorId: newDoctor._id,
        name: newDoctor.firstName + " " + newDoctor.lastName,
        onClickPath: '/admin/doctors',
      },
    })
    await userModel.findByIdAndUpdate(adminUser._id, { notification })
    res.status(201).send({
      success: true,
      message: 'Docter Account Applied Successfully',
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      error,
      message: "Error in Applying for Doctor"
    })

  }
}
//get all notification
export const getAllNotificationDoctorController = async (req, res) => {

  try {
    const user = await userModel.findOne({ _id: req.body.userId })
    const seennotification = user.seennotification
    const notification = user.notification
    seennotification.push(...notification)
    user.notification = []
    user.seennotification = notification
    const updatedUser = await user.save()
    res.status(200).send({
      success: true,
      message: "All notification marked as read",
      data: updatedUser,
    })

  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: "Error get all notification",
      error
    })

  }
}

//delete notification
export const deleteAllNotificationController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    user.notification = [];
    user.seennotification = [];
    const updateUser = await user.save()
    updateUser.password = undefined;
    res.status(200).send({
      success: true,
      message: "Delete notification Successfully",
      data: updateUser,
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: "Error deleting notificaiton",
      error
    })


  }
}
//get all doctor
export const getAllDoctorController = async (req, res) => {
  try {
    const doctors = await doctorModel.find({ status: "approved" });
    res.status(200).send({
      success: true,
      message: "Feched doctors list successfully",
      data: doctors,
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: 'Error in get all doctors',
      error
    })

  }
}
//book-appointment
export const bookAppointmentController = async (req, res) => {
  try {
    req.body.date = moment(req.body.date, "DD-MM-YYYY").toISOString();
    req.body.time = moment(req.body.time, "HH:mm").toISOString();
    req.body.status = 'pending'
    const newAppointment = new appointmentModel(req.body)
    await newAppointment.save()
    const user = await userModel.findOne({ _id: req.body.doctorInfo.userId })
    user.notification.push({
      type: 'New-appointment-request',
      message: `A New Appointment Request from ${req.body.userInfo.name} `,
      onClickPath: '/user/appointments'
    })
    await user.save()
    res.status(200).send({
      success: true,
      message: "Appointment Book successfully",

    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: "Error in book-appointment",
      error
    })

  }
}
//booking availibility
export const bookingAvailibilityController = async (req, res) => {
  try {
    const date = moment(req.body.date, 'DD-MM-YY').toISOString();
    const fromTime = moment(req.body.time, 'HH:mm').subtract(1, 'hours').toISOString();
    const toTime = moment(req.body.time, 'HH:mm').add(1, 'hours').toISOString()
    const doctorId = req.body.doctorId
    const appointments = await appointmentModel.find({ doctorId, date, time: { $gte: fromTime, $lte: toTime }, })
    if (appointments.length > 0) {
      return res.status(200).send({
        message: 'Appointment is not available at this time',
        success: true,
      })
    } else {
      return res.status(200).send({
        success: true,
        message: 'Appointment is available'
      })
    }
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: 'Error on booking availibility',
      error
    })

  }
}
//User Appointment 
export const userAppointmentController = async (req,res)=>{
  try {
    const appointemnts = await appointmentModel.find({userId: req.body.userId});
    res.status(200).send({
      success:true,
      message:'Uuser appointment fetch successfully',
      data: appointemnts
    })
  } catch (error) {
    res.status(500).send({
      success:false,
      message:"Error in User appointemnts",
      error
    })
    
  }
}