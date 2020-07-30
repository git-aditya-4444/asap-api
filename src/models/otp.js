const mongoose=require('mongoose')

const otpSchema = new mongoose.Schema({
    value:{
        type:String,
        required:true,
        trim:true
    },
    place:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        trim:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    active:{
        type:Boolean,
        default:false
    },
    createdAt:{ 
        type: Date, 
        expires: 60*5, 
        default: Date.now }
})



otpSchema.pre('save',async function(next){
    const otp=this
    const there=await Otp.findOneAndDelete({user:otp.user})
    next()
})

const Otp = mongoose.model('Otp',otpSchema)

    module.exports = Otp