import axios from "axios";


export const sendEmail = async (email) =>{
    try {
        const userEmail = await axios.post("api/send/email",{email})        
        console.log("User Email",userEmail)
        return userEmail
    } catch (error) {
        console.error("SERVICES",error)
        throw error
    }
}


