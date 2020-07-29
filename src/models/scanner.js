const mongoose=require('mongoose')

const scannerSchema= new mongoose.Schema({
    belongsTo:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Org'
    },
    accessCode:{
        type:String,
        required:true,
        trim:true
    },
    scanning:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Org'
    },
    name:{
        type:String,
        required:true
    }

})



const Scanner=mongoose.model('Staff',scannerSchema)

module.exports = Scanner