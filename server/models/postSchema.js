const mongoose = require("mongoose")
const {model, Schema} = mongoose


const postSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    text: {
        type: String,
        required: true

    },
    name: {
        type: String,
    },
    likes: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: 'user'
            }
        }
    ],
    comments: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: 'user'
            }, 
            text: {
                type: String,
                required: true
        
            },
            name: {
                type: String,
            },
            date:{
                type: Date,
                default: Date.now
            }
        }
    ] 
   
}, {
    timestamps: true,
})




module.exports = Post = model("post", postSchema)