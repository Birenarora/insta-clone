import React from 'react'
import './TopNavbar.css'
import { AddCircleOutline, FavoriteBorder } from '@mui/icons-material'
import { Link } from 'react-router-dom'

function TopNavbar() {
  return (
    <div className='topnavbar__container'>
      <div className="topnavbar__container__box">
        <Link to='/'>Instagram</Link>
        <div className="topnavbar__container__box__icons">
          <AddCircleOutline />
          <FavoriteBorder />
        </div>
      </div>
    </div>
  )
}

export default TopNavbar