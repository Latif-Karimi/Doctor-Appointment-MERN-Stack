import express from "express";
import authRoute from './routs/authRoute.js'
import adminRoute from './routs/adminRoute.js'
import doctorRoute from './routs/doctorRoute.js'
import dotenv from "dotenv"
import connectDB from "./config/db.js";
import path from 'path'

//dotenv conig
dotenv.config();

//mongodb connection
connectDB();

//rest obejct
const app = express();

//middlewares
app.use(express.json());


//routes
app.use('/api/user', authRoute)
app.use('/api/admin', adminRoute)
app.use('/api/doctor', doctorRoute)

//static files
app.use(express.static(path.join(__dirname, "./client/build")))

app.get("*" , function(req,res){
  res.sendFile(path.join(__dirname, "./client/build/index.html"))
})

//port
const port = process.env.PORT || 3001;
//listen port
app.listen(port, () => {
  console.log(
    `Server Running in ${process.env.NODE_MODE} Mode on port ${process.env.PORT}`
      .bgCyan.white
  );
});
