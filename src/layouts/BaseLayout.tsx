import React, { ReactNode, useState } from 'react'
import './BaseLayout.css'
import SideNavbar from '../components/SideNavbar/SideNavbar'
import TopNavbar from '../components/TopNavbar/TopNavbar'
import BottomNavbar from '../components/BottomNavbar/BottomNavbar'
import CreatePost from '../components/CreatePost/CreatePost'

function BaseLayout({ children } : { children: ReactNode }) {

  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false)

  return (
    <div>
        <TopNavbar />
        <main className='common__container'>
            <SideNavbar handleCreatePostOpen={() => setIsCreatePostOpen(true)} />
            {children}
            {isCreatePostOpen && <CreatePost setIsCreatePostOpen={setIsCreatePostOpen} />}
        </main>
        <BottomNavbar />
    </div>
  )
}

export default BaseLayout