import React, { useEffect, useState } from 'react'
import './Profile.css'
import { useStateValue } from '../../hooks/StateProvider'
import axios from 'axios'

type PostsStructure = {
  _id: string,
  title: string,
  body: string,
  photo: string,
  postedBy: {
    _id: string,
    name: string
  }
}[]

function Profile() {

  const { state, dispatch } = useStateValue()
  const { user_details } = state
  const [myPosts, setMyPosts] = useState<PostsStructure>()

  useEffect(() => {
    axios.get('/myposts', {
      headers: {
        'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('user-details') || '{}').token
      }
    }).then((res) => {
      setMyPosts(res.data.response)
    }).catch((e) => {
      console.log(e.message);
      
    })
  }, [])

  return (
    <div className="profile__container">
      <div className="profile__container__box">
        <div className="profile__container__box__header">
          <div className="profile__container__box__left">
            <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80" alt="profile.png" />
          </div>
          <div className="profile__container__box__right">
            <h4>{user_details?.user?.name}</h4>
            <div className="profile__container__box__right__details">
              <span><strong>40</strong> posts</span>
              <span><strong>40</strong> followers</span>
              <span><strong>40</strong> following</span>
            </div>
            <span>Category - Lorem Ipson</span>
            <span>Description - Lorem Ipson</span>
          </div>
        </div>
        <div className="profile__container__box__right__details__mobview">
          <div className="profile__container__box__right__details__subbox__mobview">
            <span><strong>40</strong></span>
            <span>posts</span>
          </div>
          <div className="profile__container__box__right__details__subbox__mobview">
            <span><strong>40</strong></span>
            <span>followers</span>
          </div>
          <div className="profile__container__box__right__details__subbox__mobview">
            <span><strong>40</strong></span>
            <span>following</span>
          </div>
        </div>
        <div className="profile__container__box__body">
          {myPosts?.map((value, key) => {
            return (
              <img key={key} src={value.photo} alt="profile.png" />
            )
          })}
          {/* <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80" alt="profile.png" />
          <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80" alt="profile.png" />
          <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80" alt="profile.png" />
          <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80" alt="profile.png" />
          <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80" alt="profile.png" />
          <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80" alt="profile.png" />
          <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80" alt="profile.png" />
          <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80" alt="profile.png" />
          <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80" alt="profile.png" />
          <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80" alt="profile.png" /> */}
        </div>
      </div>
    </div>
  )
}

export default Profile