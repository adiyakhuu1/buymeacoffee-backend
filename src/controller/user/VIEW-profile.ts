import { Request, Response } from "express"
import { prisma } from "../.."

export const fetchAllUsersProfile = async(req:Request, res: Response)=>{
    // const {username} = req.params

    try{
const users = await prisma.profile.findMany()
if(users){
    res.json({users})
}else{
    res.json({message: "user not found"})
}
    }catch(e){
        console.error(e, "aldaa")
    }
}