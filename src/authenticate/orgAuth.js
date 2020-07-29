const toLogin =async(req,res,next)=>{
    if(!req.session.adminID)
    {
        return res.redirect('/login/admin')
    }
    next()
}
const toHome =async(req,res,next)=>{
    if(req.session.adminID)
    {
        return res.redirect(`/home/admin`)
    }    
    if(req.session.userID)
    {
        return res.redirect(`/home/user`)
    }
    next()
}

const denied=async(req,res,next)=>{
    if(!req.session.adminID)
    {
        return res.redirect('/login/scanner')
    }
    next()
}

module.exports={toLogin,toHome,denied}