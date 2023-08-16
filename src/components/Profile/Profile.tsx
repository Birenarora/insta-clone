import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import './Profile.css'
import { useStateValue } from '../../hooks/StateProvider'
import axios from 'axios'
import { Link, useParams } from 'react-router-dom'
import { DoneOutlined, ManageAccountsOutlined } from '@mui/icons-material'
import { Alert, Snackbar } from '@mui/material'

type PostsStructure = {
  _id: string,
  title: string,
  body: string,
  photo: string,
  likes: {}[],
  likes_count_visibility: Boolean,
  comments: {
      text: string,
      commentedBy:{
          _id: string,
          name: string,
      },
      updatedAt: string,
      _id: string,
      createdAt: string
  }[],
  commenting_visibility: Boolean,
  postedBy: {
    _id: string,
    name: string,
    email: string,
    profile_pic: string,
    followers: string,
    following: string
  }
}[]

type Comment = {
  text: string;
  commentedBy: {
    _id: string;
    name: string;
  };
  updatedAt: string;
  _id: string;
  createdAt: string;
};

type Post = {
  _id: string;
  title: string;
  body: string;
  photo: string;
  likes: {}[];
  likes_count_visibility: boolean;
  comments: Comment[];
  commenting_visibility: boolean;
  postedBy: {
    _id: string;
    name: string;
    email: string;
    profile_pic: string;
    followers: string;
    following: string;
  };
};

type UserPostsStructure = {
  user: {
    _id: string;
    name: string;
    email: string;
    profile_pic: string;
    followers: string[];
    following: string[];
  };
  post: Post[];
};

