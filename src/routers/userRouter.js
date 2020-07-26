const express = require('express')
const User=require('../models/user')
const Otp=require('../models/otp')
const Org=require('../models/org')
const {toLogin,toHome}=require('../authenticate/userAuth')
const {genOTP,createArr} = require('../functions')

const router = new express.Router()


//REGISTER USER----------------------------------------------------------------------------
router.get('/register/user',toHome,async (req,res)=>{
try{
    //for list of orgs
    const org=await Org.find({})
    let list=[]
    org.forEach((x)=>{
        ({_id,name}=x)
        list.push({_id,name})
    })

    res.render('userSignup',{list})
}catch(e){
    res.render('userSignup',{list})
}
})

router.post('/register/user',toHome,async (req,res)=>{
    try{
        const user = new User(req.body)
        await user.save()
        res.send('wait for approval')
    }catch(e)
    {
        res.send(e)
    }
})

//LOGIN
router.get('/login/user',toHome,(req,res)=>{
    res.render('login',{uactive:'activee',role:'USER'})
})

router.post('/login/user',toHome,async(req,res)=>{
try{
    ({email,password}=req.body)
    const user=await User.findByCredentials(email,password)
    if(user.access){
        req.session.userID=user._id
        req.session.user_name=user.name
        return res.redirect('/home/user')
    }
    res.send('not permitted.Admin needs to accept you request to join.')
}catch(e){
    res.render('login',{uactive:'activee',role:'USER',error:'Username/Password is wrong.'})
}
})


//############################################################## HOME
router.get('/home/user',toLogin,async (req,res)=>{
try{
    const id=req.session.userID
    const {belongsTo:orgid}=await User.findById(id) 

    const org=await Org.findById(orgid)
    const places=org.places

    const otp=await Otp.findOne({user:id})
    if(otp != null){
        const place=org.places.find(x=>x._id.toString()===otp.place.toString())
        const name=place.name
        const {value:OTP}=otp
        return res.render('userUI',{places,OTP,name})
    }
    res.render('userUI',{places})
    
}catch(e){
    res.send('error')
}
})

router.post('/home/user',toLogin,async(req,res)=>{
    const place= req.body
    const otps=await Otp.find({})
    
    const otpArr=[]
    createArr(otps,otpArr)
    let OTP=genOTP()

    while(otpArr.includes(OTP))
    {
        OTP=genOTP()
    }

    const otp=new Otp({...place,value:OTP,user:req.session.userID})
    await otp.save()
    res.redirect('/home/user')
})


router.get('/places',async(req,res)=>{
try{
const id=req.session.userID
const {belongsTo:orgid}=await User.findById(id)
const org=await Org.findById(orgid)
const places=org.places
res.send(places)
}catch(e)
{
    res.send(e)
}
})

router.get('/inside',async(req,res)=>{
    const id=req.session.userID
    const otp=await Otp.findOne({user:id})
    if(otp !== null)
    {
        return res.send(otp)
    }
    
})

router.delete('/exit',async(req,res)=>{
try{
    console.log('hiiii')
    const deleted=await Otp.findOneAndDelete({user:req.session.userID})
    const updated=await Org.updateOne({'places._id':deleted.place},{$inc:{
        'places.$.count':-1
    }})
    console.log(updated)
    res.send("hi")
}catch(e){
res.send(e)
}
})



module.exports = router  