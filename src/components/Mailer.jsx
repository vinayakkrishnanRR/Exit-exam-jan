import React, { useState } from 'react'
import { Button, TextField, Grid } from '@mui/material'
import { useNavigate } from 'react-router-dom';
import axiosInt from '../axiosInt'

const Mailer = (props) => {
    const navigate=useNavigate();
    const [errors, setErrors]=useState({});
    const [mailData, setMailData]=useState({
        recieverMail: props.data ? props.data.recieverMail : '',
        OTP: props.data ? props.data.OTP : '',
        EMail: props.data ? props.data.EMail : '',
        recievedOTP: props.data ? props.data.OTP : ''
      })    
      
    const resetForm =()=>{
      setMailData({
        recieverMail: '',
        recievedOTP: '',
        EMail: '',
        OTP: ''
      })
    }
    
    const handleChange = (e) => {
      setMailData(prevState=>({
        ...prevState,
        [e.target.name]: e.target.value,      
      }));
      setErrors({ ...errors, [e.target.name]: '' });
    };
    const generateOTP=()=> {
      var digits = '0123456789';
      let OTP = '';
      for (let i = 0; i < 6; i++ ) {
          OTP += digits[Math.floor(Math.random() * 10)];
      }
      mailData.OTP=OTP;
      return OTP
    }

    const handleSend=(e)=>{
        e.preventDefault(); 
        generateOTP()   
        const toSend = mailData  
        console.log(toSend)      
          axiosInt.post('/user/mail',toSend)
          .then(res=>res.data)
          .then(res=>{        
            alert('Email sent successfully')
            console.log('NodemailerWorks-Frontend')
            resetForm()
          })
          .catch(err=>{         
            console.log(err.response) 
              if(err.response===400){
                alert('Error: Email not Sent')
                resetForm() 
              }else if(err.response===500){
                alert('Email not sent. Please try again later')
                resetForm()               
              }
          });
    }
    
    const handleSubmit = ()=>{        
        const user={...mailData}
        axiosInt.post('/user/verify',user)
        .then((res)=>{
          console.log(res.data.message)
          if (res.data.message === 'success-user') {
            sessionStorage.setItem("verificationStatus", res.data.token);       
            navigate('/welcome');            
          }else{
            navigate('/');
          }
    })
    }

  return (
    <div>
        <Grid container spacing={2}>
            <Grid item xs={12} sm={8} md={8}>
              <h1 className='mailHead' style={{ marginLeft:'5%'}}>Verify E-mail to enter website</h1>
            </Grid>
            <Grid item xs={12} sm={4} md={4}></Grid>
        </Grid>
        <form>
            <Grid container spacing={2} className='verify' >
                <Grid item xs={1} sm={2} md={2}></Grid>
                <Grid item xs={10} sm={8} md={8}>
                    <Grid container className='otpForm'> 
                        <Grid item xs={12} sm={12} md={12} marginBottom='2.5%'>
                          <TextField
                              fullWidth
                              className="otpFormfields"
                              id="outlined-error"
                              label="E-Mail"
                              variant="outlined"
                              name="EMail"
                              value={mailData.EMail}
                              onChange={handleChange}
                              />
                        </Grid> 
                        <Grid item xs={12} sm={12} md={12} marginBottom='2.5%'>
                          <TextField
                              fullWidth
                              className="otpFormfields"
                              id="outlined-error"
                              label="Enter recieved OTP"
                              variant="outlined"
                              name="recievedOTP"
                              value={mailData.recievedOTP}
                              onChange={handleChange}
                              />
                        </Grid> 
                        <Grid item xs={12} sm={4} md={4}></Grid>  
                        <Grid item xs={12} sm={4} md={4}>
                          <Button variant="contained" className='submitBtn' fullWidth onClick={handleSubmit}>Submit</Button>
                        </Grid>     
                    </Grid>
                </Grid>
                <Grid item xs={1} sm={2} md={2}></Grid>            
            </Grid>                
        </form>
        <form>
            <Grid container spacing={2} className='mailer' >
                <Grid item xs={12} sm={8} md={8}>
                  <h1 className='mailHead' style={{ marginLeft:'5%'}}>or, Get an OTP to your E-mail</h1>
                </Grid>
                <Grid item xs={12} sm={4} md={4}></Grid>
            </Grid>
            <Grid container spacing={2} className='getOtp' >
                <Grid item xs={1} sm={2} md={2}></Grid>
                <Grid item xs={10} sm={8} md={8}>
                    <Grid container className='otpForm'> 
                        <Grid item xs={12} sm={12} md={12} marginBottom='2.5%'>
                          <TextField
                              fullWidth
                              className="otpFormfields"
                              id="outlined-error"
                              label="E-Mail"
                              variant="outlined"
                              name="recieverMail"
                              value={mailData.recieverMail}
                              onChange={handleChange}
                              />
                        </Grid>                         
                        <Grid item xs={12} sm={4} md={4}></Grid>  
                        <Grid item xs={12} sm={4} md={4}>
                          <Button variant="contained" className='submitBtn' fullWidth onClick={handleSend}>Send OTP</Button>
                        </Grid>     
                    </Grid>
                </Grid>
                <Grid item xs={1} sm={2} md={2}></Grid>            
            </Grid>
        </form>      
    </div>
  )
}

export default Mailer
