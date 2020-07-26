const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcryptjs')

const orgSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    password:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value))
            {
                throw new Error('Invalid email address.')
            }
        }
    },
    places:[{
            name:{
                type:String,
                required:true
            },
            count:{
                type:Number,
                default:0
            }
        }]
})

orgSchema.virtual('users',{
    ref:'User',
    localField:'_id',
    foreignField:'belongsTo'
})

orgSchema.pre('save',async function(next){
    const org= this
    if(org.password.includes('password'))
    {
        throw new Error('password is easy to crack')    
    }

    if(org.isModified('password'))
    {
        org.password= await bcrypt.hash(org.password,8)
    }
    next()
})

orgSchema.statics.findByCredentials= async function(email,pass){
    const org = await Org.findOne({email})
    
    if(!org)
    {
        throw new Error('Email/password is wrong')
    }
    const isMatch = await bcrypt.compare(pass,org.password)
    if(!isMatch)
    {
        throw new Error('Email/password is wrong')
    }
    return org
}


orgSchema.methods.addPlace=async function(x)
{
    const org=this
  
    const place = x
    org.places=org.places.concat(place)
    await org.save()
}


const Org = mongoose.model('Org',orgSchema)

    module.exports = Org