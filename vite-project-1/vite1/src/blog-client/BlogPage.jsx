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
  const extractImgTags = (htmlContent) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    const imgTags = doc.querySelectorAll('img');
    return Array.from(imgTags).map(imgTag => imgTag.outerHTML);
  };  
  
    const [username,setUsername] = useState(null);
    const navigate = useNavigate();
    const [blogPosts,setBlogPosts] = useState([]);
    const [searchInput, setSearchInput] = useState('');


    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.get('http://localhost:8000/blogdata');
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

const getFirstImageUrl = (Content) => {
  const imgUrl = Content.match(/<img src="(.*?)"/);
  return imgUrl ? imgUrl[1] : null; // Return the URL or null if not found
}

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


const filteredBlogPosts =
searchInput === ''
  ? blogPosts // Show all blogs if search input is empty
  : blogPosts.filter((post) => post.Content.toLowerCase().includes(searchInput.toLowerCase()));

  return (
   <main id="blogpage">
    <header >
        
        <Link className='logo' to="/userprofile"> MyBlog</Link>
        <Link to="/">Home</Link>
        <form action="">
            
            <label>     <input type="text"
              className="search"
              placeholder="Search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}/></label>
        </form>
        <nav>
        <button className='mb-10' onClick={handleWriteBlog}>Write</button>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
            
        </nav>
    </header>
    {/* <DisplayPosts/> */} 
    {
  filteredBlogPosts.map(item => (
    <div className="post space-x-4" key={item._id} onClick={() => handleDivClick(item)}>
     
        {extractImgTags(item.Content).slice(0, 1).map((imgTag, index) => (
          <div className=' w-auto h-48 overflow-hidden ' key={index} dangerouslySetInnerHTML={{ __html: imgTag }} />
        ))}
      
      <div className="texts">
        <h2>{item.Heading.slice(0,45)}...</h2>
        <p className='info'>
          <a className='author' href='#/author'>{item.Author} </a>
          <time>{item.Time}</time>
        </p>
        <p className='summary'>{item.Summary}</p>
      </div>
    </div>
  ))
}


   </main>
  )
}

export default BlogPage