import React, { ChangeEvent, useState } from 'react'
import './SideNavbar.css'
import { NavLink, useLocation, useNavigate, useParams } from 'react-router-dom'
import { AccountCircle, AddCircleOutline, CancelRounded, DoneOutlined, Explore, HomeOutlined, LightModeOutlined, Notifications, OndemandVideo, Search, SettingsOutlined } from '@mui/icons-material'
import MenuIcon from '@mui/icons-material/Menu';
import { useOutsideClick } from '../../hooks/OutsideClick';
import { useStateValue } from '../../hooks/StateProvider';
import axios from 'axios';

type SearchUsers = {
  _id: string,
  name: string,
  email: string,
  profile_pic: string,
  followers: string[]
}[]

function SideNavbar({ handleCreatePostOpen, handleIsCommonModalOpen } : { handleCreatePostOpen: () => void, handleIsCommonModalOpen: () => void }) {

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
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false)
  const { state, dispatch } = useStateValue()
  const navigate = useNavigate()
  const routeParams = useParams()
  const [searchedUsers, setSearchedUsers] = useState<SearchUsers>([])
  const { user_details } = state
  const loggedInUserData = JSON.parse(localStorage.getItem('user-details') || '{}')

  const divRef = useOutsideClick(() => {
    setIsOpen(true)
    // setIsMoreMenuOpen(false)
  })

  const toggle = () => setIsOpen(!isOpen)

  const handleCloseIcon = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === "") {
      setSearchText('')
    } else {
      setSearchText(e.target.value)

      axios.get(`/search/${e.target.value}`, {
        headers: {
          'Authorization': 'Bearer ' + loggedInUserData.token
        }
      })
      .then((res) => {
        setSearchedUsers(res.data.response)
      })
      .catch((e) => {
        console.log(e.message);
        
      })
    }
  }    

  const handleLogout = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()

    let userData = JSON.parse(localStorage.getItem('user-details') || '{}')

    // console.log(userData);
    
    if (state.user_details || Object.keys(userData).length !== 0) {
      dispatch({
        type: 'LOGOUT_USER'
      })

      localStorage.setItem('user-details', JSON.stringify({}))
    }

    window.location.href = '/'
  }

  const handleProfileRoute = () => {
    if (Object.keys(routeParams).length !== 0) {
      window.location.href = '/profile'
    }
  }  

  const goToProfile = (userId: string) => {
    if (loggedInUserData.user._id === userId) {
      navigate('/profile')
    } else {
      navigate(`/profile/${userId}`)
    }
    setIsOpen(true)
    setSearchText('')
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
              // <NavLink to={value.to} key={value.id} className={`menu__link ${isActiveLink && "activeNavLink"}`} onClick={value.id === "2" ? toggle : value.id === "7" ? handleCreatePostOpen : value.id === "8" ? handleProfileRoute : () => {return null}}>
              <NavLink to={value.to} key={value.id} className={`menu__link ${isActiveLink && "activeNavLink"}`} onClick={value.id === "2" ? toggle : value.id === "7" ? handleCreatePostOpen : value.id === "8" ? handleProfileRoute : handleIsCommonModalOpen }>
                <div className="menu__link__icon">{value.icon}</div>
                <div className="menu__link__text" style={{ display: isOpen ? 'block' : 'none' }}>{value.item}</div>
              </NavLink>
            )
          })}
          </div>
          <div className="sidebar__container__box__footer">
            <NavLink to="#" className='sidebar__container__box__footer__more' onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}>
              <div className="sidebar__container__box__footer__icon"><MenuIcon fontSize='medium'/></div>
              <div className="sidebar__container__box__footer__text"  style={{ display: isOpen ? 'block' : 'none' }}>More</div>
            </NavLink>
            <div className="sidebar__container__box__footer__more__menu" style={{ display: isMoreMenuOpen ? 'block' : 'none' }}>
                <ul>
                  <li className='more__menu__items'>
                    <NavLink to="#" className='more__menu__link'>
                      <SettingsOutlined />
                      <span>Settings</span>
                    </NavLink>
                  </li>
                  <li className='more__menu__items'>
                    <NavLink to="#" className='more__menu__link'>
                      <LightModeOutlined />
                      <span>Switch Appearances</span>
                    </NavLink>
                  </li>
                  <li className='more__menu__items'>
                    <NavLink to="#" onClick={handleLogout} className='more__menu__link'>
                      <span>Logout</span>
                    </NavLink>
                  </li>
                </ul>
              </div>
          </div>
        </div>
        {/* <div className="sidebar__container__searchbox" style={{ display: !isOpen ? "flex" : "none" }}> */}
        <div ref={divRef} className="sidebar__container__searchbox" style={{ width: !isOpen ? "300px" : "0", opacity: !isOpen ? "1" : "0" }}>
          <div className="sidebar__container__searchbox__header">
            <h2>Search</h2>
            <div className="sidebar__container__searchbox__header__subbox">
              <input type="text" placeholder='Search...' onChange={handleCloseIcon} value={searchText} />
              <span onClick={() => setSearchText('')} style={{ display: searchText !== '' ? "block" : "none", cursor: 'pointer' }}><CancelRounded fontSize='small' /></span>
            </div>
          </div>
          <div className="sidebar__container__searchbox__body">
            {Object.keys(searchedUsers).length !== 0 && searchedUsers?.map((value, key) => {
              return (searchText !== '' &&
              <div key={key} className="sidebar__container__searchbox__body__content" onClick={() => goToProfile(value._id)}>
                <div className="sidebar__container__searchbox__body__content__profilepic">
                  <img src={value.profile_pic} alt="profile.png" />
                </div>
                <div className="sidebar__container__searchbox__body__content__details">
                  <span>{value.name}</span>
                  <span>{value.email}</span>
                </div>
                {value.followers.includes(user_details.user._id) && <DoneOutlined />}
              </div>
              )
            })}
            {/* <div className="sidebar__container__searchbox__body__content">
              <div className="sidebar__container__searchbox__body__content__profilepic">
                <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80" alt="profile.png" />
              </div>
              <div className="sidebar__container__searchbox__body__content__details">
                <span>Test</span>
                <span>test@test.in</span>
              </div>
              <DoneOutlined />
            </div> */}
          </div>
        </div>
    </div>
  )
}

export default SideNavbar