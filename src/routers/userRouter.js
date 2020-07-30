const express = require('express')
const User=require('../models/user')
const Otp=require('../models/otp')
const Org=require('../models/org')
const {toLogin,toHome,toRoot}=require('../authenticate/userAuth')
const {genOTP,createArr} = require('../functions')

const router = new express.Router()


//############################################## register USER
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
        res.render('rootpage',{msg:"please wait for the aproval from the admin"})
    }catch(e)
    {
        if(Object.keys(e.keyPattern).includes('email'))
        {
            const org=await Org.find({})
            let list=[]
            org.forEach((x)=>{
                ({_id,name}=x)
                list.push({_id,name})
            })
            return res.render('userSignup',{list,err:'email ID has already been taken'})
        }
        
        res.render('userSignup')
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
    if(user)
    {
        if(user.access){
            req.session.userID=user._id
            req.session.user_name=user.name
            req.session.belongsTo=user.belongsTo
            return res.redirect('/home/user')
        }
        else{
            throw new Error("Admin did not approve yet")
        }
    }else{
        throw new Error("Invalid User/password")

    }
    
}catch(e){
    res.render('login',{uactive:'activee',role:'USER',error:e.toString().split(": ")[1]})
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
    res.redirect('/')
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

    const otp=new Otp({...place,value:OTP,user:req.session.userID,org:req.session.belongsTo})
    await otp.save()
    res.redirect('/home/user')
})



//################################################### account settings
router.get('/user/account',toLogin,async(req,res)=>{
    res.render('accountsettings')
})

router.post('/user/account',toLogin,async(req,res)=>{
    try{
        if(req.body.new !== req.body.new2)
        {
            throw new Error('passwords did not match')
        }
        const user=await User.findById(req.session.userID)
        await user.changePassword(req.body.old,req.body.new)
        user.save()
        res.render('accountsettings',{okay:"changed successfully"})
    }catch(e){
        res.render('accountsettings',{msg:e.toString().split(": ")[1]})
    }
})


router.delete('/user/account',async(req,res)=>{
    await User.findByIdAndDelete(req.session.userID)
    req.session.destroy( (err) => {
    res.clearCookie('idk')
    res.status(200)
    res.send('ok')
       })
    
})


//active info
router.get('/places/userUI',async(req,res)=>{
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


module.exports = router  