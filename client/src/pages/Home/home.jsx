import React from 'react'
import Header from "../../components/header"
import { Link } from 'react-router-dom'


function Home() {
  return (
    <section className='column-t h-[100vh] w-full bg-[var(--main-white)]'>

        <Header
          links={<>
            <Link  to="/signup" className='mx-4  rounded-xl border-1 px-4 py-1 border-white shadow-lg
                      bg-[var(--white-blple)]'>Signup</Link>  
            <Link to='/login' className='mx-4  rounded-xl border-1 border-[var(--metal-dark4)] px-4 py-1 '>Login</Link>  
          </>}
        />

        <main className="center h-full w-full  ">

          <p className='text-5xl'>HERO</p>

        </main>

    </section>
  )
}

export default Home