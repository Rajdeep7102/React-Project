import React from 'react'
import './Blog.css'
import {Link} from 'react-router-dom'
import { useEffect, useState } from 'react';
import axios from 'axios';
const Blog = () => {
    const [topBlogs, setTopBlogs] = useState([]);

    useEffect(() => {
      // Fetch top 4 blogs when the component mounts
      const fetchTopBlogs = async () => {
        try {
          const response = await axios.get('http://localhost:8000/top-blogs');
          setTopBlogs(response.data);
        } catch (error) {
          console.error('Error fetching top blogs:', error);
        }
      };
  
      fetchTopBlogs();
    }, []);

    const handleDivClick = (selectedPost) =>{
        navigate(`/displayblogs/${selectedPost._id}`,{state:{selectedPost}});
      };


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

                {topBlogs.map((blog) => (
        <div key={blog._id} className='popular-blog-links flex ' onClick={() => handleDivClick(blog)}>
          <div className='popular-blog-thumbnail'>
            <img className='blog-link-image' src='images/images.jpeg' alt="" />
          </div>
          <div className='popular-blog-content'>
            <p>{blog.Heading}</p>
          </div>
        </div>
      ))}

            </div>
        </div>
    </div>
  )
}

export default Blog