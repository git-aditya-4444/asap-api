const toLogin =async(req,res,next)=>{
    if(!req.session.userID)
    {
        return res.redirect('/login/user')
    }
    next()
}
const toHome =async(req,res,next)=>{
    if(req.session.userID)
    {
        return res.redirect(`/home/user`)
    }
    next()
}


module.exports={
    toLogin,toHome
}