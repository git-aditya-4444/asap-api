const express = require('express')
const Org=require('../models/org')
const User=require('../models/user')
const Otp=require('../models/otp')
const Scanner=require('../models/scanner')
const {toLogin,toHome,denied}=require('../authenticate/orgAuth')

const router = new express.Router()

//##################################################### ORG related SCANNER part
router.get('/manage/scanner',toLogin,async (req,res)=>{
    try{
        const scannerArr= await Scanner.find({})
        const org=await Org.findById(req.session.adminID)
        const {places}=org
        
        const scanners=await Scanner.find({belongsTo:req.session.adminID})
        res.render('manage_scanner',{places,scanners})
        
    
    }catch(e){
    res.send('bye')
    }
    })

    //ADD SCANNER
    router.post('/manage/scanner',toLogin,async(req,res)=>{
        const input=req.body
        const org=await Org.findById(req.session.adminID)
        const places=org.places
        const place=places.find(x=>x._id.toString()===req.body.scanning)
        console.log(place.name)
        const scanner=new Scanner({...input,belongsTo:req.session.adminID,name:place.name})
        scanner.save()
        res.redirect('/manage/scanner')
    })

    //DELETE SCANNER   
    router.delete('/manage/scanner/:delid',toLogin,async(req,res)=>{
        const deleted=await Scanner.findByIdAndDelete(req.params.delid)
        res.send('ok')
    })


    router.get('/login/scanner',async(req,res)=>{
    const org=await Org.find({})
    console.log(org)
    const org_list=[]
    org.forEach(x=>{
        ({_id,name}=x)
        org_list.push({_id,name})
    })
    res.render('scanner_login',{org_list})
})

router.post('/login/scanner',async(req,res)=>{
try{
    const there=await Scanner.findOne(req.body)
    if(there){
        req.session.adminID=there.belongsTo
        req.session.scanning=there.scanning
        return res.redirect('/scanner')
    }
    throw new Error("Invalid credentials")
}catch(e)
{
    const org=await Org.find({})
    const org_list=[]
    org.forEach(x=>{
        ({_id,name}=x)
        org_list.push({_id,name})
    })
    const err=e.toString().split(": ")[1]
    res.render('scanner_login',{err,org_list})
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

router.post('/scanner',denied,async(req,res)=>{
try{
    const there=await Otp.findOne(req.body)
    if(there)
    {
        const updated=await Org.updateOne({'places._id':req.session.scanning},{$inc:{
            'places.$.count':1
        }})

        const activeotp=await Otp.findOneAndUpdate({value:req.body.value},{$set:{active:true}})
        
        const org=await Org.findById(req.session.adminID)
        const place=org.places.find(x=>x._id==req.session.scanning)
        return res.render('scanner',{place,err:"Access Granted",bg:"bg-success"})
    }
    throw new Error()
}catch(e)
{
    const org=await Org.findById(req.session.adminID)
    const place=org.places.find(x=>x._id==req.session.scanning)
    return res.render('scanner',{place,err:"Access Denied",bg:"bg-danger"}) 
}
})


//############################# USER related SCANNING PART


    
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

    

module.exports=router