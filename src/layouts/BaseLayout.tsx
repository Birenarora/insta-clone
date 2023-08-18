import React, { ReactNode, useRef, useState } from 'react'
import './BaseLayout.css'
import SideNavbar from '../components/SideNavbar/SideNavbar'
import TopNavbar from '../components/TopNavbar/TopNavbar'
import BottomNavbar from '../components/BottomNavbar/BottomNavbar'
import CreatePost from '../components/CreatePost/CreatePost'
import CancelIcon from '@mui/icons-material/Cancel';
import { lightBlue, lightGreen } from '@mui/material/colors'
import { HighlightOffTwoTone } from '@mui/icons-material'
import { useOutsideClick } from '../hooks/OutsideClick'

function BaseLayout({ children } : { children: ReactNode }) {

  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false)
  const [isCommonModalOpen, setIsCommonModalOpen] = useState(false)
  const divRef = useOutsideClick(() => {
    setIsCommonModalOpen(false)
  })

  return (
    <div>
        <TopNavbar handleCreatePostOpen={() => setIsCreatePostOpen(true)} handleIsCommonModalOpen = {() => setIsCommonModalOpen(true)} />
        <main className='common__container'>
            <SideNavbar handleCreatePostOpen={() => setIsCreatePostOpen(true)} handleIsCommonModalOpen = {() => setIsCommonModalOpen(true)} />
            {children}
            {isCreatePostOpen && <CreatePost setIsCreatePostOpen={setIsCreatePostOpen} />}
        </main>
        <BottomNavbar handleIsCommonModalOpen = {() => setIsCommonModalOpen(true)} />
        {isCommonModalOpen && 
        <div className='common__modal'>
            <div ref={divRef} className="common__modal__box">
              <p><strong>Feature coming soon...</strong></p>
              <span className='cancel__icon__modal' onClick={() => setIsCommonModalOpen(false)}>X</span>
            </div>
        </div>
        }
    </div>
  )
}

export default BaseLayout