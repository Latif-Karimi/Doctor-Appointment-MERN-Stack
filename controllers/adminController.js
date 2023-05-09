import doctorModel from '../models/doctorModel.js'
import userModlel from '../models/userModel.js'

//get all Users
export const getAllUserController = async (req, res) => {
    try {
        const users = await userModlel.find({})
        res.status(200).send({
            success: true,
            message: "users data list",
            data: users,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Feching user Error",
            error
        })


    }
}
//get all Doctors
export const getAllDoctorsController = async (req, res) => {
    try {
        const doctors = await doctorModel.find({})
        res.status(200).send({
            success: true,
            message: "Doctors data lists",
            data: doctors,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error in All docters list",
            error
        })

    }
}
//docter account status
export const changeAccountStatusController = async (req, res) => {
    try {
        const { doctorId, status } = req.body
        const doctor = await doctorModel.findByIdAndUpdate(doctorId, { status })
        const user = await userModlel.findOne({ _id: doctor.userId })
        const notification = user.notification
        notification.push({
            type: 'doctor-account-request-updated',
            message: `Your Doctor Account Request Has ${status}`,
            onclickPath: '/notification'
        })
        user.isDoctor = status === 'approved' ? true : false
        await user.save()
        res.status(201).send({
            success: true,
            message: 'Account Status Updated',
            data: doctor,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error in Doctor account status",
            error
        })

    }
}
//delete user account 
export const deleteUserAccountController = async (req, res) => {
    try {
        const user = await userModlel.findByIdAndDelete(req.params.userId);
        res.status(200).send({
            success:true,
            message:"User deleted succcessfully",
            data:user
        })
      } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message: "Error on deleting user",
            error
        })
      }
    }
    
  
  