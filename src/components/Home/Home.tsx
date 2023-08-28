import React, { ChangeEvent, ReactNode, useEffect, useRef, useState } from 'react'
import './Home.css'
import { DoneOutlined, Favorite, FavoriteBorder, ManageAccountsOutlined, ModeCommentOutlined, PersonAddOutlined, Telegram } from '@mui/icons-material'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useOutsideClick } from '../../hooks/OutsideClick'
import moment from 'moment'
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
          profile_pic: string, 
          followers: string[], 
          following: string[]
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
    profile_pic: string;
    followers: string[],
    following: string[]
  },
  createdAt: string,
  updatedAt: string
}[]

type PostsLikeStructure = {
  [post_id: string]: {
    user_id: string,
    like_flag: boolean
  }
}

type PostsCommentsStructure = {
  [post_id: string]: string
}

type UserProfileStructure = {
  [post_id: string]: Boolean
}

type UserPostsStructure = {
  user: {
    _id: string,
    name: string,
    email: string,
    profile_pic: string;
    followers: string[],
    following: string[]
  },
  post: {
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
            profile_pic: string, 
            followers: string[], 
            following: string[]
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
      profile_pic: string;
      followers: string[],
      following: string[]
    },
    createdAt: string,
    updatedAt: string
  }[] 
}

