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
        return res.redirect(`/home/admin/${req.session.admin_name}`)
    }
    next()
}

const denied=async(req,res,next)=>{
    if(!req.session.adminID)
    {
        return res.redirect('/login/staff')
    }
    next()
}

module.exports={toLogin,toHome,denied}