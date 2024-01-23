import React from 'react'
import Home from './Home'
import {Link as LinkRouter} from 'react-router-dom'
import {Link as LinkScroll} from 'react-scroll/modules'
const header = () => {
  return (
    <div className=''>
        <nav className=' bg-blend-soft-light  justify-center  p-2 '>
           <LinkRouter className='mx-4 text-slate-600 font-bold'to="/">Home</LinkRouter>
           <LinkScroll className='mx-4 text-slate-600 font-bold' spy={true} smooth={true} offset={50} duration={500} to="tools">Tools</LinkScroll>
           <LinkRouter className='mx-4 text-slate-600 font-bold'  to="/blogpage">Blogs</LinkRouter>
           <LinkScroll className='mx-4 text-slate-600 font-bold' spy={true} smooth={true} offset={50} duration={500} to="about">About</LinkScroll>
        </nav>
    </div>


  )
}

export default header