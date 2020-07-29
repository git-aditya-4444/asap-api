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
    if(req.session.adminID)
    {
        return res.redirect('/home/admin')
    }
    next()
}

const toRoot=async(req,res,next)=>{
    if(!req.session.userID)
    {
        return res.redirect(`/`)
    }
    next()
}


module.exports={
    toLogin,toHome,toRoot
}