import React, { ChangeEvent, useState } from 'react'
import './SearchUser.css'
import { useStateValue } from '../../hooks/StateProvider'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { CancelRounded, DoneOutlined } from '@mui/icons-material'

type SearchUsers = {
    _id: string,
    name: string,
    email: string,
    profile_pic: string,
    followers: string[]
  }[]

function SearchUser() {

    const [searchedUsers, setSearchedUsers] = useState<SearchUsers>([])
    const { state, dispatch } = useStateValue()
    const { user_details } = state
    const loggedInUserData = JSON.parse(localStorage.getItem('user-details') || '{}')
    const [searchText, setSearchText] = useState('')
    const navigate = useNavigate()

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

    const goToProfile = (userId: string) => {
        if (loggedInUserData.user._id === userId) {
            navigate('/profile')
        } else {
            navigate(`/profile/${userId}`)
        }
        setSearchText('')
    }

  return (
    <div className="searchuser__container__searchbox">
          <div className="searchuser__container__searchbox__header">
            <h2>Search</h2>
            <div className="searchuser__container__searchbox__header__subbox">
              <input type="text" placeholder='Search...' onChange={handleCloseIcon} value={searchText} />
              <span onClick={() => setSearchText('')} style={{ display: searchText !== '' ? "block" : "none", cursor: 'pointer' }}><CancelRounded fontSize='small' /></span>
            </div>
          </div>
          <div className="searchuser__container__searchbox__body">
            {Object.keys(searchedUsers).length !== 0 && searchedUsers?.map((value, key) => {
              return (searchText !== '' &&
              <div key={key} className="searchuser__container__searchbox__body__content" onClick={() => goToProfile(value._id)}>
                <div className="searchuser__container__searchbox__body__content__profilepic">
                  <img src={value.profile_pic} alt="profile.png" />
                </div>
                <div className="searchuser__container__searchbox__body__content__details">
                  <span>{value.name}</span>
                  <span>{value.email}</span>
                </div>
                {value.followers.includes(user_details.user._id) && <DoneOutlined />}
              </div>
              )
            })}
            {/* <div className="searchuser__container__searchbox__body__content">
              <div className="searchuser__container__searchbox__body__content__profilepic">
                <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80" alt="profile.png" />
              </div>
              <div className="searchuser__container__searchbox__body__content__details">
                <span>Test</span>
                <span>test@test.in</span>
              </div>
              <DoneOutlined />
            </div> */}
          </div>
        </div>
  )
}

export default SearchUser