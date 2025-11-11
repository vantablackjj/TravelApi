import mongoose from "mongoose"

export const connectDB = async()=>{
    try{
        await mongoose.connect(process.env.MOGODB_CONNECTIONSTRING)
        console.log("success")
    }catch(error){
        console.log(error)
        process.exit(1)
    }
}