function Profile() {

  const { state, dispatch } = useStateValue()
  const { user_details } = state
  const [myPosts, setMyPosts] = useState<PostsStructure>()
  const [userPosts, setUserPosts] = useState<UserPostsStructure>({
    user: {
      _id: '',
      name: '',
      email: '',
      profile_pic: '',
      followers: [],
      following: [],
    },
    post: []
  })
  const routeParams = useParams()
  const [defaultProfilePath, setDefaultProfilePath] = useState(true)
  const loggedInUserData = JSON.parse(localStorage.getItem('user-details') || '{}')
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [imageFile, setImageFile] = useState("")
  const [formImageFile, setFormImageFile] = useState<Blob | string>('')
  const [profileUpdateState, setProfileUpdateState] = useState(false)
  const [alertMessage, setAlertMessage] = useState({value: false, type: '', message: ''})

  useEffect(() => {

    if (Object.keys(routeParams).length === 0) {
      setDefaultProfilePath(true)
      axios.get('/myposts', {
        headers: {
          'Authorization': 'Bearer ' + loggedInUserData.token
        }
      }).then((res) => {      
        setMyPosts(res.data.response)
      }).catch((e) => {
        console.log(e.message);
        
      })
    } else {      
      let userId = routeParams.userId
      setDefaultProfilePath(false)
      axios.get(`/user/${userId}`, {
        headers: {
          'Authorization': 'Bearer ' + loggedInUserData.token
        }
      }).then((res) => {      
        setUserPosts(res.data.response)
      }).catch((e) => {
        console.log(e.message);
        
      })
    }
    
  }, [userPosts])  

  const handleFollow = (followId: string | undefined) => {
    axios.put('/follow', {
      userId: followId
    }, {
      headers: {
        'Authorization': 'Bearer ' + loggedInUserData.token
      }
    }).then((res) => {
      // setUserPosts((prev) => ({...prev, user: {...prev.user, followers: [...prev.user.followers, res.data._id]}}))
      setUserPosts((prev) => ({...prev, user: res.data.response}))
      localStorage.setItem('user-details', JSON.stringify({...user_details, user: res.data.response}))
    }).catch((e) => {
      console.log(e.message);
    })
  } 
  
  const handleUnfollow = (unfollowId: string | undefined) => {
    axios.put('/unfollow', {
      userId: unfollowId
    }, {
      headers: {
        'Authorization': 'Bearer ' + loggedInUserData.token
      }
    }).then((res) => {
      // setUserPosts((prev) => ({...prev, user: {...prev.user, followers: [...prev.user.followers, res.data._id]}}))
      setUserPosts((prev) => ({...prev, user: res.data.response}))
      localStorage.setItem('user-details', JSON.stringify({...user_details, user: res.data.response}))
    }).catch((e) => {
      console.log(e.message);
    })
  } 

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageFile(URL.createObjectURL(e.target.files[0]))
      setFormImageFile(e.target.files[0])       
    }
  }

  const handleProfileImageUpload = () => {
    const formDataLib = new FormData()
    formDataLib.append('file', formImageFile)
    formDataLib.append('upload_preset','insta_clone')
    const config = {
        headers: { "X-Requested-With": "XMLHttpRequest" },
      };

    axios.post('https://api.cloudinary.com/v1_1/dusrilpky/image/upload', formDataLib, config)
    .then((res) => {
        if (res.data) {
            axios.put('/upload-profile-pic', {
                profilePic: res.data.url
            }, {
                headers: {
                    'Authorization': 'Bearer ' + loggedInUserData.token
                }
            }).then((res1) => {
                // console.log(res1.data);
                setAlertMessage({value: true, type: 'pass', message: res1.data.message})

                localStorage.setItem('user-details', JSON.stringify({...user_details, user: {...user_details.user, profile_pic: res1.data.response.profile_pic }}))
                // setUserPosts((prev) => ({...prev, user: {...prev.user, profile_pic: res1.data.response.profile_pic}}))
                setTimeout(() => {
                  setImageFile('')
                  setFormImageFile('')
                  setProfileUpdateState(false)
                  window.location.reload()
                }, 1000);
                
            }).catch((e1) => {
                console.log(e1.message);
                // setAlertMessage({value: true, type: 'fail', message: e1.response.data.message})
            })
        }
    }).catch((e) => {
        console.log(e.message);
        setAlertMessage({value: true, type: 'fail', message: e.response.data.error.message})
    })
  }

  return (
    <div className="profile__container">
      {alertMessage.value && 
        <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }} key={'top' + 'vertical'} open={alertMessage.value} autoHideDuration={6000} onClose={() => setAlertMessage({value: false, type: '', message: ''})}>
            <Alert onClose={() => setAlertMessage({value: false, type: '', message: ''})} severity={alertMessage.type === 'pass' ? 'success' : 'error'} sx={{ width: '100%' }}>
            {alertMessage.message}
            </Alert>
        </Snackbar>
        }
      <div className="profile__container__box">
        <div className="profile__container__box__header">
          <div className="profile__container__box__left">
            {imageFile === '' ?
            <img src={defaultProfilePath ? user_details?.user?.profile_pic : userPosts?.user.profile_pic} alt="profile.png" />
            :
            <img src={imageFile} alt="img.png" />
            }
            {profileUpdateState && 
            <div onClick={() => fileInputRef.current?.click()}>
              <button className='profile__container__box__left__uploadbtn'>Upload</button>
              <input type="file" accept='image/*' ref={fileInputRef} hidden onChange={handleFileChange} />
            </div>
            }
          </div>
          <div className="profile__container__box__right">
            <div className="profile__container__box__right__heading">
              <h4>{defaultProfilePath ? user_details?.user?.name : userPosts?.user.name}</h4>
              <div className="profile__container__box__right__heading__actions">
                {defaultProfilePath && (profileUpdateState ?
                <button className='profile__container__box__right__heading__actions__editbtn' onClick={handleProfileImageUpload}>Update Profile</button>
                :
                <button className='profile__container__box__right__heading__actions__editbtn' onClick={() => setProfileUpdateState(!profileUpdateState)}>Edit Profile</button> 
                )}
                {!defaultProfilePath && (userPosts?.user.followers.includes(user_details.user._id) ? 
                <button className='profile__container__box__right__heading__actions__unfollowbtn' onClick={() => handleUnfollow(userPosts?.user._id)}>Unfollow</button>
                :
                <button className='profile__container__box__right__heading__actions__followbtn' onClick={() => handleFollow(userPosts?.user._id)}>Follow</button>
                )}
                </div>
              {/* {value.postedBy._id === userData.user._id ? 
              <div className='home__container__box__card__header__left__username__box__section4__edit'>
                <ManageAccountsOutlined fontSize='small' />
                <button>Edit Profile</button>
              </div>
              :
              value.postedBy.followers.includes(userData.user._id) ?
              <div className='home__container__box__card__header__left__username__box__section4__following'>
                <DoneOutlined fontSize='small' />
                <button>Unfollow</button>
              </div> 
              :
              <div className='home__container__box__card__header__left__username__box__section4__follow'>
                <PersonAddOutlined fontSize='small' />
                <button>Follow</button>
              </div>
              } */}
            </div>
            {!defaultProfilePath && <Link to={'mailto:'+userPosts?.user.email} style={{ textDecoration: 'none' }}><span style={{ color: 'darkgray', fontStyle: 'italic' }}>{userPosts?.user.email}</span></Link>}
            <div className="profile__container__box__right__details">
              <span><strong>{defaultProfilePath ? myPosts?.length : userPosts?.post.length}</strong> posts</span>
              <span><strong>{defaultProfilePath ? user_details?.user?.followers.length : userPosts?.user.followers.length}</strong> followers</span>
              <span><strong>{defaultProfilePath ? user_details?.user?.following.length : userPosts?.user.following.length}</strong> following</span>
            </div>
            <span>Category - Lorem Ipson</span>
            <span>Description - Lorem Ipson</span>
          </div>
        </div>
        <div className="profile__container__box__right__details__mobview">
          <div className="profile__container__box__right__details__subbox__mobview">
            <span><strong>{defaultProfilePath ? myPosts?.length : userPosts?.post.length}</strong></span>
            <span>posts</span>
          </div>
          <div className="profile__container__box__right__details__subbox__mobview">
            <span><strong>{defaultProfilePath ? user_details?.user?.followers.length : userPosts?.user.followers.length}</strong></span>
            <span>followers</span>
          </div>
          <div className="profile__container__box__right__details__subbox__mobview">
            <span><strong>{defaultProfilePath ? user_details?.user?.following.length : userPosts?.user.following.length}</strong></span>
            <span>following</span>
          </div>
        </div>
        <div className="profile__container__box__body">
          {defaultProfilePath ? 
          myPosts?.map((value, key) => {
            return (
              <img key={key} src={value.photo} alt="profile.png" />
            )
          })
          :
          userPosts?.post.map((value, key) => {
            return (
              <img key={key} src={value.photo} alt="profile.png" />
            )
          })
          }
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