const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

const ROLE = ['ADMIN', 'USER']

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    age:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true

    }, role: {
        type: String,
        enum: ROLE,
        default: 'USER'
    },

},{
    timestamps: true
})


userSchema.pre("save", async function(next) {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)


    if(this.email === process.env.email) return this.role = "ADMIN"

    next()
})


module.exports = User = mongoose.model("user", userSchema)