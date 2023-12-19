import { model, Schema } from "mongoose";

const userSchema = new Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    password: { 
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now(),
      },
      picture: {
        type: String
      },
      role: {
        type: String
      },
      post: [{type: String}]
})

const User = model("user", userSchema)
export default User