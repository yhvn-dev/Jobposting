
import {X} from "lucide-react"
import {useState,useEffect} from "react"
import * as userService from "../../services/userServices"


function Modal({isOpen,formData}) {
  const [email,setEmail] = useState("")

  const handleClose = () =>{
    isOpen(false)
  }

  useEffect(() =>{
    setEmail(formData.email)
    console.log("FORM DATA EMAIL",formData.email)
  },[])

  const handleVerify = async (e) =>{
    e.preventDefault()
    try{
        await userService.sendEmail(email)
    }catch(error){
      console.eror("Error Verifying User")
    }
  }

  if(!isOpen) return null;
  return (
    <>
        <div className='center w-screen h-screen absolute top-0 left-0 bg-transparent backdrop-blur-2xl'>
     
            <form  className="column-t bg-[var(--white-bple)] p-4 h-[80%] w-[90%] rounded-2xl shadow-lg">
                <div className="w-full center-r">
                    <button onClick={handleClose} className="rounde-xl px-4 py-2 cursor-pointer rounded-xl shadow-lg hover:shadow-[5px_5px_10px_1px_rgba(53,53,53,0.2)]"><X/></button>
                </div>
                
                <div className="column-t my-4">
                    <span className="text-2xl">OTP Verification</span>
                    <p className="text-sm">Enter the OTP We send to your email</p>
                </div>
                
                <div className="column-t bg-[var(--gainsbro)] rounded-lg p-4 w-full m-y">                
                    <label htmlFor="" className="my-4">Input Your OTP</label> 
                    <div className="full center">
                        <input type="" className="w-full px-4 py-1 border-1 border-[var(--metal-dark4)]  rounded-lg " placeholder="xxxx"/> 
                        <button className="w-[20%]">Send</button>               
                    </div>           
                </div>

                <button onClick={handleVerify} className="my-8 center w-full bg-[var(--purpluish)] rounded-lg py-2 px-4 cursor-pointer shadow-lg text-lg text-[var(--main-white)] hover:shadow-[5px_5px_10px_1px_rgba(53,53,53,0.2)]">
                    Verify
                </button>

                <div>

                </div>
            </form>

        </div>
    </>
  )
}

export default Modal