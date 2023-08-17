import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Home from './components/Home/Home';
import Signin from './components/Signin/Signin';
import Signup from './components/Signup/Signup';
import Profile from './components/Profile/Profile';
import SideNavbar from './components/SideNavbar/SideNavbar';
import BaseLayout from './layouts/BaseLayout';
import { useStateValue } from './hooks/StateProvider';
import ResetPassword from './components/ResetPassword/ResetPassword';
import SearchUser from './components/SearchUser/SearchUser';
import { useWindowWide } from './hooks/windowWide';

function AllRoutes() {

    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const { state, dispatch } = useStateValue()
    const { user_details } = state
    const routeLocation = useLocation()
    const navigate = useNavigate()
    const wide = useWindowWide(480) // for mobile view, search component    

    useEffect(() => {
      let userData = JSON.parse(localStorage.getItem('user-details') || '{}')
      
      if (Object.keys(user_details).length !== 0 || Object.keys(userData).length !== 0) {
        setIsLoggedIn(true)

        dispatch({
          type: 'SET_USER',
          payload: userData
        })

        // if (routeLocation.pathname.indexOf('signup')) {
        //   navigate('/')
        // }
      } else {
        setIsLoggedIn(false)

        // if (routeLocation.pathname.indexOf('profile')) {
        //   window.location.href = '/'
        // }
      }
      
      if (wide && routeLocation.pathname.includes('search')) {
        navigate('/')
      }

    }, [wide])

  return (
    <div>
        <Routes>
            <Route path='/' element={
                isLoggedIn ? <BaseLayout children={<Home />} /> : <Signin />
            } />
            <Route path='/signup' element={<Signup />} />
            <Route path='/profile' element={<BaseLayout children={<Profile />} />} />
            <Route path='/profile/:userId' element={<BaseLayout children={<Profile />} />} />
            <Route path='/reset' element={<ResetPassword />} />
            <Route path='/reset/:token' element={<ResetPassword />} />
            <Route path={'/search'} element={<BaseLayout children={<SearchUser />} />} />
        </Routes>
    </div>
  )
}

export default AllRoutes