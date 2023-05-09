import doctorModel from '../models/doctorModel.js'
import appointmentModel from '../models/appointmentModel.js'
import userModel from '../models/userModel.js'


//get Doctor info
export const getDocterController = async (req, res) => {
    try {
        const doctor = await doctorModel.findOne({ userId: req.body.userId })
        res.status(200).send({
            success: true,
            message: "doctor data fitched successfully",
            data: doctor

        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error geting docter info ",
            error
        })

    }
}
//update profile
export const updatProfileController = async (req, res) => {
    try {
        const doctor = await doctorModel.findOneAndUpdate({ userId: req.body.userId }, req.body, { new: true });
        res.status(201).send({
            success: true,
            message: 'Doctor profile updated successfully',
            data: doctor,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Doctor Profile Update Error",
            error
        })
    }
}


//get doctor by id 
export const getDoctorByIdController = async (req, res) => {
    try {
        const doctor = await doctorModel.findOne({ _id: req.body.doctorId })
        res.status(200).send({
            success: true,
            message: "Fetched single doctor successfully",
            data: doctor,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error geting doctor id",
            error
        })

    }
}
//get doctor appointments
export const doctorAppointmentController = async (req, res) => {
    try {
        const doctor = await doctorModel.findOne({ userId: req.body.userId })
        console.log('doctor:', doctor)


        if (!doctor) {
            return res.status(404).send({
                success: false,
                message: 'Doctor not found',
            })
        }
        const appointments = await appointmentModel.find({ doctorId: doctor._id })
        console.log('doctor._id:', doctor._id)
        res.status(200).send({
            success: true,
            message: 'Doctor appointment fetched successfully',
            data: appointments,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error in getting doctor appointments',
            error
        })
    }
}

//update appointment status
export const udateStatusController = async (req, res) => {
    try {
        const { appointmentsId, status } = req.body
        const appointments = await appointmentModel.findByIdAndUpdate(appointmentsId, { status })
        const user = await userModel.findOne({ _id: appointments.userId })
        const notification = user.notification;
        notification.push({
            type: "status-updated",
            message: `Your appointment has been updated, ${status}`,
            onclickPath: "/doctor-appointments",
        })
        await user.save()
        res.status(200).send({
            success: true,
            message: 'Appointment status updated',

        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error on update appointment Status',
            error
        })

    }
}
//delete appointment
export const deleteAppointmentController = async (req, res) => {
    try {
        const user = await appointmentModel.findByIdAndDelete(req.params._Id)
        res.status(200).send({
            success: true,
            message: 'User appointment delete successfully',
            data: user
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error in deleting appointment',
            error
        })

    }
}