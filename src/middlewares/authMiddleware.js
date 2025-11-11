import jwt from "jsonwebtoken";
import User from '../models/User.js'

export const protectRoute =async (req,res,next)=>{
    try{
        // Retrieving token from hearder

            const authHeader = req.header["authorization"]
            const token = authHeader && authHeader.split(" ")[1]// Beaer

            if(!token){
                return res.status(401).json({message:"can not found access token"})

            }

            // Confirming valid token 

            jwt.verify(token, process.env.ACCESS_TOKEN_SECRET,async(err,decodeUser)=>{

                if(err){
                    console.log(err)
                    return res.status(403).json({message:"Access token invalid"})
                }


            })
        
        // Finding user

        const user = await User.findById(decodeUser.userId).select('-hashPassword')

            if(!user){
                return res.status(404).json({message:'available'})
            }
            req.user= user 
            next();
    }catch(error){
        res.status(500).json({message:error.message})
    }
}