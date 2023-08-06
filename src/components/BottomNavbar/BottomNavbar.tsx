import React from 'react'
import './BottomNavbar.css'
import { AccountCircle, HomeOutlined, OndemandVideo, Search } from '@mui/icons-material'
import { NavLink, useLocation } from 'react-router-dom'

function BottomNavbar() {

  const menuItem = [
    {
      "id": "1",
      "item" : "Home",
      "icon" : <HomeOutlined fontSize='medium' />,
      "to": "/"
    },
    {
      "id": "2",
      "item" : "Search",
      "icon" : <Search fontSize='medium' />,
      "to": "#"
    },
    {
      "id": "4",
      "item" : "Reels",
      "icon" : <OndemandVideo fontSize='medium' />,
      "to": "#"
    },
    {
      "id": "5",
      "item" : "Messenger",
      "icon" : <i className="fa-brands fa-facebook-messenger fa-xl"></i>,
      "to": "#"
    },
    {
      "id": "8",
      "item" : "Profile",
      "icon" : <AccountCircle fontSize='medium' />,
      "to": "/profile"
    },
  ]

  const routeName = useLocation()

  return (
    <div className='bottomnavbar__container'>
      <div className="bottomnavbar__container__box">
        {menuItem.map((value, key) => {

          const isActiveLink = (routeName.pathname.includes(value.to) && value.to.length > 1) || routeName.pathname === value.to

          return (
            <NavLink key={value.id} className={`bottom__menu__link ${isActiveLink && "activeBottomLink"}`} to={value.to}>
              {value.icon}
            </NavLink>
          )
        })}
      </div>
    </div>
  )
}

export default BottomNavbar