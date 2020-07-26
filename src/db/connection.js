const mongoose = require('mongoose')

const connURL=process.env.MONGODB_URL

mongoose.connect(connURL,{
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
})