function Home() {

  const navigate = useNavigate()
  const [likeState, setLikeState] = useState<PostsLikeStructure | undefined>()
  const [viewMoreText, setViewMoreText] = useState(false)
  const [postsData, setPostsData] = useState<PostsStructure>([{
    _id: '',
    title: '',
    body: '',
    photo: '',
    likes: [],
    likes_count_visibility: true,
    comments: [],
    commenting_visibility: true,
    postedBy: {
      _id: '',
      name: '',
      email: '',
      profile_pic: '',
      followers: [],
      following: []
    },
    createdAt: '',
    updatedAt: ''
  }])
  const [commentsState, setCommentsState] = useState<PostsCommentsStructure>()
  const [commentsBoxState, setCommentsBoxState] = useState<PostsCommentsStructure>()
  const userData = JSON.parse(localStorage.getItem('user-details') || '{}')
  const [isCommentsOpen, setIsCommentsOpen] = useState(false)
  const [commentsPostId, setCommentsPostId] = useState('')
  const [isPostOptionsOpen, setIsPostOptionsOpen] = useState(false)
  const [postedById, setPostedById] = useState('')
  const [alertMessage, setAlertMessage] = useState({value: false, type: '', message: ''})
  const [likesToggle, setLikesToggle] = useState<Boolean | string>('')
  const [commentingToggle, setCommentingToggle] = useState<Boolean | string>('')
  const [isUserProfileOpen, setIsUserProfileOpen] = useState<ReactNode>('')
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
  const [userProfileFlag, setUserProfileFlag] = useState<UserProfileStructure>({})
  const [loadingUserProfile, setLoadingUserProfile] = useState(false)
  const [postImagePublicId, setPostImagePublicId] = useState('')
  const [postsLoading, setPostsLoading] = useState(true)

  const renderComp = (post_id: string, user_id: string, posts: PostsStructure) => {
    // setLoadingUserProfile(true)
    // let userId = user_id
    // axios.get(`/user-shortdetails/${userId}`, {
    //   headers: {
    //     'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('user-details') || '{}').token
    //   }
    // }).then((res) => {            
    //   setUserPosts(res.data.response)
    //   setLoadingUserProfile(false)
    // }).catch((e) => {
    //   console.log(e.message);
      
    // })    
    return (
      <>
        {Object.values(posts).map((value, key) => {
          let totalPostsCountPerUser = posts.filter((post) => post.postedBy._id === user_id).length
          let postsPerUser = posts.filter((post) => post.postedBy._id === user_id).map((post) => ({photo: post.photo})).splice(0,3)          

          return (value._id === post_id) && (
            <div key={key} className='home__container__box__card__header__left__username__box'>
              <div className="home__container__box__card__header__left__username__box__section1">
                <img className='common__image' style={{ width: '60px', height: '60px' }} src={value.postedBy.profile_pic} alt="profile.png" />
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <Link className='common__username' to={userData.user._id === value.postedBy._id ? '/profile' : `/profile/${value.postedBy._id}`}><span>{value.postedBy.name}</span></Link>
                  <span style={{ color: 'darkgray', fontStyle: 'italic', fontSize: '14px' }}>{value.postedBy.email}</span>
                </div>
              </div>
              <div className="home__container__box__card__header__left__username__box__section2">
                <div className="home__container__box__card__header__left__username__box__section2__subbox">
                  <span><strong>{totalPostsCountPerUser}</strong></span>
                  <span>posts</span>             
                </div>
                <div className="home__container__box__card__header__left__username__box__section2__subbox">
                  <span><strong>{value.postedBy.followers.length}</strong></span>
                  <span>followers</span>
                </div>
                <div className="home__container__box__card__header__left__username__box__section2__subbox">
                  <span><strong>{value.postedBy.following.length}</strong></span>
                  <span>following</span>
                </div>
              </div>
              <div className="home__container__box__card__header__left__username__box__section3">
              {postsPerUser.map((value, key) => {
                return (
                  <img key={key} src={value.photo} alt="img.png" />
                )
              })}
              </div>
              <div className="home__container__box__card__header__left__username__box__section4">
              {value.postedBy._id === userData.user._id ? 
              <div className='home__container__box__card__header__left__username__box__section4__edit'>
                <ManageAccountsOutlined fontSize='small' />
                <button>Edit Profile</button>
              </div>
              :
              value.postedBy.followers.includes(userData.user._id) ?
              <div className='home__container__box__card__header__left__username__box__section4__following'>
                <DoneOutlined fontSize='small' />
                <button onClick={() => handleUnfollow(value.postedBy._id)}>Unfollow</button>
              </div> 
              :
              <div className='home__container__box__card__header__left__username__box__section4__follow'>
                <PersonAddOutlined fontSize='small' />
                <button onClick={() => handleFollow(value._id, value.postedBy._id)}>Follow</button>
              </div>
              }
              </div>
            </div>
          )
        })
        }
      </>
    )
  }

  const handleUserProfileBoxHover = (post_id: string, user_id: string, posts: PostsStructure) => {
    setIsUserProfileOpen(renderComp(post_id, user_id, posts))
    setUserProfileFlag({ [post_id]: true })
  }

  const handleUserProfileBoxLeave = () => {
    setIsUserProfileOpen('')
    setUserProfileFlag({})
  }
  

  useEffect(() => {
    axios.get('/posts', {
      headers: {
        'Authorization': 'Bearer ' + userData.token
      }
    }).then((res) => {
      // console.log(res.data.response);
      
      setPostsData(res.data.response)
      setPostsLoading(false)

    //   res.data.response?.map((value: any, key: any) => {
    //     if (value.likes.length === 0) {
    //       setLikeState((prev) => ({...prev, [value._id]: { user_id: userData.user._id, like_flag: false } }))
    //     } else {
    //       for (const userId in value.likes) {
    //         setLikeState((prev) => ({...prev, [value._id]: true}))
    //       } 
    //     }
    // })
    }).catch((e) => {
      console.log(e.message);
      
    })
  }, [])

  const handleLikesCount = (e: React.MouseEvent) => {
    const post_id = e.currentTarget.id.split('_')[1]

    // for (const likeId in likeState) {
    //   if (likeId === id && likeState[likeId] === false) {
    //     setLikeState((prev) => ({...prev, [likeId]: true}))
    //   } else if (likeId === id && likeState[likeId] === true) {
    //     setLikeState((prev) => ({...prev, [likeId]: false}))
    //   }
    // }
    axios.put('/like', {
      postId: post_id
    }, {
      headers: {
        'Authorization': 'Bearer ' + userData.token
      }
    }).then((res) => {
      const updatedPostsArray = postsData?.map((post, key) => 
        post._id === res.data.response._id ? res.data.response : post
      );
      setPostsData(updatedPostsArray)
    }).catch((e) => {
      console.log(e.message);
    })
  }

  const handleUnLikesCount = (e: React.MouseEvent) => {
    const post_id = e.currentTarget.id.split('_')[1]

    axios.put('/unlike', {
      postId: post_id
    }, {
      headers: {
        'Authorization': 'Bearer ' + userData.token
      }
    }).then((res) => {
      const updatedPostsArray = postsData?.map((post, key) => 
        post._id === res.data.response._id ? res.data.response : post
      );
      setPostsData(updatedPostsArray)
    }).catch((e) => {
      console.log(e.message);
    })
  }

  const handleComments = (e: ChangeEvent<HTMLInputElement>) => {
    setCommentsState((prev) => ({...prev, [e.target.name.split('_')[1]]: e.target.value}))
  }
  
  const handleComments__Box = (e: ChangeEvent<HTMLInputElement>) => {
    setCommentsBoxState((prev) => ({...prev, [e.target.name.split('_')[1]]: e.target.value}))
  }

  const submitComment = (e: React.MouseEvent) => {
    const post_id = e.currentTarget.id.split('_')[2]

    axios.put('/create-comment', {
      text: commentsState?.[post_id],
      postId: post_id
    }, {
      headers: {
        'Authorization': 'Bearer ' + userData.token
      }
    }).then((res) => {
      const updatedPostsArray = postsData?.map((post, key) => 
        post._id === res.data.response._id ? res.data.response : post
      );
      setPostsData(updatedPostsArray)

      setCommentsState((prev) => ({...prev, [post_id]: ''}))
    }).catch((e) => {
      console.log(e.message);
    })
  }

  const submitComment__Box = (e: React.MouseEvent) => {
    const post_id = e.currentTarget.id.split('_')[2]

    axios.put('/create-comment', {
      text: commentsBoxState?.[post_id],
      postId: post_id
    }, {
      headers: {
        'Authorization': 'Bearer ' + userData.token
      }
    }).then((res) => {
      const updatedPostsArray = postsData?.map((post, key) => 
        post._id === res.data.response._id ? res.data.response : post
      );
      setPostsData(updatedPostsArray)

      setCommentsBoxState((prev) => ({...prev, [post_id]: ''}))
    }).catch((e) => {
      console.log(e.message);
    })
  }

  const divRef = useOutsideClick(() => {
    if (!isPostOptionsOpen) {
      setIsCommentsOpen(false)
    }
  })

  const divRef1 = useOutsideClick(() => {
      setIsPostOptionsOpen(false)
  })

  const handleCommentsBox = (e: React.MouseEvent, postId: string) => {
    if (isCommentsOpen) {
      setIsCommentsOpen(false)
      setCommentsPostId('')
    } else {
      setIsCommentsOpen(true)
      setCommentsPostId(postId)
    }
  }

  const handlePostOptionsBox = (postId: string, posted_by_id: string, likes_toggle: Boolean, commenting_toggle: Boolean, postPhoto: string) => {

    const imgPublicId = postPhoto.split('/')[postPhoto.split('/').length - 1].split('.')[0]    

    if (isPostOptionsOpen) {
      setIsPostOptionsOpen(false)
      setCommentsPostId('')
      setPostedById('')
      setLikesToggle('')
      setCommentingToggle('')
      setPostImagePublicId('')
    } else {
      setIsPostOptionsOpen(true)
      setCommentsPostId(postId)
      setPostedById(posted_by_id)
      setLikesToggle(likes_toggle)
      setCommentingToggle(commenting_toggle)
      setPostImagePublicId(imgPublicId)
    }
  }

  const handleDeletePost = (postId: string, imgPublicId:string) => {
    axios.delete(`/delete-post/${postId}`, {
      headers: {
        'Authorization': 'Bearer ' + userData.token
      }
    }).then((res) => {
      const updatedPostsArray = postsData?.filter((post) => { return post._id !== res.data.response._id })
      setPostsData(updatedPostsArray)
      setIsPostOptionsOpen(false)

      setAlertMessage({value: true, type: 'pass', message: res.data.message})

      // window.location.reload()
    }).catch((e) => {
      console.log(e.message);
    })
  }

  const handleLikesVisibilityToggle = (post_id: string, toggle_value: Boolean | string) => {
    axios.put('/likes-count-toggle', {
      postId: post_id,
      value: toggle_value
    }, {
      headers: {
        'Authorization': 'Bearer ' + userData.token
      }
    }).then((res) => {
      const updatedPostsArray = postsData?.map((post, key) => 
        post._id === res.data.response._id ? res.data.response : post
      );
      setPostsData(updatedPostsArray)
      setLikesToggle('')
      setIsPostOptionsOpen(false)
      setAlertMessage({value: true, type: 'pass', message: res.data.message})
    }).catch((e) => {
      console.log(e.message);
    })
  }

  const handleCommentingToggle = (post_id: string, toggle_value: Boolean | string) => {
    axios.put('/commenting-toggle', {
      postId: post_id,
      value: toggle_value
    }, {
      headers: {
        'Authorization': 'Bearer ' + userData.token
      }
    }).then((res) => {
      const updatedPostsArray = postsData?.map((post, key) => 
        post._id === res.data.response._id ? res.data.response : post
      );
      setPostsData(updatedPostsArray)
      setCommentingToggle('')
      setIsPostOptionsOpen(false)
      setAlertMessage({value: true, type: 'pass', message: res.data.message})
    }).catch((e) => {
      console.log(e.message);
    })
  }

  const handleFollow = (postId: string, followId: string | undefined) => {
    axios.put('/follow', {
      userId: followId
    }, {
      headers: {
        'Authorization': 'Bearer ' + userData.token
      }
    }).then((res) => {
      // setUserPosts((prev) => ({...prev, user: {...prev.user, followers: [...prev.user.followers, res.data._id]}}))
      setUserPosts((prev) => ({...prev, user: res.data.response}))
      // const updatedPostsData = [...postsData];
      // const postIndex = updatedPostsData.findIndex(post => post._id === postId);

      // if (postIndex !== -1) {
      //   updatedPostsData[postIndex].postedBy = res.data.response;
      //   setPostsData(updatedPostsData);
      // }
      // showing loggedin users details when applying above logic, need to correct it
      localStorage.setItem('user-details', JSON.stringify({...userData, user: res.data.response}))
      window.location.reload()
    }).catch((e) => {
      console.log(e.message);
    })
  }   
  
  const handleUnfollow = (unfollowId: string | undefined) => {
    axios.put('/unfollow', {
      userId: unfollowId
    }, {
      headers: {
        'Authorization': 'Bearer ' + userData.token
      }
    }).then((res) => {
      // setUserPosts((prev) => ({...prev, user: {...prev.user, followers: [...prev.user.followers, res.data._id]}}))
      setUserPosts((prev) => ({...prev, user: res.data.response}))
      localStorage.setItem('user-details', JSON.stringify({...userData, user: res.data.response}))
      window.location.reload()
    }).catch((e) => {
      console.log(e.message);
    })
  } 

  return (
    <div className='home__container'>
      {alertMessage.value && 
        <Snackbar ref={divRef} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} key={'top' + 'vertical'} open={alertMessage.value} autoHideDuration={6000} onClose={() => setAlertMessage({value: false, type: '', message: ''})}>
            <Alert onClose={() => setAlertMessage({value: false, type: '', message: ''})} severity={alertMessage.type === 'pass' ? 'success' : 'error'} sx={{ width: '100%' }}>
            {alertMessage.message}
            </Alert>
        </Snackbar>
        }
      <div className="home__container__story__caraousel">
        <img src="https://images.unsplash.com/photo-1473830394358-91588751b241?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80" alt="test.png" />
        <img src="https://images.unsplash.com/photo-1473830394358-91588751b241?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80" alt="test.png" />
        <img src="https://images.unsplash.com/photo-1473830394358-91588751b241?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80" alt="test.png" />
        <img src="https://images.unsplash.com/photo-1473830394358-91588751b241?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80" alt="test.png" />
        <img src="https://images.unsplash.com/photo-1473830394358-91588751b241?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80" alt="test.png" />
        <img src="https://images.unsplash.com/photo-1473830394358-91588751b241?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80" alt="test.png" />
        <img src="https://images.unsplash.com/photo-1473830394358-91588751b241?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80" alt="test.png" />
        <img src="https://images.unsplash.com/photo-1473830394358-91588751b241?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80" alt="test.png" />
        <img src="https://images.unsplash.com/photo-1473830394358-91588751b241?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80" alt="test.png" />
        <img src="https://images.unsplash.com/photo-1473830394358-91588751b241?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80" alt="test.png" />
        <img src="https://images.unsplash.com/photo-1473830394358-91588751b241?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80" alt="test.png" />
        <img src="https://images.unsplash.com/photo-1473830394358-91588751b241?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80" alt="test.png" />
      </div>
      <div className="home__container__box">
        {postsLoading ?
        <div className='loader'></div>
        :
        postsData?.map((value, key) => {  
          
          let postedDate = moment(value.createdAt)
          let currentDate = moment(new Date())
          let dateDiffSeconds = currentDate.diff(postedDate, 's')
          let dateDiffMins = currentDate.diff(postedDate, 'm')
          let dateDiffHours = currentDate.diff(postedDate, 'h')
          let dateDiffDays = currentDate.diff(postedDate, 'days')
          let dateDiffMonths = currentDate.diff(postedDate, 'months')
          let dateDiffYears = currentDate.diff(postedDate, 'years')
          let dateShow = null

          if (dateDiffSeconds < 59) {
            dateShow = dateDiffSeconds + ' s'
          } else if (dateDiffMins < 60) {
            dateShow = dateDiffMins + ' m'
          } else if (dateDiffHours < 24) {
            dateShow = dateDiffHours + ' h'
          } else if (dateDiffDays <= 31) {
            dateShow = dateDiffDays + 'd'
          } else if (dateDiffMonths <= 12) {
            dateShow = dateDiffMonths + 'mo'
          } else {
            dateShow = dateDiffYears + 'y'
          }
                 
          return (
            <div className="home__container__box__card" key={value._id}>
              <div className="home__container__box__card__header">
                <div className="home__container__box__card__header__left">
                  <img className='common__image' src={value.postedBy.profile_pic} alt="profile.png" />
                  <div onMouseOver={() => handleUserProfileBoxHover(value._id, value.postedBy._id, postsData)} onMouseLeave={() => handleUserProfileBoxLeave()} className='home__container__box__card__header__left__username'>
                  {/* <div onClick={() => handleUserProfileBoxHover(value._id, value.postedBy._id, postsData)} className='home__container__box__card__header__left__username'> */}
                    <Link className='common__username' to={userData?.user?._id === value.postedBy._id ? '/profile' : `/profile/${value.postedBy._id}`}><span>{value.postedBy.name}</span></Link>
                    {/* <span>{value.postedBy.name}</span> */}
                    {Object.keys(userProfileFlag).some((id) => id === value._id) && isUserProfileOpen}
                  </div>
                  <span></span>
                  <span className='common__time'>{dateShow}</span>
                </div>
                <div onClick={() => handlePostOptionsBox(value._id, value.postedBy._id, value.likes_count_visibility, value.commenting_visibility, value.photo)} className="home__container__box__card__header__right">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
              <div className="home__container__box__card__body">
                <div className="home__container__box__card__body__image">
                  <img src={value.photo} alt="img.png" />
                </div>
                <div className="home__container__box__card__body__icons">
                  {/* <Link to='#' id={'like_'+value._id} onClick={handleLikesCount}>{likeState?.[value._id] ? <Favorite style={{ color: 'red' }} />  : <FavoriteBorder /> }</Link> */}
                  {value.likes.includes(userData?.user?._id) ?
                    <Link to='#' id={'unlike_'+value._id} onClick={handleUnLikesCount}><Favorite style={{ color: 'red' }} /></Link>
                  :
                    <Link to='#' id={'like_'+value._id} onClick={handleLikesCount}><FavoriteBorder /></Link>
                  }
                  {/* <Link to='#' id={'like_'+value._id} onClick={handleLikesCount}>{likeState?.[value._id] ? <Favorite style={{ color: 'red' }} />  : <FavoriteBorder /> }</Link> */}
                  <Link to='#' onClick={() => { setIsCommentsOpen(true); setCommentsPostId(value._id); }}><ModeCommentOutlined /></Link>
                  <Link to='#'><Telegram /></Link>
                </div>
                {value.likes_count_visibility && <span className='post__likes__text'><strong>{value.likes.length}</strong> likes</span>}
                <span className='post__caption__text' style={{ display: viewMoreText ? "block" : "-webkit-box" }}><strong>{value.postedBy.name}</strong> {value.body}</span>
                <span className='post__caption__text__more' onClick={() => setViewMoreText(!viewMoreText)}>{viewMoreText ? "hide" : "more"}</span>
                <span className='post__view__comments__text' onClick={(e) => handleCommentsBox(e, value._id)}>{value.comments.length > 0 ? `View all ${value.comments.length} comments` : `No comments yet!`}</span>
              </div>
              {value.commenting_visibility && <div className="home__container__box__card__footer">
                <form onSubmit={(e) => e.preventDefault()}>
                  <input name={'comments_'+value._id} type="text" className='post__comment__input' placeholder='Add a comment...' onChange={handleComments} value={commentsState?.[value._id] || ''} />
                  {(commentsState !== undefined && commentsState?.[value._id] && commentsState?.[value._id] !== '') && <button id={'comments_button_'+value._id} className='post__comment__button' onClick={submitComment}>Post</button>}
                </form>
              </div>}
            </div>
          )
        })}
        {/* <div className="home__container__box__card">
          <div className="home__container__box__card__header">
            <div className="home__container__box__card__header__left">
              <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80" alt="profile.png" />
              <span>Biren Arora</span>
              <span></span>
              <span>9 h</span>
            </div>
            <div className="home__container__box__card__header__right">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
          <div className="home__container__box__card__body">
            <div className="home__container__box__card__body__image">
              <img src="https://images.unsplash.com/photo-1682687218608-5e2522b04673?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=775&q=80" alt="img.png" />
            </div>
            <div className="home__container__box__card__body__icons">
              <Link to='#' onClick={() => setLikeState(!likeState)}>{likeState ? <Favorite style={{ color: 'red' }} />  : <FavoriteBorder /> }</Link>
              <Link to='#'><ModeCommentOutlined /></Link>
              <Link to='#'><Telegram /></Link>
            </div>
            <span className='post__likes__text'><strong>1000</strong> likes</span>
            <span className='post__caption__text' style={{ display: viewMoreText ? "block" : "-webkit-box" }}><strong>Biren Arora</strong> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex laborum.</span>
            <span className='post__caption__text__more' onClick={() => setViewMoreText(!viewMoreText)}>{viewMoreText ? "hide" : "more"}</span>
            <span className='post__view__comments__text'>View all 20 comments</span>
          </div>
          <div className="home__container__box__card__footer">
            <input type="text" className='post__comment__input' placeholder='Add a comment...' />
          </div>
        </div>
        <div className="home__container__box__card">
          <div className="home__container__box__card__header">
            <div className="home__container__box__card__header__left">
              <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80" alt="profile.png" />
              <span>Biren Arora</span>
              <span></span>
              <span>9 h</span>
            </div>
            <div className="home__container__box__card__header__right">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
          <div className="home__container__box__card__body">
            <div className="home__container__box__card__body__image">
              <img src="https://images.unsplash.com/photo-1682687218608-5e2522b04673?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=775&q=80" alt="img.png" />
            </div>
            <div className="home__container__box__card__body__icons">
              <Link to='#' onClick={() => setLikeState(!likeState)}>{likeState ? <Favorite style={{ color: 'red' }} />  : <FavoriteBorder /> }</Link>
              <Link to='#'><ModeCommentOutlined /></Link>
              <Link to='#'><Telegram /></Link>
            </div>
            <span className='post__likes__text'><strong>1000</strong> likes</span>
            <span className='post__caption__text' style={{ display: viewMoreText ? "block" : "-webkit-box" }}><strong>Biren Arora</strong> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex laborum.</span>
            <span className='post__caption__text__more' onClick={() => setViewMoreText(!viewMoreText)}>{viewMoreText ? "hide" : "more"}</span>
            <span className='post__view__comments__text'>View all 20 comments</span>
          </div>
          <div className="home__container__box__card__footer">
            <input type="text" className='post__comment__input' placeholder='Add a comment...' />
          </div>
        </div> */}
      </div>
      {isCommentsOpen && 
      <div className="comments__container">
        <div ref={divRef} className="comments__container__box">
          {postsData?.map((value, key) => {
            const flag = value._id === commentsPostId

            let postedDate = moment(value.createdAt)
            let currentDate = moment(new Date())
            let dateDiffSeconds = currentDate.diff(postedDate, 's')
            let dateDiffMins = currentDate.diff(postedDate, 'm')
            let dateDiffHours = currentDate.diff(postedDate, 'h')
            let dateDiffDays = currentDate.diff(postedDate, 'days')
            let dateDiffMonths = currentDate.diff(postedDate, 'months')
            let dateDiffYears = currentDate.diff(postedDate, 'years')
            let dateShow = null

            if (dateDiffSeconds < 59) {
              dateShow = dateDiffSeconds + ' s'
            } else if (dateDiffMins < 60) {
              dateShow = dateDiffMins + ' m'
            } else if (dateDiffHours < 24) {
              dateShow = dateDiffHours + ' h'
            } else if (dateDiffDays <= 31) {
              dateShow = dateDiffDays + 'd'
            } else if (dateDiffMonths <= 12) {
              dateShow = dateDiffMonths + 'mo'
            } else {
              dateShow = dateDiffYears + 'y'
            }
            
            return (flag &&
              <div key={key} className="comments__container__box__card">
                <div className="comments__container__box__card__header">
                  <div className="comments__container__box__card__header__left">
                    <img className='common__image' src={value.postedBy.profile_pic} alt="profile.png" />
                    <span>{value.postedBy.name}</span>
                  </div>
                  <div onClick={() => handlePostOptionsBox(value._id, value.postedBy._id, value.likes_count_visibility, value.commenting_visibility, value.photo)} className="comments__container__box__card__header__right">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
                <div className="comments__container__box__card__body">
                  <div className="comments__container__box__card__body__content">
                    <div>
                      <img className='common__image' src={value.postedBy.profile_pic} alt="profile.png" />
                    </div>
                    <div className="comments__container__box__card__body__subcontent">
                      <span className='common__content'><strong>{value.postedBy.name}</strong> {value.body}</span>
                      <span className='common__time'>{dateShow}</span>
                    </div>
                  </div>
                    {value.comments.map((value1, key1) => {

                      let commentedDate = moment(value1.createdAt)
                      let currentDate = moment(new Date())
                      let dateDiffSeconds = currentDate.diff(commentedDate, 's')
                      let dateDiffMins = currentDate.diff(commentedDate, 'm')
                      let dateDiffHours = currentDate.diff(commentedDate, 'h')
                      let dateDiffDays = currentDate.diff(commentedDate, 'days')
                      let dateDiffMonths = currentDate.diff(commentedDate, 'months')
                      let dateDiffYears = currentDate.diff(commentedDate, 'years')
                      let dateShow = null

                      if (dateDiffSeconds < 59) {
                        dateShow = dateDiffSeconds + ' s'
                      } else if (dateDiffMins < 60) {
                        dateShow = dateDiffMins + ' m'
                      } else if (dateDiffHours < 24) {
                        dateShow = dateDiffHours + ' h'
                      } else if (dateDiffDays <= 31) {
                        dateShow = dateDiffDays + 'd'
                      } else if (dateDiffMonths <= 12) {
                        dateShow = dateDiffMonths + 'mo'
                      } else {
                        dateShow = dateDiffYears + 'y'
                      }
                      
                      // console.log(dateDiffSeconds, 's', dateDiffMins, 'm', dateDiffHours, 'h');
                      // console.log(dateShow);
                      // console.log(dateDiffDays, 'd', dateDiffMonths, 'M', dateDiffYears, 'y');                      
                      
                      return (
                        <div key={key1} className='comments__container__box__card__body__content'> 
                          <div>
                            <img className='common__image' src={value1.commentedBy.profile_pic} alt="profile.png" />
                          </div>
                          <div className="comments__container__box__card__body__subcontent">
                            <span className='common__content'><strong>{value1.commentedBy.name}</strong> {value1.text}</span>
                            <span className='common__time'>{dateShow}</span>
                          </div>
                        </div>
                      )
                    })}
                </div>
                {value.commenting_visibility && <div className="comments__container__box__card__footer">
                  <form onSubmit={(e) => e.preventDefault()}>
                    <input name={'commentsbox_'+value._id} type="text" className='post__commentbox__input' placeholder='Add a comment...' onChange={handleComments__Box} value={commentsBoxState?.[value._id] || ''} />
                    {(commentsBoxState !== undefined && commentsBoxState?.[value._id] && commentsBoxState?.[value._id] !== '') && <button id={'commentsbox_button_'+value._id} className='post__commentbox__button' onClick={submitComment__Box}>Post</button>}
                  </form>
                </div>}
              </div>
            )
          })}
        </div>
      </div>
      }
      {isPostOptionsOpen && 
      <div className="postoptions__container">
        <div ref={divRef1} className="postoptions__container__box">
          <ul>
            {userData.user._id === postedById &&
            <>
              <li className='postoptions__menu__items' onClick={() => handleDeletePost(commentsPostId, postImagePublicId)} style={{ color: 'red', fontWeight: '600' }}>Delete</li>
              <li className='postoptions__menu__items'>Edit</li>
              {likesToggle ?
              <li className='postoptions__menu__items' onClick={() => handleLikesVisibilityToggle(commentsPostId, false)}>Hide like count</li>
              :
              <li className='postoptions__menu__items' onClick={() => handleLikesVisibilityToggle(commentsPostId, true)}>Unhide like count</li>
              }
              {commentingToggle ?
              <li className='postoptions__menu__items' onClick={() => handleCommentingToggle(commentsPostId, false)}>Turn off commenting</li>
              :
              <li className='postoptions__menu__items' onClick={() => handleCommentingToggle(commentsPostId, true)}>Turn on commenting</li>
              }
            </>
            }
            <li className='postoptions__menu__items' onClick={() => userData.user._id === postedById ? navigate('/profile') : navigate('/profile/'+postedById)}>Go to post</li>
            <li className='postoptions__menu__items'>Share to...</li>
            <li className='postoptions__menu__items' onClick={() => userData.user._id === postedById ? navigate('/profile') : navigate('/profile/'+postedById)}>About this account</li>
            <li className='postoptions__menu__items' onClick={() => setIsPostOptionsOpen(false)}>Cancel</li>
          </ul>
        </div>
      </div>
      }
    </div>
  )
}

export default Home