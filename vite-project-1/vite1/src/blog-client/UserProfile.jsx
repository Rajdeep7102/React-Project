import React, { useState,useEffect } from 'react'
import {useLocation} from "react-router-dom";
import Cookies from 'js-cookie';
import sanitizeHtml from 'sanitize-html';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {useNavigate } from "react-router-dom";


const UserProfile = () => {

    // const location = useLocation();
    // const selectedPost = location.state.selectedPost;
    const loggedInUsername = Cookies.get('loggedInUsername');
    const navigate = useNavigate();
    // const sanitizedContent = sanitizeHtml(selectedPost.Content);
    const [blogPosts,setBlogPosts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.get('http://localhost:8000/blogdata');
            console.log('Hi')
            setBlogPosts(response.data); // Assuming response.data is an array of blog posts
          } catch (error) {
            console.error('Error fetching data:', error);
          }
    
          // Check if the user is already authenticated
          const loggedInUsername = Cookies.get('loggedInUsername');
          console.log("loggedin user",loggedInUsername)

        };
    
        fetchData();
      }, []);

      const userBlogPosts = blogPosts.filter(item => item.Author === loggedInUsername);

      const handleDivClick = (selectedPost) =>{
        navigate(`/displayblogs/${selectedPost._id}`,{state:{selectedPost}});
      };

      const handleDelete = async (item) => {
        // Ask for confirmation before deleting
        const confirmDelete = window.confirm('Are you sure you want to delete this post?');
    
        if (confirmDelete) {
          try {
            // Perform delete operation in the database
            const response = await axios.delete(`http://localhost:8000/blogdata/${item._id}`);
            console.log('Post deleted successfully:', response.data);
    
            // Update the UI by removing the deleted post from the state
            setBlogPosts(prevPosts => prevPosts.filter(post => post._id !== item._id));
          } catch (error) {
            console.error('Error deleting post:', error);
          }
        }
      };

  return (<>
  <div>

    <nav>
        <Link></Link>
    </nav>
    {
      userBlogPosts.map(item => (
        <div className="flex space-x-4" key={item._id} onClick={() => handleDivClick(item)}>
         <div className="">
             <img src="images/images.jpeg" alt="Nothing image" />
         </div>
         <div className="text-start w-8/12">
             <h2>{item.Heading}</h2>
             <p className='info'>
                 <a className='author' href='#/author'>{item.Author} </a>
                 <time>{item.Time}</time>
                 </p>
                 <p className='summary'>{item.Summary}
             </p></div>
            <div>
                <button onClick={() => handleDelete(item)}>Delete</button>
            </div>
     </div>
      ))
    }
  </div>
  </>
  )
}

export default UserProfile