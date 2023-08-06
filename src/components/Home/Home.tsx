import React, { useState } from 'react'
import './Home.css'
import { Favorite, FavoriteBorder, ModeCommentOutlined, Telegram } from '@mui/icons-material'
import { Link } from 'react-router-dom'

function Home() {

  const [likeState, setLikeState] = useState(false)
  const [viewMoreText, setViewMoreText] = useState(false)

  return (
    <div className='home__container'>
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
        </div>
      </div>
    </div>
  )
}

export default Home