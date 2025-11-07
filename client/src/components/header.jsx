import React from 'react'

function Header({links}) {
  return (
    <header className='center w-full h-[8vh]'>
        <div className='center-l h-full w-full'>
            <p className=''>logo</p>
        </div>

        <div className='w-full h-full flex items-center justify-start flex-row-reverse'>
        <nav className='mx-4  h-full w-full flex items-center justify-start flex-row-reverse'>   

            {links}
          
        </nav> 
        
        </div>
     
    </header>
  )
}
export default Header