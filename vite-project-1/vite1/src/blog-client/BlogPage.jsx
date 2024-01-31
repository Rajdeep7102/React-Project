import React from 'react'
import './BlogPage.css'
import { Link } from 'react-router-dom'
import {useState,useEffect} from 'react';
import Cookies from 'js-cookie';
import {useNavigate } from "react-router-dom";
// import blogs from '../../../vite1-backend/BlogDataModel'
import DisplayBlogs from './DisplayBlogs'
import UserProfile from './UserProfile'
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


const handleDivClick = async (selectedPost) =>{
  try {
    console.log(selectedPost._id)
    const response = await axios.put(`http://localhost:8000/api/increment-views/${selectedPost._id}`, {
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
   <main id="blogpage">
    <header >
        
        <Link className='logo' to="/userprofile"> MyBlog</Link>
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
        <div className="post" key={item._id} onClick={() => handleDivClick(item)}>
         <div className="image">
             <img src="images/images.jpeg" alt="Nothing image" />
         </div>
         <div className="texts">
             <h2>{item.Heading}</h2>
             <p className='info'>
                 <a className='author' href='#/author'>{item.Author} </a>
                 <time>{item.Time}</time>
                 </p>
                 <p className='summary'>{item.Summary}
             </p></div>

     </div>
      ))
    }


   </main>
  )
}

export default BlogPage