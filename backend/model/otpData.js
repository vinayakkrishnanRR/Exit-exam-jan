const mongoose=require ('mongoose');
const user=mongoose.Schema({
    email:String,    
    OTP:String,
    verification:Boolean
})
const userdata=mongoose.model('otpdatas',user);
module.exports=userdata;