const express = require('express');
const mongoose=require('mongoose');
const cors = require('cors');
const path=require('path');
const dataRouter=require('./routes/route.js');
require('dotenv').config();

const app= express();
app.use(express.static(path.join(__dirname,'/build')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

const mongoUrl=process.env.mongoUrl;
mongoose.connect(mongoUrl)
.then(() => {
    console.log("Connected to OtpDB");
  })
  .catch((error) => {
    console.error("Error connecting to OtpDB:", error);
  });

//Setting basic backend API routes
app.use('/user',dataRouter);

app.get("/*",(req,res)=>{res.sendFile(path.join(__dirname,'/build/index.html'));});
const PORT = process.env.PORT || 4000;
app.listen(PORT,()=>{
    console.log(`Server is running on PORT ${PORT}`);
})
