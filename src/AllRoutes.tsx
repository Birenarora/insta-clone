import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home/Home';
import Signin from './components/Signin/Signin';
import Signup from './components/Signup/Signup';
import Profile from './components/Profile/Profile';
import SideNavbar from './components/SideNavbar/SideNavbar';
import BaseLayout from './layouts/BaseLayout';

function AllRoutes() {

    const [isLoggedIn, setIsLoggedIn] = useState(true)

  return (
    <div>
        <Routes>
            <Route path='/' element={
                isLoggedIn ? <BaseLayout children={<Home />} /> : <Signin />
            } />
            <Route path='/signup' element={<Signup />} />
            <Route path='/profile' element={<BaseLayout children={<Profile />} />} />
        </Routes>
    </div>
  )
}

export default AllRoutes