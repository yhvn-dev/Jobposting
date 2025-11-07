import * as userModels from "../../../models/user/auth/createUserModel"


export async function InsertUser(req,res){
    try {
        const userData = req.body
        const users = await userModels.createUserModel(userData)

        console.log(users)
    } catch (error) {
        res.status(401).json({message:"Error Inserting User"})
    }
}