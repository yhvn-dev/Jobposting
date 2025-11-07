import React, { use, useState } from 'react'
import Header from '../../components/header'
import Modal from "./modal"
import { Link } from 'react-router-dom'
import {User,Signature,Mail,Phone,Lock,LockKeyhole  } from "lucide-react"

function Signup() {
  const [isOpen,setOpen] = useState(false);
  const [formData,setFormData] = useState({
    firstName:"",
    lastName:"",
    email:"",
    mobileNumber:"",
    role:"",
    password:""})

  const [password,setFirstPass] = useState("")
  
  const handleChange = async (e) =>{
    const {name,value} = e.target
    setFormData((prev) =>({
        ...prev,[name]:value
    }))
  }
  
//   const handleFirstPass = async (e) =>{
//     const {value} = e.target;
//     setFirstPass((prev) => ({
//         ...prev,value
//     }))
//   }

  const handleSubmit = async (e) =>{
    e.preventDefault()
    try {
        setOpen(true)      
        console.log("MODAL STATE",isOpen)  
    } catch (error) {
        console.error("Error Sigining Up",error)
    }
  }

  console.log(formData)

  return (
    <section className='relative column-t h-[100vh] w-full bg-[var(--main-white)]'>

        <Header
          links={<>
            <Link  to="/login" className='mx-4  rounded-xl border-1 px-4 py-1 border-[var(--metal-dark4)]'>Login</Link>  
            <Link to='/' className='mx-4  rounded-xl border-1 border-[var(--metal-dark4)] px-4 py-1 '>Home</Link>  
          </>}
        />

        <main className="center h-full w-full  ">
             
             <form action="" onSubmit={handleSubmit} className='flex items-center justify-evenly flex-col h-[90%] w-[90%] shadow-lg
             md:w-[50%] lg:w-[40%]'>
                    <div className='w-full center w-[80%]'>
                        <legend className="fieldset-legend text-3xl font-semibold text-[var(--metal-dark2)]">Signup</legend>
                    </div>
      
                    <div className='center w-[80%]'>  

                        <div className='input-box column relative w-full mr-2'>
                            <input onChange={handleChange} value={formData.firstName} type="text" name="firstName" className="input w-full px-4 py-1 border-1 border-[var(--metal-dark4)] rounded-lg" placeholder="" />
                            <label className="pointer-events-none bg-[var(--main-white)] px-4 left-4  absolute text-sm text-[var(--metal-dark4)]">Firstname</label> 
                            <User className='absolute right-4 stroke-[var(--metal-dark2)]' size={18}/>
                        </div>

                        <div className='input-box column relative  w-full ml-2'>
                            <input onChange={handleChange} value={formData.lastName}  type="text" name="lastName" className="input w-full px-4 py-1 border-1 border-[var(--metal-dark4)] rounded-lg" placeholder="" />
                            <label className="pointer-events-none bg-[var(--main-white)] px-4 left-4 absolute text-sm text-[var(--metal-dark4)]">Lastname</label> 
                             <Signature className='absolute right-4 stroke-[var(--metal-dark2)]' size={18}/>
                        </div>         
                        
                    </div>
                    
                    <div className='input-box relative column  w-[80%]'>
                        <input onChange={handleChange} value={formData.email}   type="text" name="email" className="input input w-full px-4 py-1 border-1 border-[var(--metal-dark4)] rounded-lg" placeholder="" />
                        <label className="pointer-events-none bg-[var(--main-white)] px-4 left-4 absolute text-sm text-[var(--metal-dark4)]">Email</label> 
                        <Mail className='absolute right-4 stroke-[var(--metal-dark2)]' size={18}/>
                        
                    </div>

                    <div className='input-box relative column  w-[80%]'>
 
                        <input onChange={handleChange} value={formData.mobileNumber} type="text" name="mobileNumber"  className="input w-full px-4 py-1 border-1 border-[var(--metal-dark4)] rounded-lg" placeholder="" />
                        <label className="pointer-events-none bg-[var(--main-white)] px-4 left-4 absolute text-sm text-[var(--metal-dark4)]">Mobile Number</label>
                        <Phone className='absolute right-4 stroke-[var(--metal-dark2)]' size={18}/> 
                    </div>
                    
                    <div className='relative column-t w-[80%]'>
                        <label className="text-[var(--metal-dark2)] text-md">Title</label> 
                        <select onChange={handleChange} value={formData.role}  name="role" id="" className='border-1 border-[var(--metal-dark4)] px-4 py-1 rounded-lg text-sm my-2'>
                            <option value="">Role</option>
                            <option value="Applicant">Applicant</option>
                            <option value="Employer">Employer</option>
                        </select> 
                    </div>

                    
                     <div className='input-box relative column w-[80%]'>   
                        <input  name="firstpassword" type="text" className="input w-full px-4 py-1 border-1 border-[var(--metal-dark4)] rounded-lg" placeholder="" />
                        <label className="pointer-events-none bg-[var(--main-white)] px-4 left-4 absolute text-sm text-[var(--metal-dark4)]">
                           Password
                        </label> 
                        <Lock className='absolute right-4 stroke-[var(--metal-dark2)]'  size={18}/>
                     </div>

                    <div className='input-box relative column w-[80%]'> 
                        <input onChange={handleChange} value={formData.password}  name="password" type="text" className="input w-full px-4 py-1 border-1 border-[var(--metal-dark4)] rounded-lg" placeholder="" />
                        <label className="pointer-events-none bg-[var(--main-white)] px-4 left-4 absolute text-sm text-[var(--metal-dark4)]">
                            Confirm Password
                        </label> 
                        <LockKeyhole className='absolute right-4 stroke-[var(--metal-dark2)]' size={18}/>
                     </div>
                
                    <div className='center w-[80%]'>
                        <button type='submit' className="bg-[var(--white-blple)] w-full rounded-xl px-4 py-1 shadow-lg cursor-pointer">Sign Up</button>
                    </div>

        
             </form>

        </main>

        {isOpen && <Modal isOpen={setOpen} formData={formData}/>}

    </section>
  )
}

export default Signup