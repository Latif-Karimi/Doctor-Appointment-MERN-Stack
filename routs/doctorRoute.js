import express from "express";
import { authMiddleware } from '../middlewares/authMiddleware.js'
import {deleteAppointmentController, doctorAppointmentController, getDocterController, getDoctorByIdController, udateStatusController, updatProfileController} from '../controllers/doctorController.js'

//router onject
const router = express.Router();

//post single Doc info
router.post('/getDoctorInfo', authMiddleware , getDocterController)
//update profile
router.post('/update-profile', authMiddleware,updatProfileController)
//get sigle doctor by id || POST
router.post('/get-doctor-byId', authMiddleware, getDoctorByIdController)
//get appointments
router.get('/doctor-aapointments' , authMiddleware, doctorAppointmentController)
//update appointment status
router.post('/update-status',authMiddleware,udateStatusController)
//delet appointment
router.delete('/delete-appointment/:_Id',authMiddleware, deleteAppointmentController)
export default router;