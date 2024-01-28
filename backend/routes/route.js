const express = require('express');
const otpData = require('../model/otpData');
const router = express.Router()
const jwt = require('jsonwebtoken');
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

const nodeM= require('nodemailer');
const mailId=process.env.mailId;
const pass=process.env.password;
const send= nodeM.createTransport({
  service: 'gmail',
  auth:{
    user: mailId,
    pass: pass
  }}) 

router.post('/verify',async (req, res) => {
    try {
      const { Email, recievedOTP } = req.body;
      console.log({ Email, recievedOTP })
      const userFound = await otpData.findOne({ Email, recievedOTP });     
      const userCheck = await otpData.findOne({ Email });
      const otpCheck = await otpData.findOne({ recievedOTP });
      if(userFound){
        console.log('found')
            let payload ={ email:Email, OTP:recievedOTP };
            let token = jwt.sign(payload,'verified');            
            res.status(200).send({message:'verif-success', token:token});
        } else if(!userCheck){
            console.log('notfound')
            res.status(404).send({error:'user-404'});   
        }else if(!otpCheck){
            console.log('wrongotp')
            res.status(404).send({error:'wrong-otp'});       
        }else{
            res.status(404).send({error:'not-found'});
        }
    } catch (error) {
       console.error('Verification Error:', error);
       res.status(500).send(error);
    } 
  });
  
router.post('/mail', async (req, res)=>{
    const toSend= req.body;
    const data = new otpData({
        email :toSend.recieverMail,
        OTP : toSend.OTP,
    })
console.log(toSend.OTP)
    try {
        const saveInfo = await data.save();
        res.status(200).send("Updated Successfully")
    }
    catch (error) {
        res.status(400).json({message: error.message})
    }
    var mailInfo = {
            from: 'vinayakrr67@gmail.com',
            to: toSend.recieverMail,
            subject: 'Verify Email',
            html: `<html>
                    <p>Your OTP is:</p><br/><br/>
                    <p>${toSend.OTP}</p>
                  </html>`, 
        }
        send.sendMail(mailInfo, function(err, info){      
            if(err){
                res.status(400).json({message: err.message}) 
            }else{
                console.log('Email has been sent '+ info.response);      
                res.status(200).send({message:'success','Email has been sent ':info.response})
        }
    })
})

module.exports = router;