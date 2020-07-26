const express = require('express')
const Org=require('../models/org')
const User=require('../models/user')
const Otp=require('../models/otp')
const Staff=require('../models/staff')
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
        res.status(400).send(e)
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

router.get('/manage/requests',toLogin,async(req,res)=>{
    const org=await Org.findById(req.session.adminID)
    await org.populate('users').execPopulate()
    const info=org.users.filter(x=>x.access===false)
    res.render('manage',{info})
    // res.render('manage')
})

router.delete('/manage/requests/:delid',toLogin,async(req,res)=>{
    const user=await User.findByIdAndDelete(req.params.delid)
    res.redirect('/manage/requests')

})

router.patch('/manage/requests/:uid',toLogin,async(req,res)=>{
    const id=req.params.uid 
    console.log('in patch')  
    const user=await User.findByIdAndUpdate(id,{$set:{access:true}})
    user.save()
    res.redirect('/manage/requests')


})

//scanner RELATED------------------------------------------------------------------

router.get('/manage/staff',toLogin,async (req,res)=>{
try{
    const staffArr= await Staff.find({})
    const org=await Org.findById(req.session.adminID)
    const {places}=org
    
    const scanners=await Staff.find({belongsTo:req.session.adminID})
    res.render('manage_staff',{places,scanners})
    

}catch(e){
res.send('bye')
}
})

router.post('/manage/staff',toLogin,async(req,res)=>{
    const input=req.body
    const org=await Org.findById(req.session.adminID)
    const places=org.places
    const place=places.find(x=>x._id.toString()===req.body.scanning)
console.log(place.name)
    const staff=new Staff({...input,belongsTo:req.session.adminID,name:place.name})
    staff.save()
    res.redirect('/manage/staff')
})


router.delete('/manage/staff/:delid',toLogin,async(req,res)=>{
    const deleted=await Staff.findByIdAndDelete(req.params.delid)
    res.redirect('/manage/requests')

})





// login scanner

router.get('/login/staff',async(req,res)=>{
    const org=await Org.find({})
    const org_list=[]
    org.forEach(x=>{
        ({_id,name}=x)
        org_list.push({_id,name})
    })
    res.render('staff_login',{org_list})
})

router.post('/login/staff',async(req,res)=>{
try{
    const there=await Staff.findOne(req.body)
    if(there){
        req.session.adminID=there.belongsTo
        req.session.scanning=there.scanning
        return res.redirect('/scanner')
    }
    res.send('you can do it')
}catch(e)
{
res.send('bye')
}

})

router.get('/scanner',denied,async(req,res)=>{
try{
    const org=await Org.findById(req.session.adminID)
    const place=org.places.find(x=>x._id==req.session.scanning)
    res.render('scanner',{place})
}catch(e){
res.send(e)
}
})

//ajax stuff............
router.post('/scanner',denied,async(req,res)=>{
    const there=await Otp.findOne(req.body)
    if(there)
    {
        const updated=await Org.updateOne({'places._id':req.session.scanning},{$inc:{
            'places.$.count':1
        }})

        const activeotp=await Otp.findOneAndUpdate({value:req.body.value},{$set:{active:true}})
        
        res.send(updated)
    }
})



module.exports=router