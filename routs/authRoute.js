import express from "express";
import { authMiddleware } from '../middlewares/authMiddleware.js'
import { applyDoctorController, authController, bookAppointmentController, bookingAvailibilityController, deleteAllNotificationController, getAllDoctorController, getAllNotificationDoctorController, loginController, registerController, userAppointmentController } from "../controllers/authController.js";

//router onject
const router = express.Router();

//routes
//LOGIN || POST
router.post("/login", loginController);

//REGISTER || POST
router.post("/register", registerController);

//Auth || POST
router.post("/getUserData", authMiddleware, authController);
//Apply Docter || POST
router.post("/apply-doctor", authMiddleware, applyDoctorController);
//Notification Docter || POST
router.post("/get-all-notification", authMiddleware, getAllNotificationDoctorController);
//Delete all notification || POST
router.post('/delete-all-notification', authMiddleware, deleteAllNotificationController)
//get all doctor
router.get('/get-all-doctors', authMiddleware, getAllDoctorController)
//book appointment
router.post('/book-appointment', authMiddleware, bookAppointmentController)
//Booking availablity 
router.post('/booking-availability', authMiddleware,bookingAvailibilityController)
//Appointment List
router.get('/user-appointments', authMiddleware, userAppointmentController)
export default router;
