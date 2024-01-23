import React from 'react'
import './Blog.css'
import {Link} from 'react-router-dom'
const Blog = () => {
  return (
    <div className='flex space-x-10'>
        <Link to="/blogpage ">
        <div className="glass">
            <h1 className='blog-h1'>Latest</h1>
            <div className='latest-blog flex'>
                <div className='latest-blog-image '>
                <img className='latest-blog-thumbnail' src="images/tools.png" alt="" />
                </div>
                <div className="latest-blog-content">This is some text</div>
            </div>
        </div>
        </Link>
        <div className='popular-blog'>
            <div className='popular-blog-heading'>
            <h1 className='popular-blog-h1'>Popular</h1>
                <div className='popular-blog-links flex'>
                    <div className='popular-blog-thumbnail'>
                        <img className='blog-link-image' src="images/generativeai.jpeg" alt="" />
                    </div>
                    <div className='popular-blog-content'>
                        This is some of the popular content
                    </div>
                </div>
                <div className='popular-blog-links flex'>
                    <div className='popular-blog-thumbnail'>
                        <img className='blog-link-image' src="images/generativeai.jpeg" alt="" />
                    </div>
                    <div className='popular-blog-content'>This is some of the popular content</div>
                </div>
                <div className='popular-blog-links flex'>
                    <div className='popular-blog-thumbnail'>
                        <img className='blog-link-image' src="images/generativeai.jpeg" alt="" />
                    </div>
                    <div className='popular-blog-content'>This is some of the popular content</div>
                </div>
                <div className='popular-blog-links flex'>
                    <div className='popular-blog-thumbnail'>
                        <img className='blog-link-image' src="images/generativeai.jpeg" alt="" />
                    </div>
                    <div className='popular-blog-content'>This is some of the popular content</div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Blog