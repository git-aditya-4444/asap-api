//importing packages
const express= require('express')
require('./db/connection')
const hbs=require('hbs')
const path=require('path')
const session=require('express-session')
const userrouter=require('./routers/userRouter')
const orgrouter=require('./routers/orgRouter')
const scanrouter=require('./routers/scannerRouter')
const Otp=require('../src/models/otp')

//initializing application
const app=express()
//setting up view framework
app.set('view engine','hbs')
//setting up port number[optional]
const port= process.env.PORT
//path for all the static files present default folder name is public
const publicpath= path.join(__dirname,'../public')

app.use(session({
    name:'idk',
    resave:false,
    saveUninitialized:false,
    secret:process.env.SECRET,
    cookie:{
        maxAge:1000*60*20,
        sameSite:true,
        secure:false,
    }
}))
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(express.static(publicpath))
app.use(userrouter)
app.use(scanrouter)
app.use(orgrouter)



app.get("/",(req,res)=>{
    res.render('rootpage')
})

app.get('/logout',(req,res)=>{
    req.session.destroy(err=>{
        if(err){
            return res.redirect('/home')
        }
        res.clearCookie('idk')
        res.redirect('/')
    })
})





//listening on port...
app.listen(port,()=>{
    console.log('server is up on port'+port)
})

