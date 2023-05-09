import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
    userId: {
        type: String,
    },
    firstName: {
        type: String,
        required: [true, 'first name is required']
    },
    lastName: {
        type: String,
        required: [true, 'last name is required']
    },
    phone: {
        type: String,
        required: [true, 'phone number is required']
    },
    email: {
        type: String,
        required: [true, 'email is required']
    },
    website: {
        type: String,
    },
    address: {
        type: String,
        required: [true, 'address is required']
    },
    specailization: {
        type: String,
        required: [true, 'specailization is required']
    },
    experience: {
        type: String,
        required: [true, 'experience is required']
    },
    fessPerConsultation: {
        type: Number,
        required: [true, 'fee is required']
    },
    status: {
        type: String,
        default: 'pending',
    },
    timings: {
        type: String,
        required: [true, 'work schecual is required']
    },
}, { timestamps: true })



export default mongoose.model("doctors", doctorSchema);