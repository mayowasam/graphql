const mongoose = require("mongoose")

 mongoose.connect(process.env.DB, {
     
 }).then(()  => console.log('mongodb is connected'))
 .catch((err) => console.log(err))



mongoose.connection.on('connected', () => {
    console.log('mongoose is connected');
})

mongoose.connection.on('error', () => {
    console.log('error occured');
})

mongoose.connection.on('disconnected', () => {
    console.log('mongoose is disconnected');
})

process.on('SIGINT', async () => {
    await mongoose.connection.close()
    process.exit(0)
}) 