import React, { ChangeEvent, useState } from 'react'
import './SideNavbar.css'
import { NavLink, useLocation } from 'react-router-dom'
import { AccountCircle, AddCircleOutline, CancelRounded, Explore, HomeOutlined, Notifications, OndemandVideo, Search } from '@mui/icons-material'
import MenuIcon from '@mui/icons-material/Menu';
import { useOutsideClick } from '../../hooks/OutsideClick';

function SideNavbar({ handleCreatePostOpen } : { handleCreatePostOpen: () => void }) {

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
      "id": "3",
      "item" : "Explore",
      "icon" : <Explore fontSize='medium' />,
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
      "id": "6",
      "item" : "Notifications",
      "icon" : <Notifications fontSize='medium' />,
      "to": "#"
    },
    {
      "id": "7",
      "item" : "Create",
      "icon" : <AddCircleOutline fontSize='medium' />,
      "to": "#",
    },
    {
      "id": "8",
      "item" : "Profile",
      "icon" : <AccountCircle fontSize='medium' />,
      "to": "/profile"
    },
  ]

  const [isOpen, setIsOpen] = useState(true)
  const [searchText, setSearchText] = useState('')
  const routeName = useLocation()  

  const divRef = useOutsideClick(() => {
    setIsOpen(true)
  })

  const toggle = () => setIsOpen(!isOpen)

  const handleCloseIcon = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === "") {
      setSearchText('')
    } else {
      setSearchText(e.target.value)
    }
    
  }  

  return (
    <div className='sidebar__container'>
        <div className="sidebar__container__box" style={{ width: isOpen ? "200px" : "80px" }}>
          <div className="sidebar__container__box__header">
            <NavLink to="/">
              <div className="sidebar__container__box__header__icon"  style={{ display: !isOpen ? 'block' : 'none' }}><i className="fa-brands fa-instagram fa-xl"></i></div>
              <div className="sidebar__container__box__header__text" style={{ display: isOpen ? 'block' : 'none' }}>Instagram</div>
            </NavLink>
          </div>
          <div className="sidebar__container__box__body">
          {menuItem.map((value, key) => {

            const isActiveLink = (routeName.pathname.includes(value.to) && value.to.length > 1) || routeName.pathname === value.to

            return (
              <NavLink to={value.to} key={value.id} className={`menu__link ${isActiveLink && "activeNavLink"}`} onClick={value.id === "2" ? toggle : value.id === "7" ? handleCreatePostOpen : () => {return null}}>
                <div className="menu__link__icon">{value.icon}</div>
                <div className="menu__link__text" style={{ display: isOpen ? 'block' : 'none' }}>{value.item}</div>
              </NavLink>
            )
          })}
          </div>
          <div className="sidebar__container__box__footer">
            <NavLink to="#">
              <div className="sidebar__container__box__footer__icon"><MenuIcon fontSize='medium'/></div>
              <div className="sidebar__container__box__footer__text"  style={{ display: isOpen ? 'block' : 'none' }}>More</div>
            </NavLink>
          </div>
        </div>
        {/* <div className="sidebar__container__searchbox" style={{ display: !isOpen ? "flex" : "none" }}> */}
        <div ref={divRef} className="sidebar__container__searchbox" style={{ width: !isOpen ? "300px" : "0", opacity: !isOpen ? "1" : "0" }}>
          <div className="sidebar__container__searchbox__header">
            <h2>Search</h2>
            <div className="sidebar__container__searchbox__header__subbox">
              <input type="text" placeholder='Search...' onChange={handleCloseIcon} />
              <CancelRounded fontSize='small' style={{ display: searchText !== '' ? "block" : "none" }} />
            </div>
          </div>
          <div className="sidebar__container__searchbox__body">
            
          </div>
        </div>
    </div>
  )
}

export default SideNavbar