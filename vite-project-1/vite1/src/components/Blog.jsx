import React from 'react'
import './Blog.css'
import {Link} from 'react-router-dom'
import { useEffect, useState } from 'react';
import axios from 'axios';
import {useNavigate} from "react-router-dom"
import Cookies from 'js-cookie';

const Blog = () => {
    const [topBlogs, setTopBlogs] = useState([]);
    const navigate = useNavigate();
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

    const extractImgTags = (htmlContent) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlContent, 'text/html');
      const imgTags = doc.querySelectorAll('img');
      return Array.from(imgTags).map(imgTag => imgTag.outerHTML);
    };

    // const handleDivClick = (selectedPost) =>{
    //     navigate(`/displayblogs/${selectedPost._id}`,{state:{selectedPost}});
    //   };

   const handleDivClick = async (selectedPost) =>{
        try {
          const loggedInUsername = Cookies.get('loggedInUsername');
          console.log(selectedPost._id)
          const response = await axios.put(`http://localhost:8000/api/increment-views/${selectedPost._id}`, {
            loggedInUsername: loggedInUsername,
          method: 'PUT', // Use PUT method for updating
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if(response.status === 204){
          navigate(`/displayblogs/${selectedPost._id}`,{state:{selectedPost}});
        }
        else{
          console.error('Failed to update views:',response.status,response.statusText);
        }
      } catch(error){
        console.error('Error updating views:',error);
      }
       // navigate(`/displayblogs/${selectedPost._id}`,{state:{selectedPost}});
      };
      

  return (
    <div className='flex space-x-10 ' id="blog">
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
          {extractImgTags(blog.Content).slice(0, 1).map((imgTag, index) => (
          <div className=' w-1/6 ' key={index} dangerouslySetInnerHTML={{ __html: imgTag }} />
        ))}
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