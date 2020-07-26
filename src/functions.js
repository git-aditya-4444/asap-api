const User=require('./models/user')
const Otp=require('./models/otp')
const Org=require('./models/org')

function genOTP() { 
    var digits = '0123456789'; 
    let OTP = ''; 
    for (let i = 0; i < 6; i++ ) { 
        OTP += digits[Math.floor(Math.random() * 10)]; 
    } 
    return OTP
} 

function createArr(objArr,arr){
    objArr.forEach(x=>{
        arr.push(x.value)
    })
}

module.exports={genOTP,createArr}