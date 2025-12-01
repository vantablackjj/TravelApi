import Location from "../models/Location.js";


export const getLocation = async(req,res)=>{
    try{
        const {name} = req.query

        const touristPlace =await Location.findOne({name})

        if(!touristPlace){
            return res.status(401).json({message:'not found'})
        }
        
        res.status.json(touristPlace)

    }catch(error){
        res.status(500).json({message:error.message})
    }
}