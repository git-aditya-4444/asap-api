const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcryptjs')


const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required:true,
        trim:true,
        minlength:6,
        default:"user"
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        validate(value)
        {
            if(!validator.isEmail(value))
            {
                throw new Error('Not a valid email address')
            }
        }
    },
    password:{
        type:String,
        required:true,
        trim:true,
    },
    belongsTo:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Org'
        
    },
    access:{
        type:Boolean,
        default:false
    }
})

userSchema.virtual('otp',{
    ref:'Otp',
    localField:'_id',
    foreignField:'user'
})

userSchema.statics.findByCredentials= async function(email,pass){
    const user = await User.findOne({email})
    
    if(!user)
    {
        throw new Error('Email/password is wrong')
    }
    const isMatch = await bcrypt.compare(pass,user.password)
    if(!isMatch)
    {
        throw new Error('Email/password is wrong')
    }
    return user
}

    userSchema.methods.changePassword=async function(oldpass,newpass){
    const user=this
    const isMatch = await bcrypt.compare(oldpass,user.password)
    if(!isMatch)
    {
        throw new Error('Old password is wrong')
    }
    user.password=newpass
    return user

}

userSchema.pre('save',async function(next){
    const user= this
    if(user.password.includes('password'))
    {
        throw new Error('password is easy to crack')    
    }

    if(user.isModified('password'))
    {
        user.password= await bcrypt.hash(user.password,8)
    }
    next()
})

const User = mongoose.model('User',userSchema)

    module.exports = User