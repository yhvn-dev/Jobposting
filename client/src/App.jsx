import { BrowserRouter,Routes,Route } from 'react-router-dom'
import Home from "./pages/Home/home"
import Login from "./pages/Login/login"
import SignUp from "./pages/SignUp/signup"
import Feed from "./pages/Feed/feed"

import './index.css'

function App() {

  return (
    <>

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/signup" element={<SignUp/>}/>
        <Route path='/feed' element={<Feed/>}></Route>
        
      </Routes>
    </BrowserRouter>
        
    </>
  )
}

export default App
