import React from 'react'
import './BlogPage.css'
import { Link } from 'react-router-dom'
import {useState,useEffect} from 'react';
import Cookies from 'js-cookie';
import {useNavigate } from "react-router-dom";
// import blogs from '../../../vite1-backend/BlogDataModel'
import DisplayBlogs from './DisplayBlogs'
import DisplayPosts  from './DisplayPosts';
import axios from 'axios';

const BlogPage = () => {
    const [username,setUsername] = useState(null);
    const navigate = useNavigate();
    const [blogPosts,setBlogPosts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.get('http://localhost:8000/blogdata');
            console.log(response)
            console.log('Hi')
            setBlogPosts(response.data); // Assuming response.data is an array of blog posts
          } catch (error) {
            console.error('Error fetching data:', error);
          }
    
          // Check if the user is already authenticated
          const loggedInUsername = Cookies.get('loggedInUsername');
          console.log(loggedInUsername)
          // blogPosts.forEach(item => {
            
          // })
          // if (loggedInUsername) {
          //   try {
          //     const response = await fetch('http://localhost:5173/register', {
          //       credentials: 'include',
          //     });
          //     const userInfo = await response.json();
          //     console.log(userInfo)
          //     setUsername(userInfo.Author);
          //   } catch (error) {
          //     console.error('Error fetching user profile: ', error);
          //   }
          // }
        };
    
        fetchData();
      }, []);



const handleWriteBlog = () => {
    const loggedInUsername = Cookies.get('loggedInUsername');
    if (loggedInUsername) {
        navigate('/writeblog');
      } else {
        // Show an alert if not logged in
        alert('Please log in first.');
      }
}

  return (
   <main id="blogpage">
    <header >
        
        <Link className='logo' to="/displayblogs"> MyBlog</Link>
        <Link to="/">Home</Link>
        <form action="">
            
            <label>     <input type="text" className="search" placeholder='search '  /></label>
        </form>
        <nav>
        <button className='mb-10' onClick={handleWriteBlog}>Write</button>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
            
        </nav>
    </header>
    {/* <DisplayPosts/> */}
    {
      blogPosts.map(item => (
        <div className="post">
         <div className="image">
             <img src="images/images.jpeg" alt="Nothing image" />
         </div>
         <div className="texts">
             <h2>{item.Heading}</h2>
             <p className='info'>
                 <a className='author' href='#/author'>{item.Author} </a>
                 <time>{item.Time}</time>
                 </p>
                 <p className='summary'>{item.Content}
             </p></div>
     </div>
      ))
    }


   </main>
  )
}

export default BlogPage