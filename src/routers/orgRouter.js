const express = require('express')
const Org=require('../models/org')
const User=require('../models/user')
const Otp=require('../models/otp')
const Staff=require('../models/scanner')
const {toLogin,toHome,denied}=require('../authenticate/orgAuth')

const router = new express.Router()


//REGISTER-------------------------------------
router.post('/register/admin',toHome,async (req,res)=>{
    const org = new Org(req.body)
    try{
        await org.save()
        req.session.adminID=org._id
        req.session.admin_name=org.name
        res.status(200).redirect('/home/admin')
    }catch(e)
    {
        if(Object.keys(e.keyPattern).includes('email'))
        {
            return res.render('adminSignup',{err:'email ID has already been taken'})
        }
        
        res.render('adminSignup')
    }

})

router.get('/register/admin',toHome,(req,res)=>{
    res.render('adminSignup')
})

//LOGIN--------------------------------------------------------------
router.get('/login/admin',toHome,(req,res)=>{
    res.render('login',{aactive:'activee',role:'ADMIN'})
})

router.post('/login/admin',toHome,async (req,res)=>{
    try{
        ({email,password}=req.body)
        const org=await Org.findByCredentials(email,password)
        req.session.adminID=org._id
        req.session.admin_name=org.name
        //res.send({org,token})
        res.redirect(`/home/admin`)
    }catch(e)
    {
        res.render('login',{aactive:'activee',role:'ADMIN',error:'Username/Password is wrong.'})
    }
})


//ADMIN HOME PAGE 
router.get('/home/admin',toLogin,async (req,res)=>{
    const name=req.session.admin_name
    const org=await Org.findOne({name})
    const places=org.places
    res.render('adminUI',{places})
})

router.post('/home/admin',toLogin,async (req,res)=>{
    const name=req.session.admin_name
    try{
        const org=await Org.findOne({name})
        await org.addPlace(req.body)
        res.redirect(`/home/admin`)
    }catch(e){
        res.status(500).send(e)
    }
})

//################################## USER requests
router.get('/manage/requests',toLogin,async(req,res)=>{
    const org=await Org.findById(req.session.adminID)
    await org.populate('users').execPopulate()
    const info=org.users.filter(x=>x.access===false)
    res.render('manage',{info})
})

router.delete('/manage/requests/:delid',toLogin,async(req,res)=>{
    const user=await User.findByIdAndDelete(req.params.delid)
    res.send("ok")

})

router.patch('/manage/requests/:uid',toLogin,async(req,res)=>{
try{
    const id=req.params.uid 
    const user=await User.findByIdAndUpdate(id,{$set:{access:true}})
    user.save()
    const org=await Org.findById(req.session.adminID)
    res.send("ok")
}catch(e){
    res.send(e)
}
})

router.get('/manage/places',toLogin,async(req,res)=>{
    const org=await Org.findById(req.session.adminID)
    const places=org.places
    res.render('manage_places',{places})
})
//###################### manage places
router.patch('/manage/places/:resid',toLogin,async(req,res)=>{
    const updated=await Org.updateOne({'places._id':req.params.resid},{$set:{
        'places.$.count':0
    }})
    console.log(updated)
    res.send(updated)
})

router.delete('/manage/places/:delid',toLogin,async(req,res)=>{
    const deleted=await Org.updateOne({'places._id':req.params.delid},{$pull:{
        'places':{"_id":req.params.delid}
    }})
    console.log(deleted)
    res.send(deleted)
})

//######################### account settings
router.get('/admin/account',toLogin,(req,res)=>{

    res.render('admin-account')

})

router.post('/admin/account',toLogin,async(req,res)=>{
    try{
        if(req.body.new !== req.body.new2)
        {
            throw new Error('passwords did not match')
        }
        const org=await Org.findById(req.session.adminID)
        await org.changePassword(req.body.old,req.body.new)
        org.save()
        res.render('accountsettings',{okay:"changed successfully"})
    }catch(e){
        console.log()
        res.render('accountsettings',{msg:e.toString().split(": ")[1]})
    }
})



//active info
router.get('/places/adminUI',async(req,res)=>{
    try{
    const id=req.session.adminID
    const org=await Org.findById(id)
    const places=org.places
    res.send(places)
    }catch(e)
    {
        res.send(e)
    }
    })



module.exports=router