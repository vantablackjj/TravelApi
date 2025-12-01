import mongoose from "mongoose";

const locationSchema = new mongoose.Schema({
    name: {
      type: String,
      unique: true,
      required: true,
    },
    description:{
        type:String,
        require:true,
    },
    history:{
        type:String,
    },
    culture:{
        type :String,
        
    },
    image:{
        type:String,
    }


},
{
    timestamps:true,
}
)

const location = mongoose.model("loactionSchema",locationSchema)
export default location;