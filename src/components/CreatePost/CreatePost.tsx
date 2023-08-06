import React from 'react'
import './CreatePost.css'

function CreatePost({ setIsCreatePostOpen } : { setIsCreatePostOpen: (flag: boolean) => void }) {
  return (
    <div className='createpost__container' onClick={() => setIsCreatePostOpen(false)}>
        <div className="createpost__container__box">
            <div className="createpost__container__box__header">

            </div>
            <div className="createpost__container__box__body">
                
            </div>
        </div>
    </div>
  )
}

export default CreatePost