import mongoose,{Schema,model} from "mongoose";

const userSchema=new Schema({
    name:{
        type:String,
        minlength:3,
        required:true
    },
    username:{
        type:String,
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        minlength:6
    },
    dp:{
        type:String
    },
    bio:{
        type:String
    },
    gender:{
        type:String
    },
    isBlock:{
        type:Boolean,
        default:false
    }
})

const User=model('User',userSchema);
export default User;